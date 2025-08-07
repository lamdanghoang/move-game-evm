"use client";

import "@rainbow-me/rainbowkit/styles.css";
import Header from "./Header";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    createNetworkConfig,
    SuiClientProvider,
    WalletProvider,
} from "@mysten/dapp-kit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { somniaTestnet, coreTestnet2 } from "wagmi/chains";
import {
    getDefaultConfig,
    lightTheme,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { Toaster } from "sonner";

// Config options for the networks you want to connect to
const config = getDefaultConfig({
    appName: "MoveGaming",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [somniaTestnet, coreTestnet2],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

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
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    modalSize="compact"
                    locale="en"
                    theme={lightTheme({
                        accentColor:
                            "linear-gradient(135deg, hsl(195 100% 50%) 0%, hsl(275 100% 65%) 100%)",
                        accentColorForeground: "white",
                        borderRadius: "large",
                        fontStack: "system",
                        overlayBlur: "small",
                    })}
                >
                    <SuiClientProvider
                        networks={networkConfig}
                        defaultNetwork="devnet"
                    >
                        <WalletProvider autoConnect>
                            <div className="min-h-screen w-full">
                                <Header />
                                <main className="pt-16">{children}</main>
                            </div>
                            <Toaster />
                        </WalletProvider>
                    </SuiClientProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
