// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable, RrpRequesterV0 {
    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    event AirdropReleased(address rewardAddress, address user, uint256 amount);

    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;

    address public rewardAddress;
    uint256 public rewardAmount;

    mapping(bytes32 => address) requestSender;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    constructor(address _airnodeRrp, address _owner, address _rewardAddress, uint256 _rewardAmount) RrpRequesterV0(_airnodeRrp) Ownable(_owner) {
        // Create an instance of the IERC20 interface for the specified reward token.
        IERC20 rewardToken = IERC20(_rewardAddress);

        // Transfer the specified reward amount from the sender to the contract.
        rewardToken.transferFrom(msg.sender, address(this), _rewardAmount);

        rewardAddress = _rewardAddress;
        rewardAmount = _rewardAmount;

        // hardcoded for testnets
        airnode = 0x6238772544f029ecaBfDED4300f13A3c4FE84E1D;
        endpointIdUint256 = 0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36;
        // sponsorWallet = _sponsorWallet;
    }

    function claimAirdrop() external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfilClaim.selector,
            ""
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        requestSender[requestId] = msg.sender;
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
        uint256 randomNumber = abi.decode(data, (uint256));
        releaseAirdrop(requestSender[requestId], randomNumber);

        emit ReceivedUint256(requestId, randomNumber);
    }

    function releaseAirdrop(address claimer, uint256 randomNumner) internal {
        // trim the number to be between 1 and 100 to represent 0.1% and 10%
        uint256 claimPercentage = (randomNumner % 100) + 1;
        // calculate the amount
        uint256 claimAmount = (rewardAmount / 1000) * claimPercentage;

        IERC20 rewardToken = IERC20(rewardAddress);

        uint256 contractBalance = rewardToken.balanceOf(address(this));

        if ((claimAmount * 2) >= contractBalance) {
            uint256 _claimAmount = (contractBalance / 1000) * claimPercentage;
            rewardToken.transfer(claimer, _claimAmount);
            emit AirdropReleased(rewardAddress, claimer, _claimAmount);
        } else {
            rewardToken.transfer(claimer, claimAmount);
            emit AirdropReleased(rewardAddress, claimer, claimAmount);
        }
    }
}