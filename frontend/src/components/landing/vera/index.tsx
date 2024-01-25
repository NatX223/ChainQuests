import { Reputation } from "@/components";
import "./index.scss";

export const Vera = ({ group }: { group: string }) => {
	const clubs = {
		mobile: [
			{
				color: "#A1F294",
				title: "Giveaways",
			},
			{
				color: "#FFFFFF",
				title: "NFT Mints",
			},
			{
				color: "#FFFFFF",
				title: "Airdrops",
			},
		],
		desktop: [
			{
				color: "#FFFFFF",
				title: "Giveaways",
			},
			{
				color: "#9BF593",
				title: "NFT Mints",
			},
			{
				color: "#E5F67A",
				title: "Airdrops",
			},
		],
	};

	function RenderMobileClubs() {
		return (
			<>
				{clubs.mobile.map((item, index) => {
					return (
						<Reputation
							{...item}
							key={index}
							id={index}
							group={`${group}__vera`}
						/>
					);
				})}
			</>
		);
	}

	function RenderDesktopClubs() {
		return (
			<>
				{clubs.desktop.map((item, index) => {
					return (
						<Reputation
							{...item}
							id={index}
							key={index}
							group={`${group}__vera`}
						/>
					);
				})}
			</>
		);
	}
	return (
		<section className={`${group}__vera`}>
			<div className={`${group}__vera-wrapper`}>
				<p>
					Our platform is a reliable platform for launching your Giveaways,
					Airdrops and achievements in a fair and decentralized manner that takes advantage of Lightlink and API3.
				</p>

				<div className={`${group}__vera-dynamic`}>
					<div className={`${group}__vera-mobile`}>
						<RenderMobileClubs />
					</div>

					<div className={`${group}__vera-desktop`}>
						<RenderDesktopClubs />
					</div>
				</div>
			</div>
		</section>
	);
};
