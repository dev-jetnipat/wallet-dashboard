import { Token } from "./token.interface";

export interface Chain {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  symbol: string;
  logo: string;
  tokens?: Token[];
}
