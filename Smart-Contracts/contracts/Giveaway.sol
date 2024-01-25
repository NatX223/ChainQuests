// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Giveaway is Ownable, RrpRequesterV0 {
    using Counters for Counters.Counter; // OpenZeppelin Counter
    Counters.Counter private _giveawayCount; // Counter for giveaways created

    // Event emitted when a uint256 value is requested
    event RequestedUint256(bytes32 indexed requestId);
    // Event emitted when a uint256 response is received
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    // Event emitted when an giveaway is released to a user
    event GiveawayReleased(address user, uint256 amount);
    // Event emitted when request parameters are set
    event SetRequestParameters(address airnode, bytes32 endpointIdUint256, address sponsorWallet);

    // Airnode related variables
    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;

    // Giveaway struct
    struct giveaway {
        address creator;
        uint256 giveawayAmount;
        uint256 giveawayBalance;
    }

    // Keeps track of who made a request and for what giveaway it's meant
    struct Request {
        uint256 id;
        address requester;
    }

    // Keeps tracks of giveaways with their ids
    mapping(uint256 => giveaway) public giveaways;

    // Mapping to track the sender of each request
    mapping(bytes32 => Request) requests;

    // Mapping to track claimed status for each address in an giveaway
    mapping(address => mapping (uint256 => bool)) public claimed;

    // Mapping to track requests expected to be fulfilled
    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    // Constructor initializes the contract with Airnode RRP and owner addresses
    constructor(address _airnodeRrp, address _owner) RrpRequesterV0(_airnodeRrp) Ownable(_owner) {
    }

    /// @notice Create an giveaway by transferring native coins to the contract
    function creategiveaway() external payable {
        _giveawayCount.increment();
        uint256 id = _giveawayCount.current();

        giveaways[id].creator = msg.sender;
        giveaways[id].giveawayAmount = msg.value;
        giveaways[id].giveawayBalance = msg.value;
    }

    /// @notice Set request parameters for the giveaway
    /// @param _airnode Address of the Airnode contract
    /// @param _endpointIdUint256 Endpoint ID for the uint256 value request
    /// @param _sponsorWallet Address of the sponsor's wallet
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        address _sponsorWallet
    ) external onlyOwner {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        sponsorWallet = _sponsorWallet;
        emit SetRequestParameters(airnode, endpointIdUint256, sponsorWallet);
    }

    /// @notice Participants claim the giveaway using Airnode requests
    /// @param giveawayId ID of the giveaway participants are claiming from
    function claimGiveaway(uint256 giveawayId) external {
        require(claimed[msg.sender][giveawayId] != true, "You can only claim once");
        // Create a request to the Airnode to obtain a uint256 value
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfilClaim.selector,
            ""
        );
        // Mark the request as expected to be fulfilled
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        // Record the sender of the request
        requests[requestId].requester = msg.sender;
        requests[requestId].id = giveawayId;
        
        // Mark the participant as claimed
        claimed[msg.sender][giveawayId] = true;
        // Emit an event to log the request
        emit RequestedUint256(requestId);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    /// @param requestId Request ID
    /// @param data ABI-encoded response
    function fulfilClaim(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        // Decode the response to obtain the random number
        uint256 randomNumber = abi.decode(data, (uint256));
        // Release the giveaway to the participant
        releaseGiveaway(requests[requestId].id, requests[requestId].requester, randomNumber);
        // Emit an event to log the received value
        emit ReceivedUint256(requestId, randomNumber);
    }

    /// @notice Release the giveaway to a participant based on a random number
    /// @param id ID of the giveaway
    /// @param claimer Address of the participant claiming the giveaway
    /// @param randomNumner Random number generated by the Airnode
    function releaseGiveaway(uint256 id, address claimer, uint256 randomNumner) internal {
        // Trim the number to be between 1 and 100 to represent 0.1% and 10%
        uint256 claimPercentage = (randomNumner % 100) + 1;
        // Calculate the amount
        uint256 claimAmount = (giveaways[id].giveawayAmount / 1000) * claimPercentage;

        // Get the balance of the contract
        uint256 giveawayBalance = giveaways[id].giveawayBalance;

        // If the claim amount is more than half of the contract balance,
        // transfer half of the balance to the claimer
       
        if ((claimAmount * 2) >= giveawayBalance) {
            uint256 _claimAmount = (giveawayBalance / 1000) * claimPercentage;
            payable(claimer).transfer(_claimAmount);
            giveaways[id].giveawayBalance -= _claimAmount;
            emit GiveawayReleased(claimer, _claimAmount);
        } else {
            // Otherwise, transfer the calculated claim amount to the claimer
            giveaways[id].giveawayBalance -= claimAmount;
            payable(claimer).transfer(claimAmount);
            emit GiveawayReleased(claimer, claimAmount);
        }
    }
}
