"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS, GENERAL_MESSAGES } from "@/app/constants";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const resetStates = () => {
    setError(null);
    setEmailError(null);
    setPasswordError(null);
  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      setEmailError("Email is required");
      setPasswordError("Password is required");
      return;
    }

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (!email.includes("@")) {
      setEmailError("Invalid email");
      return;
    }

    setIsLoading(true);
    resetStates();

    try {
      const regsiterResponse = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!regsiterResponse.ok) {
        const errorData = await regsiterResponse.json();
        throw new Error(errorData.error || GENERAL_MESSAGES.INTERNAL_SERVER_ERROR);
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.ok) {
        router.push("/dashboard");
      }

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.log("error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required=""
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1 mb-0">{emailError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required=""
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1 mb-0">{passwordError}</p>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                className={`w-full cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={isLoading}
                onClick={handleSignUp}
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
