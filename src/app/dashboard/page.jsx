"use client";
import { useState } from "react";

export default function Dashboard() {
  const [paragraph, setParagraph] = useState("");
  const [paragraphError, setParagraphError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!paragraph) {
      setParagraphError("Paragraph is required");
      return;
    }
    setIsLoading(true);
    setParagraphError(null);

    try {
      const response = await fetch("/api/check-grammar", {
        method: "POST",
        body: JSON.stringify({ paragraph }),
      });
      const data = await response.json();
      if (data.error) {
        setParagraphError(data.error);
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error("Error checking grammar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-4xl xl:p-0 mb-4 min-h-[170px]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold">Output</h1>
            {result && (
              <div dangerouslySetInnerHTML={{ __html: result.htmlText }} />
            )}
          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-4xl xl:p-0 min-h-[170px]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <textarea
              id="message"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 pb-0 mb-4"
              placeholder="Write your thoughts here..."
              onChange={(e) => {
                setParagraph(e.target.value);
              }}
            ></textarea>

            {paragraphError && (
              <p className="text-red-500 text-xs mb-0">{paragraphError}</p>
            )}

            <div className="w-full flex justify-end">
              <button
                type="submit"
                className={`cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Checking..." : "Check Grammar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
