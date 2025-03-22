"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

const ChemistryLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard/courses/chemistry"
                className="text-white font-bold text-xl hover:text-purple-300 transition-colors"
              >
                Chemistry
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/dashboard/courses/chemistry/redox-reactions"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Redox Reactions
              </Link>
              {/* Add more course sections here */}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default ChemistryLayout;
