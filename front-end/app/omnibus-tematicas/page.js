"use client";
import React, { useEffect, useState, useRef } from "react";
import Article from "../components/article";
import Chart from "chart.js/auto";
import { Vidaloka } from "next/font/google";
import WhatsappIcon from "../assets/WhatsAppIcon.png"
import TwitterIcon from "../assets/TwitterIcon.png"
import FacebookIcon from "../assets/FacebookIcon.png"
import Themes from "../components/themes";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col bg-[#F3F6F9]">
      <Themes category="omnibus" />
    </main>
  );
}