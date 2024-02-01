import { GiveawayDetails } from "@/app/explore/[id]/page";
import { ORGANIZATION_MEDALS } from "@/assets/data";
import { Badge } from "@/components";
import { useFetch } from "@/hooks/useFetch";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import "./index.scss";

export const RenderOrgMedals = function ({ group }: { group: string }) {
	return (
		<div className={`${group}__medals`}>
			{ORGANIZATION_MEDALS.map((item: any, index: number) => {
				const { id, value } = item;

				return (
					<div
						key={index | id}
						className={`${group}__medal`}
					>
						<Badge
							group={`${group}__medal`}
							{...value}
						/>
					</div>
				);
			})}
		</div>
	);
};

export const Giveaways = ({ group }: { group: string }) => {
	// const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;
	const baseApiUrl = "http://localhost:3300/";
	const { address, isConnected } = useWeb3ModalAccount();
	const API = `${baseApiUrl}getAllGiveaways/${address}`;

	const { data, loading, error } = useFetch({ url: API });
	const GIVEAWAYS = data as string[];

	return loading ? (
		<p>Loading...</p>
	) : error ? (
		<p>Error loading Medals. please check your internet connection</p>
	) : (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__medals`}>
					{GIVEAWAYS.map((item: any, index: number) => {
						const { id, value } = item;

						return (
							<div
								key={index | id}
								className={`${group}__medal-detail`}
							>
								<GiveawayDetails
									group={`${group}__medal-detail`}
									{...value}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export const Airdrops = ({ group }: { group: string }) => {
	// const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;
	const baseApiUrl = "http://localhost:3300/";
	const { address, isConnected } = useWeb3ModalAccount();
	const API = `${baseApiUrl}getAllAirdrops/${address}`;

	const { data, loading, error } = useFetch({ url: API });
	const AIRDROPS = data as string[];

	return loading ? (
		<p>Loading...</p>
	) : error ? (
		<p>Error loading Medals. please check your internet connection</p>
	) : (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__medals`}>
					{AIRDROPS.map((item: any, index: number) => {
						const { id, value } = item;

						return (
							<div
								key={index | id}
								className={`${group}__medal-detail`}
							>
								<GiveawayDetails
									group={`${group}__medal-detail`}
									{...value}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};