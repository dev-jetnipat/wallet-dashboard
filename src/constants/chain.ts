import { Chain } from "@/interfaces/chain.interface";
import { bscTestnetToken, sepoliaToken } from "./token";

export const bnbTestnet: Chain = {
  name: "Binance Smart Chain Testnet",
  chainId: 97,
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  blockExplorer: "https://testnet.bscscan.com/",
  symbol: "BNB",
  logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
  tokens: bscTestnetToken,
};

export const sepolia: Chain = {
  name: "Sepolia",
  chainId: 11155111,
  rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com/",
  blockExplorer: "https://sepolia.etherscan.io",
  symbol: "ETH",
  logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  tokens: sepoliaToken,
};

export const chainList = {
  BNBTestnet: bnbTestnet,
  Sepolia: sepolia,
} as const;

// constant key of chainList
export type ChainKey = keyof typeof chainList;

export const getChainByRpcUrl = (rpcUrl: string): Chain | undefined => {
  return Object.values(chainList).find((chain) => chain.rpcUrl === rpcUrl);
};
