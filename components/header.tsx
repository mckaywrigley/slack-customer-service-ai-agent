"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6" />
          <h1 className="text-xl font-bold">My App</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/"
            className="hover:underline"
          >
            Home
          </Link>
          <SignedIn>
            <Link
              href="/dashboard"
              className="hover:underline"
            >
              Dashboard
            </Link>
          </SignedIn>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-primary-foreground text-primary p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link
                  href="/dashboard"
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              </li>
            </SignedIn>
          </ul>
        </nav>
      )}
    </header>
  );
}
