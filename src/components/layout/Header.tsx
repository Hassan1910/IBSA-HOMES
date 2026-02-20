"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

export function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        handleScroll(); // initialize on mount
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // TODO: Add Auth check later to show/hide links or profile menu
    const isAuthenticated = false;

    const navLinks = [
        { name: "Properties", href: "/properties" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"
                    } after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${isActive ? "after:origin-bottom-left after:scale-x-100" : ""
                    }`}
            >
                {children}
            </Link>
        );
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
                    : "bg-background border-b border-transparent"
                }`}
        >
            <div className="container h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-1 transition-transform hover:scale-105">
                        IBSA<span className="text-muted-foreground font-light">HOMES</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink key={link.href} href={link.href}>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <ModeToggle />
                        <Button asChild variant="default" className="text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-md">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex md:hidden items-center gap-2">
                        <ModeToggle />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetTitle className="text-left text-xl font-bold tracking-tight text-primary mb-6">
                                    IBSA<span className="text-muted-foreground font-light">HOMES</span>
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Navigation menu
                                </SheetDescription>
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`text-lg font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
                                        <Button asChild variant="default" className="w-full shadow-md">
                                            <Link href="/login">Sign In</Link>
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
