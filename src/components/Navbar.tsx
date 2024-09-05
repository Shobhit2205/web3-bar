
'use client';
import Link from "next/link";
import { ThemeButton } from "./ThemeButton";
import { ConnectWallet } from "./ConnectWallet";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Navbar() {
    return (
        <div className="w-screen h-[64px] flex justify-between items-center border-b px-4">
            <Link href={'/'} className="font-bold">Web3 Bar</Link>
            <div className="flex items-center gap-4">
                <ConnectWallet/>
                <ThemeButton/>
                
            </div>

        </div>
    )
}