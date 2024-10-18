export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logo: string;
  chainId: number;
  balance?: string;
}
