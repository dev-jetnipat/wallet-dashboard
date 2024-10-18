import { getChainByRpcUrl } from "@/constants/chain";
import { ERC20_ABI } from "@/constants/erc20.abi";
import { Chain } from "@/interfaces/chain.interface";
import { Token } from "@/interfaces/token.interface";
import { Wallet, WalletDetails } from "@/interfaces/wallet.interface";
import { ethers } from "ethers";

const useEther = () => {
  const getBalances = async (
    chain: Chain,
    wallets: Wallet[]
  ): Promise<WalletDetails[]> => {
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);

    const balancePromises = wallets.map(async (wallet) => {
      try {
        const balanceWei = await provider.getBalance(wallet.address);
        const balanceInEth = ethers.formatEther(balanceWei);
        const chainData = getChainByRpcUrl(chain.rpcUrl);

        let tokenBalances: Token[] = [];
        if (chain.tokens) {
          // Map get balance of chain.tokens
          tokenBalances = await Promise.all(
            chain.tokens?.map(async (token) => {
              const contract = new ethers.Contract(
                token.address,
                ERC20_ABI,
                provider
              );
              const balance = await contract.balanceOf(wallet.address);
              return {
                ...token,
                balance: ethers.formatUnits(balance, token.decimals),
              };
            })
          );
        }

        const data = {
          ...wallet,
          balance: balanceInEth,
          chain: chainData,
          tokens: tokenBalances,
        };
        return data;
      } catch (err) {
        console.error(`Error fetching balance for ${wallet.address}:`, err);
        return { ...wallet, balance: "0" };
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(balancePromises);

    return results;
  };

  return { getBalances };
};

export default useEther;
