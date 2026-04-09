"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;

    /* SCROLL EFFECT */
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        element.classList.add("scrolled");
      } else {
        element.classList.remove("scrolled");
      }
    };

    /* CURSOR TILT EFFECT */
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;

      const rotateY = (e.clientX / innerWidth - 0.5) * 20;
      const rotateX = (e.clientY / innerHeight - 0.5) * -20;

      element.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1)
      `;
    };

    const resetTilt = () => {
      element.style.transform = "";
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", resetTilt);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", resetTilt);
    };
  }, []);

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">

        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Take Control of Your Finances with Spendora <br />
          Your Ultimate Expense Tracker
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Spendora is your all-in-one solution for managing your finances
          effortlessly. Track expenses, set budgets, and gain insights into your
          spending habits.
        </p>

        <div className="flex justify-center mb-12">
          <Link href="/dashboard">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>

        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.png"
              alt="Spendora Banner"
              width={1280}
              height={720}
              priority
              className="rounded-lg shadow-2xl border mx-auto"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;