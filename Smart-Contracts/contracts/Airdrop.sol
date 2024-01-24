// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable, RrpRequesterV0 {
    using Counters for Counters.Counter; // OpenZeppelin Counter
    Counters.Counter private _airdropCount; // Counter for airdrops created

    // Event emitted when a uint256 value is requested
    event RequestedUint256(bytes32 indexed requestId);
    // Event emitted when a uint256 response is received
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    // Event emitted when an airdrop is released to a user
    event AirdropReleased(address tokenAddress, address user, uint256 amount);
    // Event emitted when request parameters are set
    event SetRequestParameters(address airnode, bytes32 endpointIdUint256, address sponsorWallet);

    // Airnode related variables
    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;

    // Airdrop struct
    struct airdrop {
        address creator;
        address tokenAddress;
        uint256 airdropAmount;
        uint256 airdropBalance;
    }

    // Keeps track of who made a request and for what airdrop it's meant
    struct Request {
        uint256 id;
        address requester;
    }

    // Keeps tracks of airdrops with their ids
    mapping(uint256 => airdrop) public airdrops;

    // Mapping to track the sender of each request
    mapping(bytes32 => Request) requests;

    // Mapping to track claimed status for each address in an airdrop
    mapping(address => mapping (uint256 => bool)) public claimed;

    // Mapping to track requests expected to be fulfilled
    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    // Constructor initializes the contract with Airnode RRP and owner addresses
    constructor(address _airnodeRrp, address _owner) RrpRequesterV0(_airnodeRrp) Ownable(_owner) {
    }

    /// @notice Create an airdrop by transferring tokens to the contract
    /// @param _tokenAddress Address of the ERC-20 token to be used for the airdrop
    /// @param _airdropAmount Amount of tokens to be used for the airdrop
    function createAirdrop(address _tokenAddress, uint256 _airdropAmount) external {
        _airdropCount.increment();
        uint256 id = _airdropCount.current();

        airdrops[id].creator = msg.sender;
        airdrops[id].tokenAddress = _tokenAddress;
        airdrops[id].airdropAmount = _airdropAmount;
        airdrops[id].airdropBalance = _airdropAmount;

        // Create an instance of the IERC20 interface for the specified reward token.
        IERC20 rewardToken = IERC20(_tokenAddress);

        // Transfer the specified reward amount from the sender to the contract.
        rewardToken.transferFrom(msg.sender, address(this), _airdropAmount);
    }

    /// @notice Set request parameters for the airdrop
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

    /// @notice Participants claim the airdrop using Airnode requests
    /// @param airdropId ID of the airdrop participants are claiming from
    function claimAirdrop(uint256 airdropId) external {
        require(claimed[msg.sender][airdropId] != true, "You can only claim once");
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
        requests[requestId].id = airdropId;
        
        // Mark the participant as claimed
        claimed[msg.sender][airdropId] = true;
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
        // Release the airdrop to the participant
        releaseAirdrop(requests[requestId].id, requests[requestId].requester, randomNumber);
        // Emit an event to log the received value
        emit ReceivedUint256(requestId, randomNumber);
    }

    /// @notice Release the airdrop to a participant based on a random number
    /// @param id ID of the airdrop
    /// @param claimer Address of the participant claiming the airdrop
    /// @param randomNumner Random number generated by the Airnode
    function releaseAirdrop(uint256 id, address claimer, uint256 randomNumner) internal {
        // Trim the number to be between 1 and 100 to represent 0.1% and 10%
        uint256 claimPercentage = (randomNumner % 100) + 1;
        // Calculate the amount
        uint256 claimAmount = (airdrops[id].airdropAmount / 1000) * claimPercentage;

        IERC20 rewardToken = IERC20(airdrops[id].tokenAddress);

        // Get the balance of the contract
        uint256 airdropBalance = airdrops[id].airdropBalance;

        // If the claim amount is more than half of the contract balance,
        // transfer half of the balance to the claimer
       
        if ((claimAmount * 2) >= airdropBalance) {
            uint256 _claimAmount = (airdropBalance / 1000) * claimPercentage;
            rewardToken.transfer(claimer, _claimAmount);
            airdrops[id].airdropBalance -= _claimAmount;
            emit AirdropReleased(airdrops[id].tokenAddress, claimer, _claimAmount);
        } else {
            // Otherwise, transfer the calculated claim amount to the claimer
            rewardToken.transfer(claimer, claimAmount);
            airdrops[id].airdropBalance -= claimAmount;
            emit AirdropReleased(airdrops[id].tokenAddress, claimer, claimAmount);
        }
    }
}
