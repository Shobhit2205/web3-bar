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
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { Send } from "lucide-react"

interface AirdropProps{
    getSolBalance: () => void
}
  
export default function SendTokens({ getSolBalance }: AirdropProps){
    const [amount, setAmount] = useState<number>(0);
    const [recieverPublicKey, setRecieverPublicKey] = useState<string>("");
    const {toast} = useToast();
    const {connection} = useConnection();
    const wallet = useWallet();

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    async function handleSendToken() {
        if(amount <= 0){
            toast({
                title: "Please enter a valid amount greater than 0"
            });
        }
        else if (recieverPublicKey === ""){
            toast({
                title: "Enter the correct reciever public key"
            });
        }
        else if(!wallet?.publicKey){
            toast({
                title: "Please connect your wallet"
            });
        }
        else{
            try {
                const transaction = new Transaction();
                const publicKey = new PublicKey(recieverPublicKey);
                transaction.add(SystemProgram.transfer({
                    toPubkey: publicKey,
                    fromPubkey: wallet.publicKey,
                    lamports: amount*LAMPORTS_PER_SOL
                }));

                await wallet.sendTransaction(transaction, connection);
                toast({
                    title: "Transaction Successful",
                    description: `Transferred ${amount} SOL`
                });
                setAmount(0);
                setRecieverPublicKey("");
                getSolBalance();
                if (closeButtonRef.current) {
                    closeButtonRef.current.click();
                }             
            } catch (error: any) {
                if (error instanceof TypeError || error.message.includes('Invalid public key')) {
                    toast({
                        title: "Invalid Public Key",
                        description: "The provided public key is not valid."
                    });
                } else {
                    toast({
                        title: "Transaction Failed",
                        description: "There was an error while sending the transaction."
                    });
                }
            }
        }
    }
    return(
        <Dialog>
            <DialogTrigger>
                <Button className="w-full gap-2"><Send size={18} /> Send SOL</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Send SOL</DialogTitle>
                <DialogDescription>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="amount">Address</Label>
                            <Input onChange={(e) => setRecieverPublicKey(e.target.value)} placeholder="Enter Reciever public key" type="text" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input onChange={(e) => setAmount(parseInt(e.target.value))} placeholder="Enter SOL amount" type="number" />
                        </div>
                        <Button onClick={handleSendToken}>Send SOL Token</Button>
                    </div>
                </DialogDescription>
                <DialogClose asChild>
                    <Button ref={closeButtonRef} style={{ display: 'none' }}>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}