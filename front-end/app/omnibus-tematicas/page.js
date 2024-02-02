"use client";
import React, {  } from "react";
import Themes from "../components/themes";

export default function Home() {
  useEffect(() => {
		document.title = "Agorar | Omnibus";
	  }, []);
    
  return (
    <main className="flex min-h-screen flex-col bg-[#F3F6F9]">
      <Themes category="omnibus" />
    </main>
  );
}