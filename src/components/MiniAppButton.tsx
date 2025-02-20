"use client";

// import { MiniKit } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export const MiniAppButton = () => {
  const router = useRouter();
  // const [isMinikitInstalled, setIsMinikitInstalled] = useState(
  //   true
  // );

  // useEffect(() => {
  //   const minikitInstall = async () => {
  //     await MiniKit.install();
  //     setIsMinikitInstalled(MiniKit.isInstalled());
  //   };
  //   minikitInstall();
  // }, []);

  return (
    <>
      <button onClick={() => router.push("https://vercel.com")}>
        vercel Router
      </button>
      <div className="text-black mt-3">{`isMinikitInstalled: ${true}`}</div>
    </>
  );
};
