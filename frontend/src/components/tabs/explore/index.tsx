import { tabProps } from "..";
import { FC } from "react";
import "./index.scss";

export const ExploreTabs: FC<tabProps> = ({
	group,
	onTabChange,
	tabIsActive,
}) => {
	return (
		<section className={`${group}__tabs`}>
			<div className={`${group}__tabs-wrapper`}>
				<button
					className={`${tabIsActive("board")} ${group}__tabs-button`}
					onClick={() => onTabChange("board")}
				>
					<span>Giveaways</span>
				</button>

				<button
					className={`${tabIsActive("medals")} ${group}__tabs-button`}
					onClick={() => onTabChange("medals")}
				>
					<span>Airdrops</span>
				</button>
			</div>
		</section>
	);
};
