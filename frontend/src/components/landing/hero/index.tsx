import React from "react";
import "./index.scss";

export const Hero = ({ group }: { group: string }) => {
	return (
		<section className={`${group}__hero`}>
			<div className={`${group}__hero-wrapper`}>
				{/* Main heading for the hero section */}
				<h1>The standard for randomized distribution</h1>

				{/* Description text with a highlighted word */}
				<p>
					Chain<span>Quests</span> is your Gateway to Fair and Transparent distribution.
				</p>

				<figure>
					<img
						src="/desktopBG.png"
						alt=""
					/>
				</figure>
			</div>
		</section>
	);
};
