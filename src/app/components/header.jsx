"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const session = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = async (e) => {
    e.preventDefault();
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/sign-in" });
    setIsSigningOut(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/logo.svg" alt="WriteRight" width={24} height={24} />
          <h1 className="text-2xl font-bold">WriteRight</h1>
        </a>
        {session.data && (
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
