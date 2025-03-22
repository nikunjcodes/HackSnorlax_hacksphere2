"use client";

import type { ReactNode } from "react";
import { Navbar } from "../components/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
