"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const MiniAppButton = () => {
  const router = useRouter();
  const [isMinikitInstalled, setIsMinikitInstalled] = useState(
    MiniKit.isInstalled()
  );

  useEffect(() => {
    const minikitInstall = async () => {
      await MiniKit.install();
      setIsMinikitInstalled(MiniKit.isInstalled());
    };
    minikitInstall();
  }, []);

  return (
    <>
      <button onClick={() => router.push("https://vercel.com")}>
        vercel Router
      </button>
      <div className="text-black mt-3">{`isMinikitInstalled: ${isMinikitInstalled}`}</div>
    </>
  );
};
