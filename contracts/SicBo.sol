// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SicBo {
    // ========== EVENTS ==========

    event BetPlaced(
        address indexed player,
        uint256 indexed betId,
        BetType betType,
        uint256 amount,
        uint256 timestamp
    );
    event DiceRolled(
        uint256 indexed betId,
        uint8 die1,
        uint8 die2,
        uint8 die3
    );
    event BetSettled(
        address indexed player,
        uint256 indexed betId,
        uint8 die1,
        uint8 die2,
        uint8 die3,
        uint8 totalSum,
        bool isTriple,
        uint256 payout,
        uint256 timestamp
    );
    event RewardClaimed(
        address indexed player,
        uint256 betId,
        uint256 amount,
        uint256 timestamp
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event CasinoFunded(
        address indexed funder,
        uint256 amount,
        uint256 newBalance
    );

    // ========== GAME CONFIG ==========

    enum BetType {
        Small, // Sum of 4-10
        Big // Sum of 11-17
    }

    struct PendingReward {
        uint256 amount;
        uint256 betId;
        uint256 timestamp;
        uint8 die1;
        uint8 die2;
        uint8 die3;
        uint8 totalSum;
        BetType betType;
    }

    uint256 public minBet;
    uint256 public maxBet;
    bool public isGameActive;
    address public owner;

    uint256 public totalBets;
    uint256 public totalPayouts;
    uint256 private betIdCounter;
    uint256 private seedNonce;

    mapping(address => PendingReward[]) public pendingRewards;

    // ========== MODIFIERS ==========

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier gameActive() {
        require(isGameActive, "Game is not active");
        _;
    }

    // ========== CONSTRUCTOR ==========

    constructor() {
        owner = msg.sender;
        isGameActive = true;
        minBet = 0.01 ether;
        maxBet = 1 ether;
    }

    // ========== ADMIN FUNCTIONS ==========

    function toggleGameActive() external onlyOwner {
        isGameActive = !isGameActive;
    }

    function setBetLimits(uint256 _minBet, uint256 _maxBet) external onlyOwner {
        require(_minBet > 0 && _minBet < _maxBet, "Invalid bet limits");
        minBet = _minBet;
        maxBet = _maxBet;
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }

    // ========== FUNDING ==========

    function fundCasino() external payable {
        emit CasinoFunded(msg.sender, msg.value, address(this).balance);
    }

    receive() external payable {
        emit CasinoFunded(msg.sender, msg.value, address(this).balance);
    }

    // ========== CORE GAME LOGIC ==========

    function placeBetAndRoll(BetType betType) external payable gameActive {
        uint256 betAmount = msg.value;
        require(
            betAmount >= minBet && betAmount <= maxBet,
            "Bet amount is outside of the allowed limits"
        );

        uint256 currentBetId = ++betIdCounter;
        totalBets++;

        emit BetPlaced(
            msg.sender,
            currentBetId,
            betType,
            betAmount,
            block.timestamp
        );

        (uint8 die1, uint8 die2, uint8 die3) = _rollDice();
        uint8 totalSum = die1 + die2 + die3;

        emit DiceRolled(currentBetId, die1, die2, die3);

        bool isTriple = (die1 == die2) && (die2 == die3);

        bool playerWins = false;
        if (!isTriple) {
            if (betType == BetType.Small && totalSum >= 4 && totalSum <= 10) {
                playerWins = true;
            } else if (betType == BetType.Big && totalSum >= 11 && totalSum <= 17) {
                playerWins = true;
            }
        }

        uint256 payout = 0;
        if (playerWins) {
            payout = betAmount * 2; // 1:1 payout
            pendingRewards[msg.sender].push(
                PendingReward({
                    amount: payout,
                    betId: currentBetId,
                    timestamp: block.timestamp,
                    die1: die1,
                    die2: die2,
                    die3: die3,
                    totalSum: totalSum,
                    betType: betType
                })
            );
        }

        emit BetSettled(
            msg.sender,
            currentBetId,
            die1,
            die2,
            die3,
            totalSum,
            isTriple,
            payout,
            block.timestamp
        );
    }

    // ========== REWARD CLAIMING ==========

    function claimReward(uint256 rewardIndex) external {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        require(rewardIndex < rewards.length, "Invalid reward index");

        PendingReward memory rewardToClaim = rewards[rewardIndex];
        uint256 amount = rewardToClaim.amount;

        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        require(amount > 0, "Invalid reward amount");

        rewards[rewardIndex] = rewards[rewards.length - 1];
        rewards.pop();

        payable(msg.sender).transfer(amount);
        totalPayouts += amount;

        emit RewardClaimed(
            msg.sender,
            rewardToClaim.betId,
            amount,
            block.timestamp
        );
    }

    function claimAllRewards() external {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < rewards.length; i++) {
            totalAmount += rewards[i].amount;
        }

        require(totalAmount > 0, "No rewards to claim");
        require(
            address(this).balance >= totalAmount,
            "Insufficient contract balance"
        );

        // Emit events before deleting
        for (uint256 i = 0; i < rewards.length; i++) {
            emit RewardClaimed(
                msg.sender,
                rewards[i].betId,
                rewards[i].amount,
                block.timestamp
            );
        }

        delete pendingRewards[msg.sender];
        totalPayouts += totalAmount;
        payable(msg.sender).transfer(totalAmount);
    }

    // ========== VIEW FUNCTIONS ==========

    function getGameConfig() external view returns (uint256, uint256, bool) {
        return (minBet, maxBet, isGameActive);
    }

    function getPendingRewards(
        address player
    ) external view returns (PendingReward[] memory) {
        return pendingRewards[player];
    }

    function getTotalPendingAmount(
        address player
    ) external view returns (uint256 total) {
        PendingReward[] memory rewards = pendingRewards[player];
        for (uint256 i = 0; i < rewards.length; i++) {
            total += rewards[i].amount;
        }
    }

    // ========== INTERNAL FUNCTIONS ==========

    function _rollDice() private returns (uint8, uint8, uint8) {
        seedNonce++;
        bytes32 seed = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                msg.sender,
                seedNonce
            )
        );

        uint8 die1 = (uint8(uint256(keccak256(abi.encodePacked(seed, "d1"))) % 6)) +
            1;
        uint8 die2 = (uint8(uint256(keccak256(abi.encodePacked(seed, "d2"))) % 6)) +
            1;
        uint8 die3 = (uint8(uint256(keccak256(abi.encodePacked(seed, "d3"))) % 6)) +
            1;

        return (die1, die2, die3);
    }
}
