"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import FocusTrap from "focus-trap-react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { buttonVariants } from "@/components/ui";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

type MobileMenuItem = {
  label: string;
  href: string;
};

export type MobileMenuProps = {
  locale: Locale;
  ariaLabel: string;
  openLabel: string;
  closeLabel: string;
  items: MobileMenuItem[];
  quoteLabel: string;
  quoteHref: string;
  arabicLabel: string;
  englishLabel: string;
  switchToArabicLabel: string;
  switchToEnglishLabel: string;
};

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu({
  locale,
  ariaLabel,
  openLabel,
  closeLabel,
  items,
  quoteLabel,
  quoteHref,
  arabicLabel,
  englishLabel,
  switchToArabicLabel,
  switchToEnglishLabel,
}: MobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }
  }

  return (
    <div className="shrink-0 lg:hidden">
      <button
        type="button"
        aria-label={openLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-dialog"
        onClick={() => setIsOpen(true)}
        className={buttonVariants({ variant: "subtle", size: "icon" })}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      {isOpen ? (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: "#mobile-navigation-first-link",
            fallbackFocus: "#mobile-navigation-dialog",
            returnFocusOnDeactivate: true,
            escapeDeactivates: false,
          }}
        >
          <div
            id="mobile-navigation-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            tabIndex={-1}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeMenu();
              }
            }}
            onKeyDown={handleKeyDown}
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm rtl:justify-start"
          >
            <div className="flex h-full w-full max-w-md flex-col border-s border-[color:var(--glass-border)] bg-black p-[var(--space-5)] shadow-xl">
              <div className="flex items-center justify-between gap-[var(--space-4)] border-b border-[color:var(--glass-border)] pb-[var(--space-5)]">
                <span className="text-h5 font-semibold text-white">{ariaLabel}</span>
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={closeMenu}
                  className={buttonVariants({ variant: "subtle", size: "icon" })}
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <nav aria-label={ariaLabel} className="flex flex-1 flex-col py-[var(--space-6)]">
                <ul className="flex list-none flex-col gap-[var(--space-2)] p-0" role="list">
                  {items.map((item, index) => {
                    const isActive = isActivePath(pathname, item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          id={index === 0 ? "mobile-navigation-first-link" : undefined}
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={closeMenu}
                          className={cn(
                            "micro-nav-link flex min-h-12 items-center rounded-md px-4 py-3 text-body font-medium text-text-secondary outline-none hover:bg-surface-elevated hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-button rtl:text-ar-body",
                            isActive &&
                              "bg-surface-elevated text-white ring-1 ring-[color:var(--glass-border)]",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="grid gap-[var(--space-4)] border-t border-[color:var(--glass-border)] pt-[var(--space-5)]">
                <Link
                  href={quoteHref}
                  onClick={closeMenu}
                  className={buttonVariants({ size: "md", fullWidth: true })}
                >
                  {quoteLabel}
                </Link>
                <LanguageSwitcher
                  locale={locale}
                  arabicLabel={arabicLabel}
                  englishLabel={englishLabel}
                  switchToArabicLabel={switchToArabicLabel}
                  switchToEnglishLabel={switchToEnglishLabel}
                  onNavigate={closeMenu}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </FocusTrap>
      ) : null}
    </div>
  );
}
