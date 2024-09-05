'use client';
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@solana/wallet-adapter-react"
import { HandCoins, Info } from "lucide-react"
import { TokenListProvider } from '@solana/spl-token-registry'
import Image from "next/image";

interface TokenMetadata {
    symbol: string;
    logoURI: string;
}

// So11111111111111111111111111111111111111112

async function getTokenMetadata(mintAddress: string) : Promise<TokenMetadata> {
    const tokens = await new TokenListProvider().resolve();
    const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();

    const token = tokenList.find(t => t.address === mintAddress);
    if(token){
        return {
            symbol: token.symbol,
            logoURI: token.logoURI || "",
        }
    }
    else{
        throw new Error('Token not found in registry!');
    }
}

export default function SolanaTokenInfo(){
    const [tokenMint, setTokenMint] = useState<string>("");
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [tokenLogo, setTokenLogo] = useState('');
    const {toast} = useToast();
    const wallet = useWallet();

    async function hendleFetchTokenInfo() {
        if(!wallet?.publicKey){
            toast({
                title: "Please connect your wallet"
            });
        }
        else{
            try {
                const TokenMetadata = await getTokenMetadata(tokenMint);
                setTokenSymbol(TokenMetadata.symbol);
                setTokenLogo(TokenMetadata.logoURI);
            } catch (error : any) {
                if (error instanceof TypeError || error.message.includes('Token not found in registry')) {
                    toast({
                        title: "Token not found",
                        description: "Token not found in registry, try different token"
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Something went wrong, please try again later!"
                    });
                }
            }
        }
    }
    return(
        <Dialog>
            <DialogTrigger>
                <Button className="w-full gap-2"><Info size={18} />SOL Token Info</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Solana Token Info</DialogTitle>
                <DialogDescription>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="amount">Token Mint</Label>
                            <Input onChange={(e) => setTokenMint(e.target.value)} placeholder="Enter token mint address" type="text" />
                        </div>
                        {tokenSymbol && tokenLogo &&
                            <div>
                                <div className="font-bold">Token symbol: <span className="">{tokenSymbol}</span></div>
                                <div className="flex items-center font-bold">Token logo: <Image src={tokenLogo} alt="tokenlogo" width={40} height={40} className="rounded-full"/></div>
                            </div>
                        }
                        
                        <Button onClick={hendleFetchTokenInfo}>Fetch Info</Button>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}