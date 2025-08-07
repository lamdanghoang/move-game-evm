"use client";

import Header from "./Header";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    createNetworkConfig,
    SuiClientProvider,
    WalletProvider,
} from "@mysten/dapp-kit";
import { Toaster } from "sonner";

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
    devnet: { url: getFullnodeUrl("devnet") },
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
                <WalletProvider autoConnect>
                    <div className="min-h-screen w-full">
                        <Header />
                        <main className="pt-16">{children}</main>
                    </div>
                    <Toaster />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}
