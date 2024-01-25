import {
	Club,
	Footer,
	Hero,
	PoweredBy,
	PrimaryNav,
	Vera,
} from "@/components";
import "./page.scss";

const Landing = () => {
	return (
		<section>
			<section className="landing">
				<div className="landing__wrapper">
					{/* navbar-component */}
					<PrimaryNav />

					<Hero group="landing" />

					{/* club component */}
					<Club group="landing" />

					<section className="landing__about">
						<div className="landing__about-wrapper">
							<p>
								Reward fairly, Earn fairly <br />
								Create and participate in <span>Airdrops, Giveaways and NFT Mints</span>
							</p>
						</div>
					</section>

					{/* PoweredBy component */}
					<PoweredBy group={"landing"} />

					<Vera group={"landing"} />

					<footer className="landing__footer">
						<Footer group={"landing"} />
					</footer>
				</div>
			</section>
		</section>
	);
};

export default Landing;
