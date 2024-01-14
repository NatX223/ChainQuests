// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
// import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Giveaway is Ownable {
    using Counters for Counters.Counter; // OpenZepplin Counter
    Counters.Counter private _giveawayCount; // Counter for giveaways

    struct giveaway {
        address owner;
        address rewardAddress;
        uint256 limit;
        uint256 rewardAmount;
    }

    mapping (uint256 => giveaway) public giveaways;
    mapping (uint256 => address[]) public participants;

    constructor(address _airnodeRrp, address _owner) Ownable(_owner) {}

// createGiveaway: Function to create a giveaway by specifying the reward details and limit.
// @param _rewardAddress: The address of the ERC-20 token used as the giveaway reward.
// @param _limit: The maximum number of participants allowed in the giveaway.
// @param _rewardAmount: The amount of the reward to be distributed to each participant.
// @dev This function transfers the specified reward amount from the sender to the contract.
// @dev The giveaway details, including owner, reward address, limit, and reward amount,
//      are stored in the 'giveaways' mapping using the current giveaway count as the key.
// @dev The current giveaway count is then incremented for the next giveaway.
function createGiveaway(address _rewardAddress, uint256 _limit, uint256 _rewardAmount) public {

    // Create an instance of the IERC20 interface for the specified reward token.
    IERC20 rewardToken = IERC20(_rewardAddress);

    // Transfer the specified reward amount from the sender to the contract.
    rewardToken.transferFrom(msg.sender, address(this), _rewardAmount);

    // Store the giveaway details in the 'giveaways' mapping using the current giveaway count as the key.
    giveaways[_giveawayCount.current()].owner = msg.sender;
    giveaways[_giveawayCount.current()].rewardAddress = _rewardAddress;
    giveaways[_giveawayCount.current()].limit = _limit;
    giveaways[_giveawayCount.current()].rewardAmount = _rewardAmount;

    // Increment the current giveaway count for the next giveaway.
    _giveawayCount.increment();
}

// participate: Function allowing an address to participate in a specific giveaway.
// @param id: The unique identifier of the giveaway in which the participant wants to join.
// @dev This function first checks that the participant is not the owner of the giveaway,
//      as the owner is restricted from participating in their own giveaway.
// @dev If the participant is the owner, the function reverts with an error message.
// @dev If the participant is not the owner, the function appends their address (msg.sender)
//      to the list of participants for the specified giveaway identified by the given 'id'.
// @param id: The unique identifier of the giveaway in which the participant wants to join.
function participate(uint256 id) public {
    // Check that the participant is not the owner of the giveaway.
    require(giveaways[id].owner != msg.sender, "owner of giveaway cannot participate");

    // If the participant is not the owner, push their address (msg.sender) to the list of participants for the giveaway.
    participants[id].push(msg.sender);
}

// function reward(uint256 id) public {
//     require(giveaways[id].owner == msg.sender, "Only the owner can reward the giveaway");
//     // get random numbers
//     // calculaate the amount to send

//     // send the amount to participants

// }

// function getRandom(uint256 id) public returns() {
    
// }


}

// prereq
// 1. import dependencies ✅
// 2. define data structures ✅
// 3. write all functions(interface and details)

// functions
// 1. create Giveaway ✅
// 2. participate in give away
// 3. reward giveaway