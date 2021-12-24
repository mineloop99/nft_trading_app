// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Staking is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    // Info of each user.
    struct UserInfo {
        uint256[] nftStaked;
        uint256 startTime; // Last time Staked to calculate apr
        uint256 rewardHasBeenWithdrawn; // Reward debt.
    }

    // Info of each pool.
    struct StakingInfo {
        IERC20 rewardToken; // Address of LP token contract.
        IERC721 nftContract;
        uint256 usdPerNftRate;
        uint256 apr; // Rate of token per year apr/1000
        uint256 startTime;
    }

    // Bonus muliplier for early Nft makers.
    uint256 public BONUS_MULTIPLIER = 1;

    // Info of each pool.
    StakingInfo public stakingInfo;
    // Info of each user that stakes LP tokens.
    mapping(address => UserInfo) public userInfo;

    event EnterStaking(address indexed user, uint256 nftId);
    event LeaveStaking(address indexed user, uint256 nftId);
    event ClaimReward(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 nftId);

    constructor(
        address _rewardToken,
        address _nftContract,
        uint256 _apr, // APR rate is 1/1000
        uint256 _usdPerNftRate
    ) {
        // staking pool
        stakingInfo = StakingInfo({
            rewardToken: IERC20(_rewardToken),
            apr: _apr,
            usdPerNftRate: _usdPerNftRate,
            nftContract: IERC721(_nftContract),
            startTime: getCurrentTime()
        });
    }

    function updateMultiplier(uint256 multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = multiplierNumber;
    }

    // Update the given pool's Nft apr. Can only be called by the owner.
    function setapr(uint256 _apr) public onlyOwner {
        stakingInfo.apr = _apr;
    }

    // Stake Nft tokens to NftPool
    function enterStaking(uint256 _nftId) public nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        stakingInfo.nftContract.transferFrom(
            address(msg.sender),
            address(this),
            _nftId
        );
        user.nftStaked.push(_nftId);
        if (user.startTime == 0) {
            user.startTime = getCurrentTime();
        }

        emit EnterStaking(msg.sender, _nftId);
    }

    // Withdraw All Nft tokens from STAKING.
    function leaveStaking() public whenNotPaused {
        UserInfo storage user = userInfo[msg.sender];
        require(user.nftStaked.length > 0, "Staking: No token was staked!");
        for (
            uint256 nftIndex = 0;
            nftIndex < user.nftStaked.length;
            nftIndex++
        ) {
            stakingInfo.nftContract.transferFrom(
                address(this),
                msg.sender,
                user.nftStaked[nftIndex]
            );
        }
        uint256[] memory _temp;
        user.nftStaked = _temp;
        uint256 amount = claimReward();
        emit LeaveStaking(msg.sender, amount);
    }

    // ClaimAllReward
    function claimReward() public whenNotPaused nonReentrant returns (uint256) {
        UserInfo storage user = userInfo[msg.sender];

        uint256 amount = calculateRewardDebt(
            user.startTime,
            getCurrentTime(),
            user.nftStaked.length * stakingInfo.usdPerNftRate,
            user.rewardHasBeenWithdrawn
        );
        stakingInfo.rewardToken.safeTransfer(msg.sender, amount);
        if (amount == 0) {
            return 0;
        }
        user.rewardHasBeenWithdrawn += amount;
        emit ClaimReward(msg.sender, amount);
        return amount;
    }

    // Get time by current Time
    function calculateRewardDebt(
        uint256 _from,
        uint256 _to,
        uint256 _userAmount,
        uint256 _userHasBeenWithdrawn
    ) public view returns (uint256) {
        uint256 multiplier = (_to - _from) * BONUS_MULTIPLIER;
        uint256 numberOfDays = multiplier / 86400; // 1 Day = 86400 seconds
        uint256 aprPerDay = (stakingInfo.apr * 1000) / 365;
        return
            (_userAmount * numberOfDays * aprPerDay) /
            (1000 * 1000) -
            _userHasBeenWithdrawn;
    }

    // Safe Nft transfer function, just in case if rounding error causes pool to not have enough CAKEs.
    function safeNftTransfer(address _to, uint256 _amount) public onlyOwner {
        uint256 NftBal = stakingInfo.rewardToken.balanceOf(address(this));
        if (_amount > NftBal) {
            stakingInfo.rewardToken.transfer(_to, NftBal);
        } else {
            stakingInfo.rewardToken.transfer(_to, _amount);
        }
    }

    function getUserReward(address _userAddress) public view returns (uint256) {
        UserInfo memory user = userInfo[_userAddress];
        uint256 amount = calculateRewardDebt(
            user.startTime,
            getCurrentTime(),
            user.nftStaked.length * stakingInfo.usdPerNftRate,
            user.rewardHasBeenWithdrawn
        );
        return amount;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
