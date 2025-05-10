"use server";

import axios from "axios";
import QueryString from "qs";
import Component from "./Component";

export default async function Page({ params }) {
  const { vrm } = await params;
  try {
    const monthYearToPretty = (dateString) => {
      const date = new Date(dateString);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Fetch TFL data
    const tflResponse = await axios.post(
      "https://mobileapi.tfl.gov.uk/Prod/unirucCapitaFacade/VRMLookup",
      {
        vrmLookupRequest: { vRM: vrm, country: "UK", date: {} },
      }
    );
    const tflData = tflResponse.data.vrmLookupResponse.vehicleDetails.chargeability;
    const tfl = {
      ulez: tflData.isUlezChargeable !== 1,
      lez: tflData.isLezChargeable !== 1,
      cc: tflData.isCcChargeable !== 1,
      tunnels: tflResponse.data.vrmLookupResponse.vehicleDetails.isTucChargeable !== 2,
    };

    // Fetch DVSA access token
    const dvlaTokenResponse = await axios.post(
      process.env["DVSA_LOGIN_URL"],
      QueryString.stringify({
        grant_type: "client_credentials",
        client_id: process.env["DVSA_CLIENT_ID"],
        client_secret: process.env["DVSA_CLIENT_SECRET"],
        scope: "https://tapi.dvsa.gov.uk/.default",
      })
    );
    const dvlaToken = dvlaTokenResponse.data.access_token;

    // Fetch DVSA vehicle data
    const dvsaResponse = await axios.get(
      `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${vrm}`,
      {
        headers: {
          Authorization: `Bearer ${dvlaToken}`,
          "X-API-Key": process.env["DVSA_API_KEY"],
        },
      }
    );
    const dvsa = {
      make: dvsaResponse.data.make,
      model: dvsaResponse.data.model,
      tests: dvsaResponse.data.motTests || [],
    };

    // Fetch Scotland LEZ compliance
    const scotlandCSRF = await axios.get(
      "https://lowemissionzones.scot/actions/blitz/csrf/json"
    );
    const scotlandCSRFToken = scotlandCSRF.data.token;
    const scotlandCSRFHeader = scotlandCSRF.headers["set-cookie"][0].split(";")[0];

    const scotlandResponse = await axios.post(
      "https://lowemissionzones.scot/index.php?p=actions/compliance-module/default/check",
      QueryString.stringify({
        CRAFT_CSRF_TOKEN: scotlandCSRFToken,
        vrn: vrm,
        origin: "UK",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: scotlandCSRFHeader,
        },
      }
    );
    const scotlandData = scotlandResponse.data.data.vehicleResult[0];
    const scotland = {
      compliant: scotlandData.status === "compliant" || scotlandData.status === "exempt",
    };

    // Fetch DVLA vehicle details
    const dvlaResponse = await axios.post(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      { registrationNumber: decodeURIComponent(vrm).toUpperCase().replaceAll(" ","") },
      {
        headers: {
          "x-api-key": process.env["DVLA_API"],
          "Content-Type": "application/json",
        },
      }
    );
    const dvlaData = dvlaResponse.data;
    const dvlaDetails = {
      tax: {
        status: dvlaData.taxStatus || "Unknown",
        due: dvlaData.taxDueDate || "Unknown",
      },
      mot: {
        status: dvlaData.motStatus || "Unknown",
        due: dvlaData.motExpiryDate || "Unknown",
      },
      info: {
        registered: dvlaData.monthOfFirstRegistration
          ? monthYearToPretty(dvlaData.monthOfFirstRegistration)
          : "Unknown",
        lastV5C: dvlaData.dateOfLastV5CIssued || "Unknown",
        make: dvlaData.make || "Unknown",
        colour: dvlaData.colour || "Unknown",
        manufacture: dvlaData.yearOfManufacture || "Unknown",
        engineCapacity: dvlaData.engineCapacity || "Unknown",
        co2: dvlaData.co2Emissions || "Unknown",
        type: dvlaData.typeApproval || "Unknown",
        fuel: dvlaData.fuelType || "Unknown",
        weight: dvlaData.revenueWeight || "Unknown",
        export: dvlaData.markedForExport || "Unknown",
        wheelPlan: dvlaData.wheelplan || "Unknown",
        euro: dvlaData.euroStatus || "Unknown",
      },
    };

    return <Component dvla={dvlaDetails} tfl={tfl} dvsa={dvsa} scotland={scotland} vrm={vrm} />
  } catch (err) {
    if(err.response.data) {console.log(err.response.data)}
    console.log(err)
    return <div>An unexpected error has occoured.</div>
  }
}
