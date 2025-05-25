"use client"

import React, { useEffect, useState } from "react"
import localFont from "next/font/local"
import Script from "next/script"
import Ad from "@/app/Ad"

const numberPlateFont = localFont({ src: '../../ukplate.woff2' })

export default function Component({ dvla, tfl, dvsa, scotland, vrm}) {

    // Legacy
    const basic = dvla
    const sLEZ = scotland


    const makeDatePretty = (date) => {
      const d = new Date(date) // so we can just throw in a string
      const day = d.getDate()
      const month = d.getMonth() + 1
      const year = d.getFullYear()
      return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`
    }
    function daysUntil(startDate, endDate) {
      const oneDay = 1000 * 60 * 60 * 24;
      const start = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const end = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      return (start - end) / oneDay;
    }

    if(!basic || !tfl || !sLEZ || !dvsa) return <div>Loading...</div>
    return (
      <div className="w-full flex flex-row items-center justify-center">
        <Script src="/aff.js" />
        <div className="w-[80%] bg-[#3a3a3a] rounded-xl p-4">
          <span className={`p-2 rounded-md mandatory-font bg-[#FFFF00] text-3xl text-black ${numberPlateFont.className} text-center capitalize`}>{decodeURIComponent(vrm)}</span>
          
          <div className="grid md:grid-cols-2 grid-cols-1 md:grid-rows-1 gap-4 pt-2">
              <div className={`rounded-md p-2 ${basic.tax.status == "Taxed" ? "bg-green-700" : basic.tax.status == "SORN" ? "bg-yellow-700" : "bg-red-700"}`}>
                  <span className="text-2xl font-bold">Tax</span>
                  {basic.tax.status == "SORN" ? <p className="text-xl text-center">Vehicle is registered as off the road.</p> : 
                  basic.tax.status == "Taxed" ? <p className="text-xl text-center">Your vehicle&apos;s tax is valid.<br />Expires on {makeDatePretty(basic.tax.due)} (in {daysUntil(new Date(), new Date(basic.tax.due))} days)</p> :
                  <p className="text-xl text-center">Your vehicle is untaxed.<br />Your vehicle&apos;s tax expired on {makeDatePretty(basic.tax.due)} ({daysUntil(new Date(basic.tax.due), new Date())} days ago).</p>}
                </div>
                <div className={`rounded-md p-2 ${basic.mot.status == "Valid" ? "bg-green-700" : basic.mot.status == "No details held by DVLA" || basic.mot.status == "No results returned" ? "bg-blue-700" : "bg-red-700"}`}>
                  <span className="text-2xl font-bold">MOT</span>
                  {basic.mot.status == "No details held by DVLA" || basic.mot.status == "No results returned" ? <p className="text-xl text-center">Information not held by the DVLA.<br />This vehicle is likely MOT exempt.</p> :
                  basic.mot.status == "Valid" ? <p className="text-xl text-center">Your vehicle&apos;s MOT is valid.<br />Expires on {makeDatePretty(basic.mot.due)} (in {daysUntil(new Date(), new Date(basic.mot.due))} days)</p> :
                  <p className="text-xl text-center">Your vehicle does not have a valid MOT.<br />Your vehicle&apos;s MOT expired on {makeDatePretty(basic.mot.due)} ({daysUntil(new Date(basic.mot.due), new Date())} days ago).</p>}
                </div>
          </div>

          <div className="grid lg:grid-cols-3 lg:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#2a2a2a] p-4 rounded-xl mt-2 w-full">
            <h2 className="text-lg font-semibold text-white mb-4">Emissions</h2>
            <div className="bg-[#3a3a3a] shadow rounded-lg divide-y">
              <div className="flex justify-between px-4 py-3">
                <span>ULEZ Compliant</span>
                <span className="font-semibold">{tfl.ulez ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>LEZ Compliant</span>
                <span className="font-semibold">{tfl.lez ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Blackwall & Silvertown Tunnels Exempt</span>
                <span className="font-semibold">Unavailable*</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Scotland LEZ Compliant</span>
                <span className="font-semibold">{sLEZ.compliant ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>EURO Status</span>
                <span className="font-semibold">{basic.info.euro}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>CO2 Emissions</span>
                <span className="font-semibold">{basic.info.co2} g/km</span>
              </div>
            </div>
                          <span className="text-sm text-gray-300">*removed due to data accuracy issues.</span>

          </div>
          <div className="bg-[#2a2a2a] p-4 rounded-xl mt-2 w-full">
            <h2 className="text-lg font-semibold text-white mb-4">Vehicle Information</h2>
            <div className="bg-[#3a3a3a] shadow rounded-lg divide-y">
              <div className="flex justify-between px-4 py-3">
                <span>Make</span>
                <span className="font-semibold">{dvsa.make}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Model</span>
                <span className="font-semibold">{dvsa.model}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Colour</span>
                <span className="font-semibold">{basic.info.colour}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Fuel Type</span>
                <span className="font-semibold">{basic.info.fuel}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="">Age</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {new Date().getFullYear() - basic.info.manufacture} years
                  </div>
                  <div className="text-sm text-gray-300">
                    Registered {basic.info.registered}
                  </div>
                </div>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Weight</span>
                <span className="font-semibold">{basic.info.weight == "Unknown" ? "Unknown" : `${basic.info.weight}kg`}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Type</span>
                <span className="font-semibold">{basic.info.type}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Last V5C Issued</span>
                <span className="font-semibold">{makeDatePretty(basic.info.lastV5C)}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#2a2a2a] p-4 rounded-xl mt-2 w-full">
            <h2 className="text-lg font-semibold text-white mb-4">MOT</h2>
              {dvsa.tests.length > 0 ?             <div className="bg-[#3a3a3a] shadow rounded-lg divide-y">

              <div className="flex justify-between px-4 py-3">
                <span>Total Tests</span>
                <span className="font-semibold">{dvsa.tests.length}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Passed Tests</span>
                <span className="font-semibold">{dvsa.tests.filter(t => t.testResult === "PASSED").length}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Failed Tests</span>
                <span className="font-semibold">{dvsa.tests.filter(t => t.testResult === "FAILED").length}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Latest MOT Result</span>
                <span className="font-semibold">{dvsa.tests[0].testResult.replaceAll("ED","")}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span>Miles Driven</span>
                <span className="font-semibold">{dvsa.tests[0].odometerValue || 0}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="">Next MOT Due</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {makeDatePretty(basic.mot.due)}
                  </div>
                  <div className="text-sm text-gray-300">
                    {new Date(basic.mot.due) > new Date() ? `In ${daysUntil(new Date(), new Date(basic.mot.due))} days`: `${daysUntil(new Date(basic.mot.due), new Date())} days ago`}
                  </div>
                </div>
                </div>
                        </div>

: <p className="text-lg text-white">This vehicle does not have an MOT history.</p>}
          </div>
                              </div>


        <div className="bg-[#2a2a2a] p-4 rounded-xl mt-2">
            <h2 className="text-lg font-semibold text-white mb-4">MOT History</h2>
              {dvsa.tests.length > 0 ?             <div>
              {dvsa.tests.map((test, i) => (
                <div key={test.motTestNumber}>
                {i%7==0 ? <Ad/>:""}
               <div className={`bg-[#3a3a3a] shadow rounded-lg divide-y mb-2 border-2 ${test.testResult == "PASSED" ? "border-green-700":"border-red-700"}`}>
                  <div className="flex justify-between px-4 py-3">
                    <span>Test Date</span>
                    <span className="font-semibold">{makeDatePretty(test.completedDate)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3">
                    <span>Test Result</span>
                    <span className="font-semibold">{test.testResult}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3">
                    <span>Mileage</span>
                    <span className="font-semibold">{test.odometerValue || 0}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3">
                    <span>Faults</span>
                    <span className="font-semibold">{test.defects.length > 0 ? (
                      <div>
                        {test.defects.map((defect, i) => (
                          <div key={i} className="text-right">
                            {defect.text}&nbsp;<span className={`p-0.5 rounded-md border ${
                              defect.type == "MAJOR" || defect.type == "FAIL" || defect.type == "PRS" ? "bg-red-700" 
                              : defect.type == "MINOR" ? "bg-green-700" 
                              : defect.type == "ADVISORY" ? "bg-yellow-700" : "bg-gray-700"}`}>{defect.type}</span>
                          </div>
                        ))}
                      </div>
                    ) : <span className="text-right">Vehicle passed MOT with no advisory notices.</span>}</span>
                  </div>
                  {i%3==0 ? <div className="aff-placement text-white">Ad Placement</div>:""}
                </div>
                </div>
              ))}
                          </div>
: <p className="text-lg text-white">This vehicle does not have an MOT history.</p>}
          </div>
      </div>      
</div>    )
  }

  //                  
//