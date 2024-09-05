'use client';
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <div className="h-[64px] w-screen flex justify-between items-center px-8 border-t">
            <div className="font-bold">Coded by <Link href="https://shobhit2205.github.io/Portfolio/" className="font-">Shobhit Pandey</Link></div>
            <div className="flex items-center gap-2">
                <Link href="https://github.com/Shobhit2205" target="_blank"><GitHubLogoIcon className="w-6 h-6"/></Link>
                <Link href="https://x.com/Shobhit_2205" target="_blank"><FaXTwitter size={24} /></Link>
            </div>
        </div>
    )
}