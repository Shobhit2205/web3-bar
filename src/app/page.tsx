'use client';
import Airdrop from "@/components/Airdrop";
import { Navbar } from "@/components/Navbar";
import SendTokens from "@/components/SendTokens";
import SignMessage from "@/components/SignMessage";
import SolanaTokenInfo from "@/components/SolanaTokenInfo";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>();
  const { toast } = useToast();

  const getSolBalance = useCallback(async () => {
    if (wallet?.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
  }, [connection, wallet]);

  useEffect(() => {
    getSolBalance();
  }, [getSolBalance]);

  const handleCopyToClipboard = () => {
    if (wallet?.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey.toString())
        .then(() => {
          toast({
            title: 'Copied to Clipboard'
          })
        })
        .catch((err) => {
          toast({
            title: 'Failed to copy',
            action: <ToastAction altText="Try Again">Try Again</ToastAction>
          })
        });
    }
  };

  return (
    <main>
      <div className="h-[calc(100vh-128px)] flex items-center justify-center">
        {wallet?.publicKey ? (
          <div>
            <div className="flex flex-col border border-gray-300 p-8 rounded-xl mb-4">
              <div className="table w-full">
                <div className="table-row">
                  <div className="table-cell font-extrabold text-xl pr-4">Wallet Address:</div>
                  <div
                    onClick={handleCopyToClipboard}
                    className="table-cell font-bold cursor-pointer break-all"
                  >
                    {wallet.publicKey.toString()}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell font-extrabold text-xl pr-4">SOL Balance:</div>
                  <div className="table-cell font-bold">{balance} SOL</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Airdrop getSolBalance={getSolBalance} />
              <SignMessage />
              <SendTokens getSolBalance={getSolBalance} />
              <SolanaTokenInfo />
            </div>
          </div>
        ) : (
          <div>Please connect the wallet</div>
        )}
      </div>
    </main>
  );
}
