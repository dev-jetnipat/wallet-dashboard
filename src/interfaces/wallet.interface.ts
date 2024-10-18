import { Chain } from "./chain.interface";
import { Token } from "./token.interface";

export enum WalletType {
  WITHDRAW_WALLET = "Withdraw wallet",
  GAS_WALLET = "Gas wallet",
  OWNER_WALLET = "Owner wallet",
  HOT_WALLET = "Hot wallet",
  MAIN_WALLET = "Main wallet",
}

export interface Wallet {
  name: string;
  address: string;
  type: WalletType;
}

export interface WalletDetails {
  name: string;
  address: string;
  balance: string;
  chain?: Chain;
  tokens?: Token[];
  type: WalletType;
}
