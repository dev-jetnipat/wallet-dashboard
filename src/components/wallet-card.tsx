import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletDetails } from "@/interfaces/wallet.interface";

import Image from "next/image";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { truncateWalletAddress } from "@/utils/truncate";
import { useToast } from "@/hooks/use-toast";

interface WalletCardProps {
  wallet: WalletDetails;
  handleRemoveWallet: (address: string) => void;
}

const WalletCard = ({ wallet, handleRemoveWallet }: WalletCardProps) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    toast({
      title: "Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <Card className="max-w-[420px] w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{wallet.name}</CardTitle>
          <div className="flex items-center space-x-1">
            <div className="font-semibold">
              {parseFloat(wallet.balance).toFixed(4)} {wallet.chain?.symbol}
            </div>
            <div className="flex">
              <Image
                src={wallet.chain?.logo || "https://placehold.co/400x400/png"}
                width={24}
                height={24}
                alt={`${wallet.name + wallet.chain?.symbol}`}
              />
            </div>
          </div>
        </div>
        <div>{wallet.type}</div>
        <div className="flex items-center justify-between">
          <CardDescription className=" line-clamp-1">
            {truncateWalletAddress(wallet.address)}
          </CardDescription>
          <div>
            <Button onClick={handleCopy} size="sm" className="px-3">
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* <Separator className="my-4" /> */}
        <div className="grid gap-1">
          {wallet.tokens?.map((token, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center">
                <Image
                  src={token.logo || "https://placehold.co/400x400/png"}
                  width={24}
                  height={24}
                  alt={token.name}
                />
              </div>
              <div>{parseFloat(token.balance || "0").toFixed(4)}</div>
              <div>{token.symbol}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => handleRemoveWallet(wallet.address)}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletCard;
