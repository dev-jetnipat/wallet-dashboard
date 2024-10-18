import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletDetails, WalletType } from "@/interfaces/wallet.interface";

import Image from "next/image";
import { Button } from "./ui/button";
import { Copy, Pin, Trash } from "lucide-react";
import { truncateWalletAddress } from "@/utils/truncate";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { bnbTestnet, sepolia } from "@/constants/chain";
import { Badge } from "./ui/badge";
import { formattedNumber } from "@/utils/format";

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

  const cardBgColor = () => {
    // switch (wallet.chain?.chainId) {
    //   case bnbTestnet.chainId:
    //     return "bg-eth bg-cover";
    //   case sepolia.chainId:
    //     return "bg-bnb bg-cover";
    // }
    switch (wallet.type) {
      case WalletType.GAS_WALLET:
        return "bg-gradient-to-br from-gray-100 to-gray-500";
      case WalletType.HOT_WALLET:
        return "bg-gradient-to-br from-[#f5f5f5] to-[#f5f5f5]";
    }
  };

  const badgeColor = () => {
    switch (wallet.type) {
      case WalletType.GAS_WALLET:
        return "bg-primary";
      case WalletType.HOT_WALLET:
        return "bg-secondary";
      case WalletType.OWNER_WALLET:
        return "bg-accent";
      case WalletType.MAIN_WALLET:
        return "bg-destructive";
      case WalletType.WITHDRAW_WALLET:
        return "bg-muted";
    }
  };

  return (
    <Card className={cn("w-[420px]", cardBgColor())}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-lg">{wallet.name}</div>
          <Badge className={cn(badgeColor())}>{wallet.type}</Badge>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <CardDescription className="text-white text-lg line-clamp-1">
              {truncateWalletAddress(wallet.address)}
            </CardDescription>
            <div>
              <Button
                variant="secondary"
                onClick={handleCopy}
                size="sm"
                className="px-3"
              >
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Image
                src={wallet.chain?.logo || "https://placehold.co/400x400/png"}
                width={24}
                height={24}
                alt={`${wallet.name + wallet.chain?.symbol}`}
              />
            </div>
            <div className="text-white">{formattedNumber(wallet.balance)}</div>
            <div className="text-white">{wallet.chain?.symbol}</div>
          </div>
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
              <div className="text-white">{formattedNumber(token.balance)}</div>
              <div className="text-white">{token.symbol}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-end w-full space-x-2">
          <Button variant="outline">
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleRemoveWallet(wallet.address)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
      {/* <CardHeader>
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
      </CardFooter> */}
    </Card>
  );
};

export default WalletCard;
