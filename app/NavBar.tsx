"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <header className="flex items-center shadow-md min-h-[10vh] bg-white fixed w-full z-50">
        <div className="flex justify-between items-center w-full px-4">
          <Link href="/login">
            <Image
              src="/evangadi-logo.png"
              alt="Evangadi logo"
              width={200}
              height={50}
              className="w-52"
            />
          </Link>
          <button
            onClick={toggleDropdown}
            className="text-2xl text-orange-500 md:hidden"
          >
            ☰
          </button>

          <nav className="hidden md:flex space-x-5 items-center ">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-500 font-bold"
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-500 font-bold"
            >
              How it works
            </Link>
            <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-orange-500">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {isDropdownOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border border-gray-300 p-4 md:hidden">
          <Link href="/" className="block text-gray-700 hover:text-orange-500">
            Home
          </Link>
          <Link href="/" className="block text-gray-700 hover:text-orange-500">
            How it works
          </Link>
          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-orange-500 w-full">
            Sign In
          </button>
        </div>
      )}
    </>
  );
};

export default NavBar;
