// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Giveaway is Ownable, RrpRequesterV0 {
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);

    address public airnode;
    bytes32 public endpointIdUint256Array;
    address public sponsorWallet;

    address public rewardAddress;
    uint256 public limit;
    uint256 public rewardAmount;

    address[] public participants;
    // the selected ids
    uint256[] internal giveawayIds;
    // keeps tracks of the ids
    uint256 internal giveawayindex;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    constructor(address _airnodeRrp, address _owner, address _rewardAddress, uint256 _limit, uint256 _rewardAmount) RrpRequesterV0(_airnodeRrp) Ownable(_owner) {
        // Create an instance of the IERC20 interface for the specified reward token.
        IERC20 rewardToken = IERC20(_rewardAddress);

        // Transfer the specified reward amount from the sender to the contract.
        rewardToken.transferFrom(msg.sender, address(this), _rewardAmount);

        rewardAddress = _rewardAddress;
        limit = _limit;
        rewardAmount = _rewardAmount;

    }

// participate: Function allowing an address to participate in a specific giveaway.
// @param id: The unique identifier of the giveaway in which the participant wants to join.
// @dev This function first checks that the participant is not the owner of the giveaway,
//      as the owner is restricted from participating in their own giveaway.
// @dev If the participant is the owner, the function reverts with an error message.
// @dev If the participant is not the owner, the function appends their address (msg.sender)
//      to the list of participants for the specified giveaway identified by the given 'id'.
// @param id: The unique identifier of the giveaway in which the participant wants to join.
function participate() public {
    // Check that the participant is not the owner of the giveaway.
    require(owner() != msg.sender, "owner of giveaway cannot participate");

    // If the participant is not the owner, push their address (msg.sender) to the list of participants for the giveaway.
    participants.push(msg.sender);
}

    /// @notice Sets parameters used in requesting QRNG services
    /// @dev No access control is implemented here for convenience. This is not
    /// secure because it allows the contract to be pointed to an arbitrary
    /// Airnode. Normally, this function should only be callable by the "owner"
    /// or not exist in the first place.
    /// @param _airnode Airnode address
    /// @param _endpointIdUint256Array Endpoint ID used to request a `uint256[]`
    /// @param _sponsorWallet Sponsor wallet address
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256Array,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    /// @notice Requests a `uint256[]`
    function rewardGiveaway() external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256Array,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfilRewards.selector,
            // Using Airnode ABI to encode the parameters
            abi.encode(bytes32("1u"), bytes32("size"), limit)
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        emit RequestedUint256Array(requestId, limit);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    /// @param requestId Request ID
    /// @param data ABI-encoded response
    function fulfilRewards(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256[] memory qrngUint256Array = abi.decode(data, (uint256[]));
        // Do what you want with `qrngUint256Array` here...
        emit ReceivedUint256Array(requestId, qrngUint256Array);
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