// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SlotGame {
    // ========== SYMBOLS ==========
    uint8 constant CHERRY = 0;
    uint8 constant LEMON = 1;
    uint8 constant ORANGE = 2;
    uint8 constant LEAF = 3;
    uint8 constant GRAPE = 4;
    uint8 constant BELL = 5;
    uint8 constant CROWN = 6;
    uint8 constant DIAMOND = 7;
    uint8 constant SEVEN = 8;

    // ========== PAYOUT MULTIPLIERS ==========
    uint256 constant TRIPLE_SEVEN = 1_000;
    uint256 constant TRIPLE_DIAMOND = 500;
    uint256 constant TRIPLE_CROWN = 200;
    uint256 constant TRIPLE_BELL = 100;
    uint256 constant TRIPLE_GRAPE = 50;
    uint256 constant TRIPLE_LEAF = 25;
    uint256 constant TRIPLE_ORANGE = 10;
    uint256 constant TRIPLE_LEMON = 5;
    uint256 constant TRIPLE_CHERRY = 2;

    // NOTE: Double match multipliers are fractions of the bet. e.g., 50 = 0.5x payout.
    uint256 constant DOUBLE_SEVEN = 100;    // 1.0x
    uint256 constant DOUBLE_DIAMOND = 50;     // 0.5x
    uint256 constant DOUBLE_CROWN = 40;     // 0.4x
    uint256 constant DOUBLE_BELL = 30;      // 0.3x
    uint256 constant DOUBLE_GRAPE = 20;     // 0.2x
    uint256 constant DOUBLE_LEAF = 10;      // 0.1x
    uint256 constant DOUBLE_ORANGE = 5;       // 0.05x
    uint256 constant DOUBLE_LEMON = 4;      // 0.04x
    uint256 constant DOUBLE_CHERRY = 2;     // 0.02x

    // ========== GAME CONSTANTS ==========
    uint256 public constant MIN_BET = 100_000 wei;
    uint256 public constant MAX_BET = 10 ether;

    // ========== HOUSE EDGE ==========
    uint256 public constant HOUSE_EDGE = 50; // 5% (50/1000)
    uint256 public constant HOUSE_EDGE_DIVISOR = 1000;

    // ========== STRUCTS ==========

    struct ActiveSpin {
        address player;
        uint256 betAmount;
        uint256 timestamp;
        uint8 reel1;
        uint8 reel2;
        uint8 reel3;
        bool isProcessed;
    }

    struct PendingReward {
        uint256 amount;
        uint256 spinId;
        uint256 timestamp;
        uint8 reel1;
        uint8 reel2;
        uint8 reel3;
        uint256 multiplier;
        bool isJackpot;
    }

    struct PlayerStats {
        uint256 totalSpins;
        uint256 totalWagered;
        uint256 totalWon;
        uint256 biggestWin;
        uint256 lastPlayTime;
    }

    // ========== STORAGE ==========

    address public owner;
    bool public isActive;
    uint256 public totalSpins;
    uint256 public totalWagered;
    uint256 public totalPayouts;
    uint256 public jackpotHits;
    uint256 public nextSpinId = 1;
    uint256 private seedNonce;

    mapping(address => PlayerStats) public playerStats;
    mapping(uint256 => ActiveSpin) private activeSpins; // spinId => ActiveSpin
    mapping(address => PendingReward[]) public pendingRewards; // player => rewards

    // Anti-bot protection
    mapping(address => uint256) public lastSpinTime;
    uint256 public constant MIN_SPIN_INTERVAL = 1 seconds;

    // ========== EVENTS ==========
    event SpinStarted(address indexed player, uint256 spinId, uint256 betAmount, uint256 timestamp);
    event SpinResult(address indexed player, uint256 spinId, uint8 reel1, uint8 reel2, uint8 reel3, uint256 timestamp);
    event PayoutCalculated(address indexed player, uint256 spinId, uint256 betAmount, uint8 reel1, uint8 reel2, uint8 reel3, uint256 payout, uint256 multiplier, bool isJackpot, string winType, uint256 timestamp);
    event RewardClaimed(address indexed player, uint256 spinId, uint256 amount, uint256 timestamp);
    event CasinoFunded(uint256 amount, uint256 newBalance);

    // ========== MODIFIERS ==========
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyActive() {
        require(isActive, "Game is not active");
        _;
    }

    modifier antiBot() {
        require(block.timestamp - lastSpinTime[msg.sender] >= MIN_SPIN_INTERVAL, "Spin too soon");
        lastSpinTime[msg.sender] = block.timestamp;
        _;
    }

    constructor() {
        owner = msg.sender;
        isActive = true;
    }

    // ========== FUND CASINO ==========
    receive() external payable {
        emit CasinoFunded(msg.value, address(this).balance);
    }

    function fundCasino() external payable {
        emit CasinoFunded(msg.value, address(this).balance);
    }

    // ========== MAIN GAME LOGIC ==========

    function spinAndProcess() external payable onlyActive antiBot {
        uint256 betAmount = msg.value;
        require(betAmount >= MIN_BET && betAmount <= MAX_BET, "Invalid bet amount");

        // Generate spin result using insecure on-chain randomness
        (uint8 r1, uint8 r2, uint8 r3) = _generateSpinResult();

        uint256 spinId = nextSpinId++;

        // Emit events for front-end to react
        emit SpinStarted(msg.sender, spinId, betAmount, block.timestamp * 1000);
        emit SpinResult(msg.sender, spinId, r1, r2, r3, block.timestamp * 1000);

        // Calculate payout
        (uint256 rawPayout, uint256 multiplier, bool isJackpot, string memory winType) = calculateDetailedPayout(
            r1, r2, r3, betAmount
        );

        // Apply house edge
        uint256 payout = rawPayout * (HOUSE_EDGE_DIVISOR - HOUSE_EDGE) / HOUSE_EDGE_DIVISOR;

        if (payout > 0) {
            pendingRewards[msg.sender].push(PendingReward({
                amount: payout,
                spinId: spinId,
                timestamp: block.timestamp * 1000,
                reel1: r1,
                reel2: r2,
                reel3: r3,
                multiplier: multiplier,
                isJackpot: isJackpot
            }));
            if (isJackpot) {
                jackpotHits += 1;
            }
        }

        // Update player and casino stats
        totalSpins += 1;
        totalWagered += betAmount;
        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalSpins += 1;
        stats.totalWagered += msg.value;
        stats.lastPlayTime = block.timestamp;
        if (payout > 0) {
            stats.totalWon += payout;
            if (payout > stats.biggestWin) {
                stats.biggestWin = payout;
            }
        }

        emit PayoutCalculated(
            msg.sender,
            spinId,
            betAmount,
            r1, r2, r3,
            payout, multiplier, isJackpot, winType, block.timestamp * 1000
        );
    }

    // ========== REWARD CLAIMING ==========

    /**
     * @notice Claims a single pending reward by its index in the pendingRewards array.
     * @dev This is a gas-efficient way to claim a single reward. The index can be obtained from the getPendingRewards view function.
     * @param rewardIndex The index of the reward to claim in the player's pendingRewards array.
     */
    function claimReward(uint256 rewardIndex) external {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        require(rewardIndex < rewards.length, "Invalid reward index");

        PendingReward memory rewardToClaim = rewards[rewardIndex];
        uint256 amount = rewardToClaim.amount;

        require(address(this).balance >= amount, "Insufficient contract balance");
        require(amount > 0, "Invalid reward amount");

        // Remove reward by swapping with the last element and popping
        rewards[rewardIndex] = rewards[rewards.length - 1];
        rewards.pop();

        payable(msg.sender).transfer(amount);
        totalPayouts += amount;

        emit RewardClaimed(msg.sender, rewardToClaim.spinId, amount, block.timestamp * 1000);
    }

    /**
     * @notice Claims all available rewards for the player.
     * @dev WARNING: This function can fail if the player has a very large number of pending rewards,
     * as the transaction could exceed the block gas limit.
     */
    function claimAllRewards() external {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        uint256 totalAmount = 0;
        uint256 currentTime = block.timestamp * 1000;

        for (uint256 i = 0; i < rewards.length; i++) {
            totalAmount += rewards[i].amount;
            emit RewardClaimed(msg.sender, rewards[i].spinId, rewards[i].amount, currentTime);
        }
        
        require(totalAmount > 0, "No rewards to claim");
        require(address(this).balance >= totalAmount, "Insufficient contract balance");

        delete pendingRewards[msg.sender];
        totalPayouts += totalAmount;
        payable(msg.sender).transfer(totalAmount);
    }

    // ========== ADMIN ==========
    function withdrawCasinoFunds(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        payable(owner).transfer(amount);
    }

    function toggleCasinoStatus() external onlyOwner {
        isActive = !isActive;
    }

    function transferCasinoOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function emergencyShutdown() external onlyOwner {
        isActive = false;
    }

    // ========== VIEW ==========

    function getPendingRewards(address player) external view returns (PendingReward[] memory) {
        return pendingRewards[player];
    }

    function getTotalPendingAmount(address player) external view returns (uint256 total) {
        PendingReward[] memory rewards = pendingRewards[player];
        for (uint256 i = 0; i < rewards.length; i++) {
            total += rewards[i].amount;
        }
    }

    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function getCasinoStats() external view returns (
        uint256 balance,
        uint256 spins,
        uint256 wagered,
        uint256 payouts,
        uint256 jackpots,
        bool active
    ) {
        return (address(this).balance, totalSpins, totalWagered, totalPayouts, jackpotHits, isActive);
    }

    function getBetLimits() external pure returns (uint256, uint256) {
        return (MIN_BET, MAX_BET);
    }

    function getPayoutTable() external pure returns (uint256[] memory) {
        uint256[] memory arr = new uint256[](9);
        arr[0] = TRIPLE_SEVEN;
        arr[1] = TRIPLE_DIAMOND;
        arr[2] = TRIPLE_CROWN;
        arr[3] = TRIPLE_BELL;
        arr[4] = TRIPLE_GRAPE;
        arr[5] = TRIPLE_LEAF;
        arr[6] = TRIPLE_ORANGE;
        arr[7] = TRIPLE_LEMON;
        arr[8] = TRIPLE_CHERRY;
        return arr;
    }

    function getSymbolName(uint8 symbol) public pure returns (string memory) {
        if (symbol == CHERRY) return "CHERRY";
        if (symbol == LEMON) return "LEMON";
        if (symbol == ORANGE) return "ORANGE";
        if (symbol == GRAPE) return "GRAPE";
        if (symbol == DIAMOND) return "DIAMOND";
        if (symbol == SEVEN) return "SEVEN";
        if (symbol == BELL) return "BELL";
        if (symbol == LEAF) return "LEAF";
        if (symbol == CROWN) return "CROWN";
        return "UNKNOWN";
    }

    // ========== INTERNAL RANDOMNESS & PAYOUT ==========

    /**
     * @dev Generates a pseudo-random spin result.
     * WARNING: This method of randomness is INSECURE and for testing purposes only.
     * It is vulnerable to manipulation by miners.
     * For a production environment, use a verifiable randomness solution like Chainlink VRF.
     */
    function _generateSpinResult() internal returns (uint8, uint8, uint8) {
        seedNonce++;
        bytes32 seed = keccak256(abi.encodePacked(
            blockhash(block.number - 1),
            block.timestamp,
            block.prevrandao,
            msg.sender,
            tx.origin,
            seedNonce
        ));
        
        return (
            _generateSymbol(keccak256(abi.encodePacked(seed, "r1"))),
            _generateSymbol(keccak256(abi.encodePacked(seed, "r2"))),
            _generateSymbol(keccak256(abi.encodePacked(seed, "r3")))
        );
    }

    function _generateSymbol(bytes32 seed) internal pure returns (uint8) {
        uint16 roll = uint16(uint256(seed) % 1000);

        if (roll < 5) return SEVEN;             // 0.5%
        if (roll < 15) return DIAMOND;     // 1.0%
        if (roll < 35) return CROWN;       // 2.0%
        if (roll < 85) return BELL;        // 5.0%
        if (roll < 268) return GRAPE;       // 18.3%
        if (roll < 451) return LEAF;      // 18.3%
        if (roll < 634) return ORANGE;     // 18.3%
        if (roll < 817) return LEMON;      // 18.3%
        return CHERRY;                     // 18.3%
    }

    // ========== PAYOUT CALCULATION ==========
    function isTripleMatch(uint8 r1, uint8 r2, uint8 r3) public pure returns (bool) {
        return r1 == r2 && r2 == r3;
    }

    function isDoubleMatch(uint8 r1, uint8 r2, uint8 r3) public pure returns (bool, uint8) {
        if (r1 == r2 && r1 != r3) return (true, r1);
        if (r1 == r3 && r1 != r2) return (true, r1);
        if (r2 == r3 && r2 != r1) return (true, r2);
        return (false, 0);
    }

    function containsSymbol(uint8 r1, uint8 r2, uint8 r3, uint8 target) public pure returns (bool) {
        return r1 == target || r2 == target || r3 == target;
    }

    function getTripleMultiplier(uint8 symbol) public pure returns (uint256) {
        if (symbol == SEVEN) return TRIPLE_SEVEN;
        if (symbol == DIAMOND) return TRIPLE_DIAMOND;
        if (symbol == CROWN) return TRIPLE_CROWN;
        if (symbol == BELL) return TRIPLE_BELL;
        if (symbol == GRAPE) return TRIPLE_GRAPE;
        if (symbol == LEAF) return TRIPLE_LEAF;
        if (symbol == ORANGE) return TRIPLE_ORANGE;
        if (symbol == LEMON) return TRIPLE_LEMON;
        if (symbol == CHERRY) return TRIPLE_CHERRY;
        return 0;
    }

    function getDoubleMultiplier(uint8 symbol) public pure returns (uint256) {
        if (symbol == SEVEN) return DOUBLE_SEVEN;
        if (symbol == DIAMOND) return DOUBLE_DIAMOND;
        if (symbol == CROWN) return DOUBLE_CROWN;
        if (symbol == BELL) return DOUBLE_BELL;
        if (symbol == GRAPE) return DOUBLE_GRAPE;
        if (symbol == LEAF) return DOUBLE_LEAF;
        if (symbol == ORANGE) return DOUBLE_ORANGE;
        if (symbol == LEMON) return DOUBLE_LEMON;
        if (symbol == CHERRY) return DOUBLE_CHERRY;
        return 0;
    }

    function isJackpotWin(uint8 r1, uint8 r2, uint8 r3) public pure returns (bool) {
        return r1 == SEVEN && r2 == SEVEN && r3 == SEVEN;
    }

    function calculatePayout(uint8 r1, uint8 r2, uint8 r3, uint256 bet) public pure returns (uint256 payout, uint256 multiplier, bool jackpot) {
        jackpot = isJackpotWin(r1, r2, r3);

        if (isTripleMatch(r1, r2, r3)) {
            multiplier = getTripleMultiplier(r1);
            payout = bet * multiplier;
        } else {
            (bool hasDouble, uint8 doubleSymbol) = isDoubleMatch(r1, r2, r3);
            if (hasDouble) {
                multiplier = getDoubleMultiplier(doubleSymbol);
                // Multiplier is a percentage, e.g., 50 means 0.5x payout
                payout = bet * multiplier / 100;
            }
        }
    }

    function calculateDetailedPayout(uint8 r1, uint8 r2, uint8 r3, uint256 bet) public pure returns (uint256 payout, uint256 multiplier, bool jackpot, string memory winType) {
        (payout, multiplier, jackpot) = calculatePayout(r1, r2, r3, bet);
        
        if (jackpot) {
            winType = "MEGA JACKPOT!";
        } else if (multiplier > 0) {
            if (isTripleMatch(r1, r2, r3)) {
                winType = "TRIPLE MATCH";
            } else {
                winType = "DOUBLE MATCH";
            }
        } else {
            winType = "NO WIN";
        }
    }
}