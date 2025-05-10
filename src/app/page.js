"use client"
import Image from "next/image";
import localFont from 'next/font/local'
import { useState } from "react";
import { useRouter } from 'next/navigation' // ✅ App Router version

const numberPlateFont = localFont({ src: './ukplate.woff2' })

export default function Home() {
  const router = useRouter()

  const [vrm,setVRM] = useState(null)
  const handleClick = () => {
    if(!vrm) return;
    router.push(`/results/${vrm}`)
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl">MOT & Tax Checker</h1>
      <p className="text-lg text-center mt-4">
        Enter your registration plate and get things like MOT history, ULEZ, LEZ, Scotland Clean Air Zone compliance, tax details and more!
      </p>
      <input className={`p-2 rounded-md mandatory-font bg-[#FFFF00] text-3xl text-black ${numberPlateFont.className} text-center capitalize`} onChange={e => {setVRM(e.target.value)}} />
      <button className={`p-2 rounded-md mandatory-font bg-[#FFFF00] text-3xl text-black ${numberPlateFont.className} mt-2 cursor-pointer`} onClick={handleClick}>GO</button>
    </div>
  );
}
