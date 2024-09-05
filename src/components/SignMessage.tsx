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
import { useWallet } from "@solana/wallet-adapter-react"
import { ed25519 } from "@noble/curves/ed25519";
import bs58 from 'bs58';
import { ToastAction } from "./ui/toast"
import { PenTool } from "lucide-react"

export default function SignMessage(){
    const [message, setMessage] = useState<string>("");
    const {toast} = useToast();
    const {publicKey, signMessage} = useWallet();

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    async function handleSignMessage() {
        if(message === ""){
            toast({
                title: "Please enter the message"
            });
        }
        else if(!publicKey || !signMessage){
            toast({
                title: "Please connect your wallet"
            });
        }
        else{
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            if(!ed25519.verify(signature, encodedMessage, publicKey.toBytes())){
                toast({
                    title: "Message signature Invalid",
                });
            }

            toast({
                title: "Message Signed",
                description: `${bs58.encode(signature)}`,
                action: <ToastAction onClick={() => navigator.clipboard.writeText(bs58.encode(signature))} altText="Copy signature">Copy</ToastAction>
            });

            setMessage("");

            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }
        }
    }
    return(
        <Dialog>
            <DialogTrigger>
                <Button className="w-full gap-2"><PenTool size={18} /> Sign Message</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Sign Message</DialogTitle>
                <DialogDescription>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="amount">Message</Label>
                            <Input onChange={(e) => setMessage(e.target.value)} placeholder="Enter Message..." type="text" />
                        </div>
                        <Button onClick={handleSignMessage}>Sign</Button>
                    </div>
                </DialogDescription>
                <DialogClose asChild>
                    <Button ref={closeButtonRef} style={{ display: 'none' }}>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}