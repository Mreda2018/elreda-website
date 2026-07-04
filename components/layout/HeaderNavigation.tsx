"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type HeaderNavigationItem = {
  label: string;
  href: string;
};

export type HeaderNavigationProps = {
  ariaLabel: string;
  items: HeaderNavigationItem[];
};

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNavigation({ ariaLabel, items }: HeaderNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className="hidden items-center gap-[var(--space-1)] rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-[var(--space-1)] lg:flex"
    >
      {items.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "micro-nav-link rounded-full px-4 py-2.5 text-small font-medium leading-none text-text-secondary outline-none hover:bg-surface-elevated hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-button rtl:text-ar-small",
              isActive &&
                "bg-surface-elevated text-white shadow-sm ring-1 ring-[color:var(--glass-border)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
