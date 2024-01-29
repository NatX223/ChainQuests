import { ethers } from "ethers";
var provider;
var signer;

const baseAPIURL = "https://localhost:3300/";

const giveawayContractAddress = "0x9Fc3168ee0Cf90aaBF485BF24c337da9922bB4a3";
const giveawayABI = [
    {
		"inputs": [],
		"name": "creategiveaway",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "giveawayId",
			"type": "uint256"
		  }
		],
		"name": "claimGiveaway",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const airdropContractAddress = "0xe18A8E1072e932841573d5716b69F9121BE8E69C";
const airdropABI = [
    {
		"inputs": [
		  {
			"internalType": "address",
			"name": "_tokenAddress",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "_airdropAmount",
			"type": "uint256"
		  }
		],
		"name": "createAirdrop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "airdropId",
			"type": "uint256"
		  }
		],
		"name": "claimAirdrop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  }
];

const tokenABI = [{
	"inputs": [
	  {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	  }
	],
	"name": "approve",
	"outputs": [
	  {
		"internalType": "bool",
		"name": "",
		"type": "bool"
	  }
	],
	"stateMutability": "nonpayable",
	"type": "function"
}]

export const connectWallet = async () => {
	try {
		if (window.ethereum) {
			provider = new ethers.BrowserProvider(window.ethereum);
			
			// checking if the network is available on the wallet
			await provider.send("eth_requestAccounts", []);
			signer = await provider.getSigner();
			}
			else {
				return "No wallet installed";
			}
			} catch (error) {
				console.error(error);
			}
	}

export const getUserAddress = async () => {
	const address = await signer.getAddress();
	console.log(address);
	return address;
};

// upload image
export const uploadImage = async (image) => {
	try {
		const formData = new FormData();
		formData.append("file", image);

		// call upload function to API with details
		const endPoint = "uploadImage";

		const uploadEndpoint = baseAPIURL + endPoint;

		const response = await fetch(uploadEndpoint, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();

		console.log("File uploaded succesfully", data);
		return data.url;
	} catch (error) {
		console.log(error);
	}
};

// create giveaway
export const createGiveaway = async (createBody) => {
	try {
		await connectWallet();
		const creator = await getUserAddress();

		const image = createBody.image;
		const url = await uploadImage(image);

		const giveawayAmount = Number(createBody.amount);

		const body = { image: url };
		body.title = createBody.title;
		body.description = createBody.description;
		body.giveawayAmount = giveawayAmount;
		body.remainingAmount = giveawayAmount;
		body.additionalInfo = createBody.additionalInfo;
		body.creator = creator;
		body.startDate = createBody.startDate;
		body.endDate = createBody.endDate;
		
		const endPoint = "createGiveaway";

		const createGiveawayEndpoint = baseAPIURL + endPoint;

		const response = await fetch(createGiveawayEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();

		const contract = new ethers.Contract(
			giveawayContractAddress,
			giveawayABI,
			signer,
		);

		const _giveawayAmount = ethers.parseEther(giveawayAmount);

		const TX = await contract.createGiveaway({ value: _giveawayAmount });
		const receipt = await TX.wait();
		console.log("created", receipt);

		console.log("created Successfully", data.response, receipt);
	} catch (error) {
		console.log(error);
	}
};

export const createAirdrop = async (createBody) => {
	try {
		await connectWallet();
		const creator = await getUserAddress();

		const image = createBody.image;
		const url = await uploadImage(image);

		const airdropAmount = Number(createBody.amount);

		const body = { image: url };
		body.title = createBody.title;
		body.description = createBody.description;
		body.airdropAmount = airdropAmount;
		body.remainingAmount = airdropAmount;
		body.additionalInfo = createBody.additionalInfo;
		body.creator = creator;
		body.startDate = createBody.startDate;
		body.endDate = createBody.endDate;
        body.tokenAddress = createBody.tokenAddress;
		
		const endPoint = "createAirdrop";

		const createAirdropEndpoint = baseAPIURL + endPoint;

		const response = await fetch(createAirdropEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();

		const contract = new ethers.Contract(
			airdropContractAddress,
			airdropABI,
			signer,
		);

        const tokenContract = new ethers.Contract(
            createBody.tokenAddress,
            tokenABI,
            signer
        )

		const _airdropAmount = ethers.parseEther(airdropAmount);

        const approveTX = await tokenContract.approve(airdropContractAddress, _airdropAmount);
        const approveReceipt = await approveTX.wait();
		console.log("created", approveReceipt);
		const TX = await contract.createAirdrop(createBody.tokenAddress, _airdropAmount);
		const receipt = await TX.wait();
		console.log("created", receipt);

		console.log("created Successfully", data.response, receipt);
	} catch (error) {
		console.log(error);
	}
};

// participate
export const medalAction = async (id, claimed, isCreator, isParticipant) => {
	try {
		await connectWallet();
		const address = await getUserAddress();

		if (claimed) {
			console.log(claimed);
		}

		if (isCreator) {
			await mintEligible();
		}

		if (isParticipant) {
			console.log(isParticipant);
		} else {
			const endPoint = `participate/${id}`;
			console.log(id);
	
			const participateEndpoint = baseAPIURL + endPoint;
	
			const response = await fetch(participateEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ address: address }),
			});
	
			if (!response.ok) {
				throw new Error("Server Error");
			}
	
			const data = await response.json();
	
			console.log("registered Successfully", data.response);
	
		}

	} catch (error) {
		console.log(error);
	}
};

export const getMessage = (claimed, isCreator, isParticipant) => {
	if (claimed) {
		return "Minted";
	}

	if (isCreator) {
		return "Mint to Eligible";
	}

	if (isParticipant) {
		return "Particpated";
	} else {
		return "Participate";
	}
}