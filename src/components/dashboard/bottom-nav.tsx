"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "হোম", icon: Home },
  { href: "/dashboard/deya", label: "দেয়া", icon: ArrowUpRight },
  { href: "/dashboard/paona", label: "পাওনা", icon: ArrowDownLeft },
  { href: "/dashboard/contacts", label: "পরিচিতি", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`relative p-1.5 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
