"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { name: "Domains", href: "/domains" },
  { name: "Monitor", href: "/monitor" },
  { name: "SSL", href: "/ssl" },
];

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="shadow">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
            </Link>
          </div>
          <div className="hidden md:flex md:gap-x-2">
            {NAV_LINKS.map((link) => (
              <Button variant="ghost" className="group w-fit">
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-text group-hover:text-primary"
                >
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="group">
              <Link
                to="/auth?mode=login"
                className="hidden text-sm text-text group-hover:text-primary md:block"
              >
                Log in
              </Link>{" "}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-text hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/auth?mode=login"
                className="block rounded-md px-3 py-2 text-base font-medium text-text hover:text-primary"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
