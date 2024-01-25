"use client";

import { DESKTOP_NAV_LINKS } from "@/assets/data";
import { Logo, Menu } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./index.scss";

function RenderNavLinks() {
	return (
		<>
			<ul className="primaryNav__desktop">
				{/* Mapping through desktop navigation links */}
				{DESKTOP_NAV_LINKS.map((item, index) => {
					const {
						id,
						value: { title, to },
					} = item;
					return (
						<ListItem
							key={id || index}
							title={title}
							to={to}
						/>
					);
				})}

				{/* Login Button */}
				<RenderLoginButton />
			</ul>
		</>
	);
}

function ListItem({ title, to }: { title: string; to: string }) {
	return (
		<>
			<li>
				{/* Link to specific route */}
				<Link href={to}>{title}</Link>
			</li>
		</>
	);
}

function RenderLoginButton() {
	return (
		<>
			{/* <ConnectKitButton.Custom>
				{({ isConnected, show, truncatedAddress }) => (
					<li
						onClick={() => {
							show!();
						}}
						id="login"
					>
						{isConnected ? (
							<span>
								<i>
									<Profile />
								</i>
								{truncatedAddress}
							</span>
						) : (
							"Login"
						)}
					</li>
				)}
			</ConnectKitButton.Custom> */}
		</>
	);
}

export const PrimaryNav = () => {
	const router = useRouter();
	// const { address, isConnected } = useAccount();

	// const baseAPIURL = process.env.NEXT_PUBLIC_API_URL;

	// useEffect(() => {
	// 	isConnected &&
	// 		(async () => {
	// 			const { exists } = (
	// 				await axios.get(`${baseAPIURL}checkUser/${address}`)
	// 			).data;

	// 			// !exists && router.replace("/profile/edit");
	// 		})();
	// }, [isConnected]);

	return (
		<nav className="primaryNav">
			{/* Wrapper for the logo, mobile menu, and desktop navigation */}
			<div className="primaryNav__wrapper">
				{/* Application Logo */}
				<Logo />

				{/* Navigation Menu (Mobile) */}
				<Menu />

				{/* Navigation Menu (Desktop) */}
				<RenderNavLinks />
			</div>
		</nav>
	);
};
