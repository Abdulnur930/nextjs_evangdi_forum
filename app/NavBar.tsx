"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const NavBar = () => {
  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    // --- FIX: Check session via an API endpoint, as the cookie is httpOnly ---
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/auth/check-session");
        if (res.data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Sign out via an API endpoint to clear the httpOnly cookie
      const res = await axios.post("/api/auth/signout");
      if (res.status === 200) {
        setIsLoggedIn(false);
        router.push("/login"); // Redirect after sign out
      }
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const SignInOutButton = () => {
    if (isLoading) {
      return <Skeleton width={100} height={40} borderRadius={8} />;
    }

    return isLoggedIn ? (
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white rounded px-4 py-2 hover:bg-orange-500 transition duration-150"
      >
        Sign Out
      </button>
    ) : (
      <Link
        href="/login"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-orange-500 transition duration-150"
      >
        Sign In
      </Link>
    );
  };

  return (
    <>
      <header className="flex items-center shadow-md min-h-[10vh] bg-white w-full sticky top-0">
        <div className="flex justify-between items-center w-full px-4">
          <Link href="/">
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

          <nav className="hidden md:flex space-x-5 items-center">
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
            <SignInOutButton />
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
          <div className="mt-2">
            <SignInOutButton />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
