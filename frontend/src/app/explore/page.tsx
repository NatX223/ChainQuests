"use client";

import { ReactNode } from "react";
import { useBodyOverflow, useScrollReset, useTabSwitcher } from "@/hooks";
import {
	ExploreTabs,
	Giveaways,
	Airdrops
} from "@/components";
import "./page.scss";

import { useWeb3ModalAccount } from "@web3modal/ethers/react";

interface TabComponents {
	[key: string]: ReactNode;
}

/**
 * Functional component representing the Explore page.
 *
 * @component
 * @returns {JSX.Element} Explore component JSX
 */
const Explore = () => {
	// Reset body overflow and scroll position when the component mounts.
	useScrollReset();
	useBodyOverflow();

	// Get active tab, handleTabClick function, and tabIsActive function from custom hook
	const { activeTab, handleTabClick, tabIsActive } = useTabSwitcher("board");

	// Object mapping tab names to corresponding components
	const tabComponents: TabComponents = {
		board: <Giveaways group="onchain" />,
		medals: <Airdrops group="onchain" />,
	};

	/**
	 * Renders the active tab component.
	 *
	 * @returns {JSX.Element} Active tab component JSX
	 */
	function renderTab() {
		return tabComponents[activeTab] || null;
	}

	const { address } = useWeb3ModalAccount();

	console.log({ address });

	return (
		<section className="explore">
			{/* Render the secondary navigation bar */}
			<div className="explore__wrapper">
				{/* Render the ExploreTabs component for tab navigation */}
				<ExploreTabs
					onTabChange={handleTabClick}
					tabIsActive={tabIsActive}
					group={"explore"}
				/>

				<section className="explore__tabs-display">
					{/* Render the active tab content */}
					{renderTab()}
				</section>
			</div>
		</section>
	);
};

export default Explore;
