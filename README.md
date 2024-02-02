# ChainQuests

> ## Table of Contents

-   [Problem Statement](#Problem-statement)
-   [Solution](#Solution)
-   [How it works](#How-it-works)
-   [Technologies Used](#technologies-used)
    -   [Smart Contract](#Solidity-smart-contracts)
    -   [LightLink Testnet](#LightLink-Testnet)
    -   [API3](#API3)
    -   [Backend](#backend)
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

    The  smart contracts can be found [here](https://github.com/NatX223/ChainQuests/tree/main/Smart-Contracts/contracts)

    -   **Giveaway Contract** The giveaway contract serves as the central hub for managing all giveaways created on the platform. It 
    utilizes the OpenZeppelin Counters contract and defines various structs to monitor giveaway balances. Users can leverage the 
    contract's functionality to create giveaways with ETH by invoking the createGiveaway function. This establishes a systematic and 
    secure approach to organizing and tracking giveaways within the platform. The Giveaway contract code can be found [here](https://
    github.com/NatX223/ChainQuests/blob/main/Smart-Contracts/contracts/Giveaway.sol). The deployed address of the Giveaway contract 
    on LightLink Pegasus testnet is 0x9Fc3168ee0Cf90aaBF485BF24c337da9922bB4a3
    -   **Airdrop Contract** The airdrop contract takes charge of creating, organizing, and facilitating the claiming process for 
    airdrops on the platform. It streamlines the airdrop launch process for token creators by featuring the createAirdrop function. 
    This function prompts creators to send and lock the designated amount of tokens in the airdrop contract. Leveraging OpenZeppelin 
    Counters contract and the IERC20 interface, the contract ensures a systematic and efficient management of airdrop activities on the platform. The Airdrop contract can be found [here](https://github.com/NatX223/ChainQuests/blob/main/Smart-Contracts/contracts/Airdrop.sol). The deployed address of the Airdrop contract on LightLink Pegasus testnet is 
    0xe18A8E1072e932841573d5716b69F9121BE8E69C

    -   **How to run** clone the repo, enter the contracts folder and download the npm packages by running:
    ```bash
    npm install
    # or
    yarn add
    ```
    configure the hardhat.config file(default set to mumbai) then deploy to any chain of choice of using the commands
    ```bash
    npx hardhat run --network <your-network> scripts/deployGiveaway.js
    npx hardhat run --network <your-network> scripts/deployAirdrop.js
    ```

-   ### **LightLink-Testnet**

    - The smart contracts were deployed on the LightLink pegasus testnet and enterprise mode was also used to abstract gas fees for both organizers and users

-   ### **API3**

    - API3 QRNG was used to introduce randomness to the process of claiming both Airdrops and Giveaways by generating single uint256 
    numbers. The numbers generated were then trimmed down to numbers between 10 and 100 (representing 1% to 10%) and used to 
    determine the amount to be claimed by a user.

-   ### **Backend**

    -   <b style="color: orange">Node.js was the framework used for the backend</b>, I used the backend to handle the storage and 
    retrieval of Giveaway and Airdrop details on a database(Firestore DB). The backend code can be found [here](https://github.com/NatX223/ChainQuests/tree/main/Backend)
    