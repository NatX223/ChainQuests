"use client";

import { Hamburger } from "@/assets/icons";
import { useToggle } from "@/hooks";
import { Modal } from "@/views";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MenuModal } from "..";
import "./index.scss";

export const Menu = () => {
	const router = useRouter();
	const { address, isConnected } = useWeb3ModalAccount();
	const { status: isMenuActive, toggleStatus: setIsMenuActive } = useToggle();

	useEffect(() => {
		// Toggle background vertical scroll when menu is active
		const scroll = isMenuActive ? "hidden" : "visible";
		document.body.style.overflowY = scroll;
	}, [isMenuActive]);

	return (
		<section className="menu">
			<div className="menu-wrapper">
				<button onClick={setIsMenuActive}>
					<Hamburger />
				</button>

				<Modal
					isOpen={isMenuActive}
					onClose={setIsMenuActive}
				>
					<MenuModal
						onClose={() => {
							setIsMenuActive();
						}}
					/>
				</Modal>
			</div>
		</section>
	);
};
