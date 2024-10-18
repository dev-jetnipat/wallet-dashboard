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

const HomeView = () => {
  const { getBalances } = useEther();

  const [bnbWallets, setBnbWallets] = useState<WalletDetails[]>([]);
  const [sepoliaWallets, setSepoliaWallets] = useState<WalletDetails[]>([]);

  const [chainFilter, setChainFilter] = useState<string[]>([
    chainList.BNBTestnet.chainId.toString(),
  ]);

  const [walletTypeFilter, setWalletTypeFilter] = useState<string[]>([]);

  const fetchBalance = async () => {
    const wallet = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET);
    if (wallet) {
      const wallets = JSON.parse(wallet) as Wallet[];

      const sepoliaChainWallets = await getBalances(chainList.Sepolia, wallets);

      setSepoliaWallets(sepoliaChainWallets);

      const bnbChainWallets = await getBalances(chainList.BNBTestnet, wallets);

      setBnbWallets(bnbChainWallets);
    }
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

  return (
    <div className="p-10 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <SubscribeWalletDialog fetchBalance={fetchBalance} />
      </div>

      <div className="flex items-center space-x-1">
        <div>Chain :</div>
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={chainFilter}
          onValueChange={(value) => {
            setChainFilter(value);
          }}
        >
          <ToggleGroupItem value={chainList.BNBTestnet.chainId.toString()}>
            {chainList.BNBTestnet.symbol}
          </ToggleGroupItem>
          <ToggleGroupItem value={chainList.Sepolia.chainId.toString()}>
            {chainList.Sepolia.symbol}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center space-x-1">
        <div>Wallet type :</div>
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={walletTypeFilter}
          onValueChange={(value) => {
            setWalletTypeFilter(value);
          }}
        >
          {Object.entries(WalletType).map(([key, value]) => (
            <ToggleGroupItem key={key} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {chainFilter.includes(chainList.BNBTestnet.chainId.toString()) && (
        <div className="flex gap-3 justify-items-center">
          {bnbWalletFilter.map((wallet, index) => (
            <WalletCard
              key={index}
              wallet={wallet}
              handleRemoveWallet={handleRemoveWallet}
            />
          ))}
        </div>
      )}

      {chainFilter.includes(chainList.Sepolia.chainId.toString()) && (
        <div className="flex gap-3 justify-items-center">
          {sepoliaWalletFilter.map((wallet, index) => (
            <WalletCard
              key={index}
              wallet={wallet}
              handleRemoveWallet={handleRemoveWallet}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeView;
