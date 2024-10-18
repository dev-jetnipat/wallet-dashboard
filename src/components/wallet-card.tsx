import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { WalletDetails, WalletType } from "@/interfaces/wallet.interface";

import Image from "next/image";
import { Button } from "./ui/button";
import { Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { formattedNumber } from "@/utils/format";
import { truncateWalletAddress } from "@/utils/truncate";

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
    switch (wallet.type) {
      case WalletType.WITHDRAW_WALLET:
        return "bg-gradient-to-br from-orange-400 to-orange-700";
      case WalletType.GAS_WALLET:
        return "bg-gradient-to-br from-gray-400 to-gray-700";
      case WalletType.OWNER_WALLET:
        return "bg-gradient-to-br from-blue-400 to-blue-700";
      case WalletType.HOT_WALLET:
        return "bg-gradient-to-br from-red-400 to-red-700";
      case WalletType.MAIN_WALLET:
        return "bg-gradient-to-br from-green-400 to-green-700";
    }
  };

  const badgeColor = () => {
    switch (wallet.type) {
      case WalletType.GAS_WALLET:
        return "bg-primary";
      case WalletType.HOT_WALLET:
        return "bg-red-900";
      case WalletType.OWNER_WALLET:
        return "bg-blue-800";
      case WalletType.MAIN_WALLET:
        return "bg-green-900";
      case WalletType.WITHDRAW_WALLET:
        return "bg-orange-800";
    }
  };

  return (
    <Card className={cn("w-[420px] shadow-xl relative", cardBgColor())}>
      <div>
        <div
          onClick={() => handleRemoveWallet(wallet.address)}
          className="absolute -top-3 -right-3 rounded-full h-8 w-8 flex items-center justify-center bg-red-500"
        >
          <X className="h-5 w-5 text-white" />
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-black font-bold text-xl">{wallet.name}</div>
          <Badge className={cn(badgeColor())}>{wallet.type}</Badge>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <CardDescription className="text-white text-base line-clamp-1 font-medium">
              {truncateWalletAddress(wallet.address, 10, 10)}
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
        <div className="grid gap-3">
          <div className="flex justify-between items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Image
                  src={wallet.chain?.logo || "https://placehold.co/400x400/png"}
                  width={32}
                  height={32}
                  alt={`${wallet.name + wallet.chain?.symbol}`}
                />
              </div>
              <div className="text-white text-sm font-semibold">
                {wallet.chain?.symbol}
              </div>
            </div>

            <div className="flex space-x-3 items-center font-bold">
              <div className="text-white">
                {formattedNumber(wallet.balance)}
              </div>
              <div className="text-white text-xs min-w-11 text-right">
                {wallet.chain?.symbol}
              </div>
            </div>
          </div>
          {wallet.tokens?.map((token, index) => (
            <div
              key={index}
              className="flex justify-between items-center space-x-3"
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center w-8 h-8">
                  <Image
                    src={token.logo || "https://placehold.co/400x400/png"}
                    width={32}
                    height={32}
                    alt={token.name}
                    className="fit"
                  />
                </div>
                <div className="text-white text-sm font-semibold">
                  {token.symbol}
                </div>
              </div>

              <div className="flex items-center space-x-3 font-bold">
                <div className="text-white">
                  {formattedNumber(token.balance)}
                </div>
                <div className="text-white text-xs min-w-11 text-right">
                  {token.symbol}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center w-full">
          <p className="text-sm font-light text-gray-200">
            {wallet.chain?.name}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WalletCard;
