'use client';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({children}: {children: React.ReactNode}){
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    console.log(process.env.NEXT_PUBLIC_CONNECTION_ENDPOINT);
    return(
       <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_CONNECTION_ENDPOINT || endpoint}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
       </ConnectionProvider>
    )
}