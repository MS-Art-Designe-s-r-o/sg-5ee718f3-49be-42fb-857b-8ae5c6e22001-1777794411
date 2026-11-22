"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Phone, Menu, X, Smartphone, ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { locales } from "@/locales";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, locale } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = t.header.menu;

  const languageSwitcher = (extraClass = "") => (
    <div className={`flex items-center gap-1 ${extraClass}`} aria-label="Language">
      {locales.map((l, idx) => (
        <span key={l} className="flex items-center gap-1">
          {idx > 0 && (
            <span className={isScrolled ? "text-muted-foreground" : "text-white/50"}>|</span>
          )}
          <Link
            href={router.asPath}
            locale={l}
            className={`px-1 font-semibold text-sm uppercase transition-colors ${
              l === locale
                ? isScrolled
                  ? "text-accent"
                  : "text-yellow-400"
                : isScrolled
                  ? "text-[#282462] hover:text-accent"
                  : "text-white hover:text-accent"
            }`}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-[#282462]"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isScrolled ? "" : "bg-white"
            }`}>
              <img
                src="/etaxi_logo_svg.svg"
                alt="E-TAXI Košice – logo taxislužby"
                className="h-12 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {menuItems.map((item) => {
              const linkClass = `font-medium whitespace-nowrap transition-colors ${
                isScrolled ? "text-[#282462] hover:text-accent" : "text-white hover:text-accent"
              }`;
              if (!item.children) {
                return (
                  <Link key={item.label} href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.label} className="relative group">
                  <button type="button" aria-haspopup="true" className={`${linkClass} flex items-center gap-1`}>
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
                  </button>
                  <div className="absolute left-0 top-full hidden pt-3 group-hover:block group-focus-within:block">
                    <ul className="min-w-[200px] rounded-lg border border-border bg-white py-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block whitespace-nowrap px-4 py-2 text-sm font-medium text-[#282462] hover:bg-muted hover:text-accent"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
            <Link
              href="/#aplikacia"
              className={`font-medium transition-colors flex items-center gap-2 ${
                isScrolled
                  ? "text-[#282462] hover:text-accent"
                  : "text-white hover:text-accent"
              }`}
            >
              <Smartphone className="h-4 w-4" />
              {t.header.app}
            </Link>
            {languageSwitcher()}
          </nav>

          {/* Right Side: Call Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link href={t.common.phoneHref} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-accent rounded-full p-3">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-medium ${
                  isScrolled ? "text-muted-foreground" : "text-white/80"
                }`}>
                  {t.common.dispatch}
                </span>
                <span className={`font-bold tabular-nums ${
                  isScrolled ? "text-[#282462]" : "text-white"
                }`}>
                  {t.common.phone}
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {languageSwitcher()}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${
                isScrolled ? "text-[#282462]" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t ${
            isScrolled ? "border-border bg-white" : "border-white/20 bg-[#282462]"
          }`}>
            <nav className="py-4 space-y-1">
              {menuItems.map((item) => {
                const mobClass = `block px-4 py-3 font-medium transition-colors ${
                  isScrolled ? "text-[#282462] hover:bg-muted" : "text-white hover:bg-white/10"
                }`;
                if (!item.children) {
                  return (
                    <Link key={item.label} href={item.href} className={mobClass} onClick={() => setIsMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <div key={item.label}>
                    <div className={`px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide ${isScrolled ? "text-muted-foreground" : "text-white/60"}`}>
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className={`${mobClass} pl-8`} onClick={() => setIsMobileMenuOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              })}
              <Link
                href="/#aplikacia"
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  isScrolled
                    ? "text-[#282462] hover:bg-muted"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Smartphone className="h-4 w-4" />
                {t.header.downloadApp}
              </Link>

              <div className={`border-t pt-4 mt-4 px-4 ${
                isScrolled ? "border-border" : "border-white/20"
              }`}>
                <Link href={t.common.phoneHref} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="bg-accent rounded-full p-3">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-medium ${
                      isScrolled ? "text-muted-foreground" : "text-white/80"
                    }`}>
                      {t.common.dispatch}
                    </span>
                    <span className={`font-bold tabular-nums ${
                      isScrolled ? "text-[#282462]" : "text-white"
                    }`}>
                      {t.common.phone}
                    </span>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
