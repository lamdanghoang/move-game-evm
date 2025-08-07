"use client";

import { useState } from "react";
import {
    Menu,
    X,
    Gamepad2,
    Wallet,
    Trophy,
    Store,
    Users,
    Zap,
    User,
    House,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { WalletSelector, WalletSelectorMobile } from "../wallet/ConnectButton";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = usePathname();

    const navItems = [
        { path: "/", label: "Home", icon: House },
        { path: "/games", label: "Games", icon: Gamepad2 },
        { path: "/marketplace", label: "Marketplace", icon: Store },
        { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
        { path: "/dao", label: "DAO", icon: Users },
        { path: "/profile", label: "Profile", icon: User },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                    >
                        <div className="relative">
                            <Zap className="h-8 w-8 text-neon-blue animate-pulse-glow" />
                            <div className="absolute inset-0 bg-neon-blue opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <span className="text-2xl font-orbitron font-bold text-gradient">
                            MoveGaming
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = location === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                        isActive
                                            ? "bg-primary/20 text-primary border border-primary/30 glow-blue"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Connect Wallet Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        <WalletSelector />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden border-t border-border mt-2 pt-4 pb-4 animate-slide-in-up">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => {
                                const isActive = location === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                            isActive
                                                ? "bg-primary/20 text-primary border border-primary/30"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}

                            <WalletSelectorMobile />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
