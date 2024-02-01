import { getMessage, giveawayAction, getTokenDetails, airdropAction } from "@/utils/app.mjs";
import { truncateWalletAddress } from "@/utils";
import { FC } from "react";
import "./page.scss";

interface props {
	id?: number;
	title: string;
	giveawayImage: string;
	host: string;
	description: string;
	time: {
		start: Date;
		end: Date;
	};
	quantity: {
		total: number;
		remaining: number;
	};
	claimed: boolean;
	isCreator: boolean;
}

interface _props {
	id?: number;
	title: string;
	tokenAddress: string;
	airdropImage: string;
	host: string;
	description: string;
	time: {
		start: Date;
		end: Date;
	};
	quantity: {
		total: number;
		remaining: number;
	};
	claimed: boolean;
	isCreator: boolean;
}

export const GiveawayDetails: FC<props> = ({
	id,
	title,
	description,
	host,
	giveawayImage,
	claimed,
	isCreator,
	time: { start, end },
	quantity: { total, remaining },
}) => {
	const group = "medal-details";
	const [startDate, endDate] = [new Date(start), new Date(end)];
	const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
	const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const truncatedHost = truncateWalletAddress(host, 10);
	const handleButton = async () => {
		try {
			// write function to handle cases
			await giveawayAction(id, claimed, isCreator);
		} catch (error) {
			console.log(error);
		}
	};

	const getButtonMessage = () => {
		try {
			const message = getMessage(claimed, isCreator);
			return message;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<section className={group}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__image`}>
					<img
						src={giveawayImage}
						alt={title}
					/>
				</div>
				<div className={`${group}__description`}>
					<div className={`${group}__row`}>
						<span>
							<i
								style={{
									backgroundColor: claimed
										? "#e5f77a"
										: "#64FFA2",
								}}
							></i>
						</span>
						<span className={`${group}__ends`}>
							{claimed
								? "Ended"
								: `Ends in ${daysDiff} ${
										daysDiff === 1 ? "day" : "days"
								  }`}
						</span>
						<span>
							{`${remaining} ETH remaining`}
						</span>
					</div>

					<div className={`${group}__host`}>
						<span>
							<img src="/lightlink_logo.png" />
						</span>
						<span>{truncatedHost}</span>
					</div>

					<div className={`${group}__row`}>
						<h3>{title}</h3>
						<p>{description}</p>
					</div>

					<div className={`${group}__row`}>
						<button onClick={async () => await handleButton()}>
							{getButtonMessage()}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export const AirdropDetails: FC<_props> = async ({
	id,
	title,
	tokenAddress,
	description,
	host,
	airdropImage,
	claimed,
	isCreator,
	time: { start, end },
	quantity: { total, remaining },
}) => {
	const group = "medal-details";
	const [startDate, endDate] = [new Date(start), new Date(end)];
	const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
	const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const tokenDetails = await getTokenDetails(tokenAddress);
	const truncatedHost = truncateWalletAddress(host, 10);
	const handleButton = async () => {
		try {
			// write function to handle cases
			await airdropAction(id, claimed, isCreator);
		} catch (error) {
			console.log(error);
		}
	};

	const getButtonMessage = () => {
		try {
			const message = getMessage(claimed, isCreator);
			return message;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<section className={group}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__image`}>
					<img
						src={airdropImage}
						alt={title}
					/>
				</div>
				<div className={`${group}__description`}>
					<div className={`${group}__row`}>
						<span>
							<i
								style={{
									backgroundColor: claimed
										? "#e5f77a"
										: "#64FFA2",
								}}
							></i>
						</span>
						<span className={`${group}__ends`}>
							{claimed
								? "Ended"
								: `Ends in ${daysDiff} ${
										daysDiff === 1 ? "day" : "days"
								  }`}
						</span>
						<span>
							{`${remaining} ${tokenDetails.tokenSymbol} remaining`}
						</span>
					</div>

					<div className={`${group}__row`}>
						<span className={`${group}__ends`}>
							{`Token Name : ${tokenDetails.tokenName}`}
						</span>
						<span>
							{`Token Symbol: ${tokenDetails.tokenSymbol}`}
						</span>
					</div>

					<div className={`${group}__host`}>
						<span>
							<img src="/lightlink_logo.png" />
						</span>
						<span>{truncatedHost}</span>
					</div>

					<div className={`${group}__row`}>
						<h3>{title}</h3>
						<p>{description}</p>
					</div>

					<div className={`${group}__row`}>
						<button onClick={async () => await handleButton()}>
							{getButtonMessage()}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
