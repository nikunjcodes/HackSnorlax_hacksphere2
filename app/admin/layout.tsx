"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Users, FlaskRoundIcon, BookOpen, Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/admin/labs",
      label: "Labs",
      icon: FlaskRoundIcon,
    },
    {
      href: "/admin/courses",
      label: "Courses",
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                <div className="flex flex-col space-y-2">
                  {routes.map((route) => (
                    <Link key={route.href} href={route.href}>
                      <span
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                          pathname === route.href ? "bg-accent" : "transparent"
                        }`}
                      >
                        <route.icon className="mr-2 h-4 w-4" />
                        {route.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="mr-4 hidden md:flex">
            <Link href="/admin" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Admin Dashboard</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {routes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <span
                    className={`flex items-center ${
                      pathname === route.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    }`}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
