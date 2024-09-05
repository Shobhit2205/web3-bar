'use client';
import { useRef, useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import { useToast } from "@/hooks/use-toast"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { HandCoins } from "lucide-react"

interface AirdropProps{
    getSolBalance: () => void
}
  
export default function Airdrop({ getSolBalance }: AirdropProps){
    const [amount, setAmount] = useState<number>(0);
    const {toast} = useToast();
    const {connection} = useConnection();
    const wallet = useWallet();

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    async function handleAirdrop() {
        if(amount <= 0){
            toast({
                title: "Please enter a valid amount greater than 0"
            });
        }
        else if(!wallet?.publicKey){
            toast({
                title: "Please connect your wallet"
            });
        }
        else{
            await connection.requestAirdrop(wallet?.publicKey, amount*LAMPORTS_PER_SOL);
            toast({
                title: `Airdrop ${amount} SOL`
            });

            setAmount(0);
            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }
            getSolBalance();
        }
    }
    return(
        <Dialog>
            <DialogTrigger>
                <Button className="w-full gap-2"><HandCoins size={18} />Airdrop SOL</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Airdrop SOL</DialogTitle>
                <DialogDescription>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input onChange={(e) => setAmount(parseInt(e.target.value))} placeholder="Enter SOL amount" type="number" />
                        </div>
                        <Button onClick={handleAirdrop}>Airdrop</Button>
                    </div>
                </DialogDescription>
                <DialogClose asChild>
                    <Button ref={closeButtonRef} style={{ display: 'none' }}>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}