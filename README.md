# ChainQuests

> ## Table of Contents

-   [Problem Statement](#Problem-statement)
-   [Solution](#Solution)
-   [How it works](#How-it-works)
-   [Technologies Used](#technologies-used)
    -   [Smart Contract](#solidity-smart-contracts)
    -   [Backend](#backend)
    -   [Covalent API](#Covalent-API)
#

> ## Problem-statement

Problem Statement: Organizers of web3 giveaways(Individuals and Protocols) lack a user-friendly and transparent platform for 
efficiently managing and equitably distributing giveaway amounts. Additionally, users face challenges in discovering legitimate 
giveaways and airdrops. The need is for a solution that streamlines giveaway organization, enhances transparency, and provides a 
reliable platform for users to find credible opportunities.

> ## Solution


Solution: Introducing a platform that empowers both protocols and individuals to effortlessly organize giveaways and initiate 
airdrops. Through this solution, rewards are distributed randomly among participants, ensuring a fair and engaging experience for all 
involved.

> ## How-it-works

For Organizers: Organizers can effortlessly initiate giveaways and airdrops through a user-friendly form, detailing the designated 
amount for each event. Upon completion, organizers will be prompted to sign a transaction, securely locking the specified amount of 
ETH or airdropped tokens in a smart contract dedicated to tracking each giveaway or airdrop.

For Users: Users can visit the app's Explore page, featuring a comprehensive list of available giveaways and airdrops. If not claimed 
previously, users can click the "Claim" button. Upon doing so, they will be prompted to sign a transaction, enabling a randomized 
allocation of their share in the giveaway or airdrop.

> ## Technologies Used

| <b><u>Stack</u></b>      | <b><u>UsageSummary</u></b>                           |
| :----------------------- | :--------------------------------------------------- |
| **`Solidity`**           | Smart contract                                       |
| **`LightLink Testnet`**  | Deploying smart contracts                            |
| **`API3`**               | using QRNG to intruduce randomness                   |
| **`Node.js`**            | Backend                                              |
| **`React.js & Next.js`** | Frontend                                             |

-   ### **Solidity smart contracts**

    The contracts can be found [here](https://github.com/Metastuc/wagmiclub-2.0-/tree/main/contracts)

    -   **Badges** This is soul bound token (SBT) implemented as an VRC725 contract for issuing badges to users, each badge is represented by a new tokenId. The Badge contract can be found [here](https://github.com/Metastuc/wagmiclub-2.0-/blob/main/contracts/contracts/Badge.sol). The deployed address of the Badge contract on Viction testnet is 0x9Fc3168ee0Cf90aaBF485BF24c337da9922bB4a3
    -   **Medals** The medals contract implements the ERC1155 contract standard and is also a soul bound token (SBT), this contract is used to award medal tokens to eligible participants using the batchMint function which only the creator of the medal can mint and the input is gotten from the backend to make sure only the eligible candidates get the token minted to them. The Medal contract can be found [here](https://github.com/Metastuc/wagmiclub-2.0-/blob/main/contracts/contracts/Medal.sol). The deployed address of the Badge contract on Viction testnet is 0xe18A8E1072e932841573d5716b69F9121BE8E69C
    -   **How to run** clone the repo, enter the contracts folder and download the npm packages by running:
    ```bash
    npm install
    # or
    yarn add
    ```
    configure the hardhat.config file(default set to mumbai) then deploy to any chain of choice of using the commands
    ```bash
    npx hardhat run --network <your-network> scripts/deployMedal.js
    npx hardhat run --network <your-network> scripts/deployBadge.js
    ```

-   ### **Backend**

    -   <b style="color: orange">Node.js was the framework used for the backend</b>, we used the backend to call the Covalent Unified API and to feed in the eligible addresses for medals to be minted.The backend was also used to handle storage of user information along with the firestore database. Public endpoints can be accessed [here](wagmi-backend.up.railway.app). The code for the backend can be found [here] (https://github.com/Metastuc/wagmiclub-2.0-/blob/main/server/index.js)
    
-   ### **Covalent-API**

    -   The Covalent API was used to fetch users onchain metrics like number of NFTs an account has and how much tokens an address has been transferred to an account example usage can be found[here](https://github.com/Metastuc/wagmiclub-2.0-/blob/main/server/index.js) and the endpoint that most utilized this is the getEligible and getEligibleArray endpoints.