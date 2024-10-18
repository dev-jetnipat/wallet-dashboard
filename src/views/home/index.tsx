"use client";

import WalletCard from "@/components/wallet-card";
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key";
import {
  Wallet,
  WalletDetails,
  WalletType,
} from "@/interfaces/wallet.interface";
import { useEffect, useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { chainList } from "@/constants/chain";
import useEther from "@/hooks/use-ethers";
import SubscribeWalletDialog from "./components/subscribe-wallet.dialog";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const HomeView = () => {
  const { getBalances } = useEther();

  const [bnbWallets, setBnbWallets] = useState<WalletDetails[]>([]);
  const [sepoliaWallets, setSepoliaWallets] = useState<WalletDetails[]>([]);

  const [chainFilter, setChainFilter] = useState<string[]>([
    chainList.BNBTestnet.chainId.toString(),
  ]);

  const [walletTypeFilter, setWalletTypeFilter] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    setLoading(true);
    const wallet = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET);
    if (wallet) {
      const wallets = JSON.parse(wallet) as Wallet[];

      const sepoliaChainWallets = await getBalances(chainList.Sepolia, wallets);

      setSepoliaWallets(sepoliaChainWallets);

      const bnbChainWallets = await getBalances(chainList.BNBTestnet, wallets);

      setBnbWallets(bnbChainWallets);
    }
    setLoading(false);
  };

  const handleRemoveWallet = (address: string) => {
    const wallets = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET);

    const wallet = JSON.parse(wallets || "[]");

    const updatedWallet = wallet.filter((w: Wallet) => w.address !== address);

    localStorage.setItem(
      LOCAL_STORAGE_KEY.WALLET,
      JSON.stringify(updatedWallet)
    );

    fetchBalance();
  };

  const bnbWalletFilter = useMemo(() => {
    const result = bnbWallets.filter((wallet) =>
      walletTypeFilter.includes(wallet.type)
    );

    if (!result.length) {
      return bnbWallets;
    }

    return result;
  }, [bnbWallets, walletTypeFilter]);

  const sepoliaWalletFilter = useMemo(() => {
    const result = sepoliaWallets.filter((wallet) =>
      walletTypeFilter.includes(wallet.type)
    );

    if (!result.length) {
      return sepoliaWallets;
    }

    return result;
  }, [sepoliaWallets, walletTypeFilter]);

  useEffect(() => {
    fetchBalance();
  }, []);

  const walletTypeStyle = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.MAIN_WALLET:
        return "data-[state=on]:bg-green-500 data-[state=on]:text-black data-[state=on]:font-semibold";
      case WalletType.HOT_WALLET:
        return "data-[state=on]:bg-red-500 data-[state=on]:text-white data-[state=on]:font-semibold";
      case WalletType.OWNER_WALLET:
        return "data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:font-semibold";
      case WalletType.GAS_WALLET:
        return "data-[state=on]:bg-gray-600 data-[state=on]:text-white data-[state=on]:font-semibold";
      case WalletType.WITHDRAW_WALLET:
        return "data-[state=on]:bg-orange-600 data-[state=on]:text-white data-[state=on]:font-semibold";
      default:
        return "";
    }
  };

  return (
    <div className="p-10 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button onClick={() => fetchBalance()}>
            <RefreshCw className={cn(loading ? "animate-spin" : "")} />
          </Button>
          <SubscribeWalletDialog fetchBalance={fetchBalance} />
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col bg-white p-3 rounded-lg">
          <div className="font-bold mb-2">⚙️ Chain</div>
          <div className="flex flex-col items-center space-x-1">
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={chainFilter}
              onValueChange={(value) => {
                setChainFilter(value);
              }}
            >
              <ToggleGroupItem
                value={chainList.BNBTestnet.chainId.toString()}
                className="bg-white min-w-24 data-[state=on]:bg-yellow-400 data-[state=on]:text-black data-[state=on]:font-semibold"
              >
                {chainList.BNBTestnet.symbol}
              </ToggleGroupItem>
              <ToggleGroupItem
                value={chainList.Sepolia.chainId.toString()}
                className="bg-white min-w-24 data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:font-semibold"
              >
                {chainList.Sepolia.symbol}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col bg-white p-3 rounded-lg">
          <div className="font-bold mb-2">💰 Wallet type</div>
          <div className="flex flex-col items-center space-x-1 ">
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={walletTypeFilter}
              onValueChange={(value) => {
                setWalletTypeFilter(value);
              }}
              className="grid grid-cols-2 md:grid-cols-5 gap-2"
            >
              {Object.entries(WalletType).map(([key, value]) => (
                <ToggleGroupItem
                  key={key}
                  value={value}
                  className={cn(
                    "bg-white min-w-40 ",
                    walletTypeStyle(value as WalletType)
                  )}
                >
                  {value}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-bounce font-bold text-3xl">Loading . . .</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {chainFilter.includes(chainList.BNBTestnet.chainId.toString()) && (
            <div>
              <h1 className="text-2xl font-bold">Binance Wallet</h1>
              <Separator className="mt-4 mb-6 bg-gray-400" />
              <div className="flex justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7">
                  {bnbWalletFilter.map((wallet, index) => (
                    <WalletCard
                      key={index}
                      wallet={wallet}
                      handleRemoveWallet={handleRemoveWallet}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {chainFilter.includes(chainList.Sepolia.chainId.toString()) && (
            <div>
              <h1 className="text-2xl font-bold">Sepolia Wallet</h1>
              <Separator className="mt-4 mb-6 bg-gray-400" />
              <div className="flex justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7">
                  {sepoliaWalletFilter.map((wallet, index) => (
                    <WalletCard
                      key={index}
                      wallet={wallet}
                      handleRemoveWallet={handleRemoveWallet}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeView;
