"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EduAI Lab</span>
        </Link>

        <nav className="flex flex-1 items-center justify-between space-x-6 px-8">
          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/virtual-lab"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard/virtual-lab")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Labs
              </Link>
              <Link
                href="/dashboard/courses"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard/courses")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Courses
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard/leaderboard")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Leaderboard
              </Link>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logout()}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div
                className="flex items-center space-x-2"
                suppressHydrationWarning
              >
                <Link href="/auth/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
