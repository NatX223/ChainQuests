import Link from "next/link";
import "./index.scss";

export const Logo = () => {
	return (
		<section className="logo">
			{/* Logo wrapper with a link to the home page */}
			<div className="logo__wrapper">
				{/* Link to the home page */}
				<Link
					href="/"
					className="logo__link"
				>
					{/* First part of the logo */}
					<span>Chain</span>

					{/* Second part of the logo */}
					<span>Quests</span>
				</Link>
			</div>
		</section>
	);
};
