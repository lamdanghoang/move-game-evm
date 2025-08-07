"use client";

import {
    ConnectModal,
    useCurrentAccount,
    useDisconnectWallet,
} from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Copy, LogOut, User, Wallet } from "lucide-react";
import "@mysten/dapp-kit/dist/index.css";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";

interface WalletSelectorProps {
    className?: string;
}

export function WalletSelector({ className }: WalletSelectorProps) {
    const [open, setOpen] = useState(false);
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();

    const copyAddress = useCallback(async () => {
        if (!currentAccount) return;
        try {
            await navigator.clipboard.writeText(currentAccount.address);
            toast.success("Copied wallet address to clipboard.");
        } catch {
            toast.error("Failed to copy wallet address.");
        }
    }, [currentAccount]);

    if (currentAccount)
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full mt-2 md:mt-0 md:w-40 md:inline-flex bg-gradient-primary hover:opacity-90 text-white hover:text-white",
                            className
                        )}
                    >
                        <Wallet className="h-4 w-4" />
                        {formatAddress(currentAccount.address)}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onSelect={copyAddress}
                        className="w-full md:w-35 gap-2 focus:text-gray-50 cursor-pointer"
                    >
                        <Copy className="h-4 w-4" /> Copy address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        asChild
                        className="focus:text-gray-50 cursor-pointer"
                    >
                        <Link
                            href="/properties"
                            rel="noopener noreferrer"
                            className="flex gap-2"
                        >
                            <User className="h-4 w-4" /> Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            disconnect();
                            setOpen(false);
                        }}
                        className="gap-2 focus:text-gray-50 cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" /> Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

    return (
        <ConnectModal
            trigger={
                <Button className="btn-primary">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                </Button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
        />
    );
}

export function WalletSelectorMobile({ className }: WalletSelectorProps) {
    const [open, setOpen] = useState(false);
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();

    if (currentAccount)
        return (
            <Button
                variant="outline"
                className={cn(
                    "w-full mt-2 md:mt-0 md:w-40 md:inline-flex bg-gradient-primary hover:opacity-90 text-white hover:text-white",
                    className
                )}
                onClick={() => {
                    disconnect();
                    setOpen(false);
                }}
            >
                <Wallet className="h-4 w-4" />
                {formatAddress(currentAccount.address)}
            </Button>
        );

    return (
        <ConnectModal
            trigger={
                <Button className="btn-primary">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                </Button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
        />
    );
}
