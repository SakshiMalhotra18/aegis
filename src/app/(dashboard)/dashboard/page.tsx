"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const mockResults = [
  {
    name: "ChatGPT Web",
    type: "Browser Tool",
    risk: "HIGH",
    users: 12,
  },
  {
    name: "Zapier AI Agent",
    type: "Automation Agent",
    risk: "MEDIUM",
    users: 5,
  },
  {
    name: "Internal GPT Bot",
    type: "Custom Agent",
    risk: "LOW",
    users: 2,
  },
];

const riskColorMap: Record<string, string> = {
  LOW: "text-green-500",
  MEDIUM: "text-yellow-500",
  HIGH: "text-red-500",
};

const riskBadgeBg: Record<string, string> = {
  LOW: "bg-green-50 border-green-200",
  MEDIUM: "bg-yellow-50 border-yellow-200",
  HIGH: "bg-red-50 border-red-200",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleScan = () => {
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  const highRiskCount = results?.filter((r) => r.risk === "HIGH").length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Shadow AI Scanner</h1>
        <p className="text-gray-500 text-sm">
          Discover AI tools and agents in your organization
        </p>
      </div>

      {/* ── Scan Button ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleScan}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium
                     hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Scanning...
            </>
          ) : (
            "Run Scan"
          )}
        </button>

        {results && !loading && (
          <span className="text-sm text-gray-400">
            Scan complete — {results.length} tool
            {results.length !== 1 ? "s" : ""} detected
          </span>
        )}
      </div>

      {/* ── Results ── */}
      {results && !loading && (
        <div className="flex flex-col gap-6">
          {/* Summary */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-0.5 px-5 py-3 rounded-lg border bg-gray-50">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Total Detected
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {results.length}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 px-5 py-3 rounded-lg border bg-red-50 border-red-200">
              <span className="text-xs text-red-500 uppercase tracking-wide font-medium">
                HIGH Risk
              </span>
              <span className="text-2xl font-bold text-red-600">
                {highRiskCount}
              </span>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((tool) => (
              <Card
                key={tool.name}
                className={`border ${riskBadgeBg[tool.risk]} shadow-sm`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tool.name}</CardTitle>
                  <p className="text-xs text-gray-500">{tool.type}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Risk Level
                    </span>
                    <span
                      className={`text-sm font-semibold ${riskColorMap[tool.risk]}`}
                    >
                      {tool.risk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Users Affected
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {tool.users}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
