import "./index.scss";

export const PoweredBy = ({ group }: { group: string }) => {
	return (
		<section className={`${group}__powered`}>
			<div className={`${group}__powered-wrapper`}>
				<div className={`${group}__powered-top`}>

				</div>
				<div className={`${group}__powered-bottom`}>
					<b>Powered By</b>

					<div>
						<img
							src="/lightlink_logo.png"
							alt=""
						/>
					</div>

					<div>
						<i>
							<img
								src="/API3Logo.jpg"
								alt=""
							/>
						</i>
					</div>
				</div>
			</div>
		</section>
	);
};