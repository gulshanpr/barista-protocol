import { defineChain } from "viem";

export const espresso = defineChain({
  id: 345_678,
  name: "My Espresso Chain",
  network: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "Arbitrum Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://34.60.203.137:8547"],
    },
  },
  testnet: true,
});
