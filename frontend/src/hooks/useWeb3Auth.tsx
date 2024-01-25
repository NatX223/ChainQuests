"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { FC, ReactNode } from "react";

import { arbitrum_sepolia } from "@/assets/data/chains";

interface Props {
	children: ReactNode;
}

const chains = [arbitrum_sepolia];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const metadata = {
	name: "WAGMI Club",
	description: "Club with the Magic Badge",
	url: "https://mywebsite.com",
	icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
	metadata,
	enableEmail: true,
	defaultChainId: chains[0].chainId,
	rpcUrl: `https://sepolia-rollup.arbitrum.io/rpc`,
});

createWeb3Modal({
	chains,
	projectId,
	ethersConfig,
	enableAnalytics: true,
});

export const Web3Modal: FC<Props> = ({ children }) => {
	return children;
};
