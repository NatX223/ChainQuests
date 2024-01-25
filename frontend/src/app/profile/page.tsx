"use client";

import React, { useState, useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Link from "next/link";
import {
	Actions,
	Bio,
	ProfileBadges,
	ProfileMedals,
	TrustScores,
} from "@/components";
import { Web3Modal, useFetch } from "@/hooks";
import { X } from "@/assets/icons";
import "./page.scss";

import { useWeb3Modal } from "@web3modal/ethers/react";

interface Medal {
	id: number;
	value: {
		image: string;
		verified: boolean;
		name: string;
		headImg: string;
		created: string;
		transacId: string;
		desc: string;
		time: {
			start: string;
			end: string;
		};
		validator: string;
		rating: number;
	};
}

interface Badge {
	id: number;
	value: {
		verified: boolean;
		name: string;
		created: string;
		transacId: string;
		desc: string;
		time: {
			start: string;
			end: string;
		};
		validator: string;
		rating: number;
	};
}

interface Bio {
	name: string;
	username: string;
	bio: string;
	profession: string;
	followers: number;
	following: number;
	discord: string;
	x: string;
	telegram: string;
	website: string;
}

interface UserProfileData {
	bio: Bio;
	badges: Badge[];
	medals: Medal[];
}

const Profile = () => {
	const group = "profile";

	const { address, isConnected } = useWeb3ModalAccount();

	console.log({ address, isConnected });

	const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

	const URL = `${baseApiUrl}getUserProfileAddress/${address}`;

	const { data, loading, error } = useFetch({ url: URL });
	const [profile, setProfile] = useState<UserProfileData | null>(null);

	useEffect(() => {
		if (!data || error) return;
		setProfile(data as any);
	}, [data, error]);

	// useEffect(() => {
	// 	isConnected &&
	// 		(async () => {
	// 			const { exists } = (
	// 				await axios.get(`${baseAPIURL}checkUser/${address}`)
	// 			).data;

	// 			!exists && router.replace("/profile/edit");
	// 		})();
	// }, [isConnected]);

	console.log({ profile });

	const { open } = useWeb3Modal();

	return (
		<section className={`${group}`}>
			<section className={`${group}__wrapper`}>
				{/* Conditional rendering based on loading state */}
				{loading && <p>Loading profile...</p>}

				{/* Conditional rendering based on error state */}
				{error && <p>Error loading data: {error.message}</p>}

				{/* Render other components only if data is available and no error occurred */}
				{profile && !error && (
					<>
						<Actions group={`${group}__actions`} />

						<Bio
							group={`${group}__bio`}
							{...profile.bio}
						/>

						<ProfileBadges
							group={`${group}__badges`}
							badges={profile.badges}
						/>

						<TrustScores group={`${group}__trustscores`} />

						<ProfileMedals
							group={`${group}__medals`}
							{...profile.medals}
						/>

						<section className={`${group}__socials`}>
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
						</section>
					</>
				)}
			</section>
		</section>
	);
};

export default Profile;
