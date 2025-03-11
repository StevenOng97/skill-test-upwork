import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();
  const redirectUrl = session ? "/dashboard" : "/sign-in";

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to WriteRight</h1>
        <h3 className="text-gray-500 my-3">
          An AI Powered Grammar Checker.
        </h3>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href={redirectUrl}>
            <button
              type="button"
              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get Started
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
