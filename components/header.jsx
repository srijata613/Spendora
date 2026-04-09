"use client";

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 w-full bg-white-50 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/">
          <Image
            src="/logo.png"
            alt="Spendora Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {!isSignedIn && (
            <>
              <a href="#features" className="text-gray-600 hover:text-purple-600">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600">
                Testimonials
              </a>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">

          {isSignedIn && (
            <>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-purple-600 flex items-center gap-2"
              >
                <Button variant="outline">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/transaction/create">
                <Button className="flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
            </>
          )}

          {!isSignedIn && (
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          )}

          {isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          )}

        </div>

      </nav>
    </header>
  );
};

export default Header;