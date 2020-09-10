// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
import "./IERC20.sol";

/**
 * @title Interface for the $uSD aka unified Stable Dollar.
 * @dev Define the interface for the $usD
 *
 * The core idea behind Unified Stable Coin is to implement a stable coin collateralized by pools of whitelisted
 * stable coins on UniSwap. By hedging across several pools and implementing simple yet effective
 * rebalancing schemes, $uSD is able reduce an holder exposure to a stable-coin failure.
 *
 */
interface IStableCoin is IERC20 {
    /**
     * Initialize the StableCoin.
     * @dev Constructor signature
     * @param name name of the StableCoin ERC20 token
     * @param symbol ticker for the StableCoin ERC20 token
     * @param doubleProxy address for the DoubleProxy
     * @param allowedPairs array of Uniswap Pairs to be set as whitelisted source tokens
     * @param rebalanceRewardMultiplier multiplier used to compute how many unifi tokens to mint during $uSD rebalance
     * @param timeWindows time windows inside which some time-delimited operations can be performed
     * @param mintables max amount of mintables inside a timeWindow
     */
    function init(
        string calldata name,
        string calldata symbol,
        address doubleProxy,
        address[] calldata allowedPairs,
        uint256[] calldata rebalanceRewardMultiplier,
        uint256[] calldata timeWindows,
        uint256[] calldata mintables
    ) external;

    // |------------------------------------------------------------------------------------------|
    // | ----- GETTERS ----- |
    // |------------------------------------------------------------------------------------------|

    /**
     * @return Array of allowed Uniswap pairs
     */
    function allowedPairs() external view returns (address[] memory);

    /**
     * @return mintable The amount of available mintable token
     */
    function availableToMint() external view returns (uint256 mintable);

    // DOCUMENT
    function differences() external view returns (uint256, uint256);

    /**
     * @return The address for the doubleProxy smart contract
     */
    function doubleProxy() external view returns (address);

    /**
     * @return The multiplier used to compute the rebalancing rewards
     */
    function rebalanceRewardMultiplier() external view returns (uint256[] memory);

    /**
     * @return All tiers of data of the carried context
     */
    function tierData() external view returns (uint256[] memory, uint256[] memory);

    // |------------------------------------------------------------------------------------------|
    // | ----- SETTERS ----- |
    // |------------------------------------------------------------------------------------------|

    /**
     * @param newAllowedPairs list of Uniswap pairs to be whitelisted
     */
    function setAllowedPairs(address[] calldata newAllowedPairs) external;

    /**
     * @param newDoubleProxy new DoubleProxy to set
     */
    function setDoubleProxy(address newDoubleProxy) external;

    // |------------------------------------------------------------------------------------------|
    // | ----- CORE FUNCTIONS ----- |
    // |------------------------------------------------------------------------------------------|

    /**
     * @dev Compute the reward of the rebalanceByDebt() operation.
     *
     * @param burnt amount of of $uSD burnt
     */
    function calculateRebalanceByDebtReward(uint256 burnt) external view returns (uint256 reward);

    /**
     * @dev Convert from one of the allowed whitelisted tokens to $uSD
     *
     * @param tokenAddress Address of the token to convert
     * @param amount Amount of Unifi token to be converted
     *
     * @return Amount of $uSD tokens
     */
    function fromTokenToStable(address tokenAddress, uint256 amount)
        external
        view
        returns (uint256);

    /**
     * Mint logic of the StableCoin.
     * @dev Mint the $uSD token
     *
     * @param pairIndex Index of the pair inside the allowedPairs array
     * @param amountA The amount of tokenA to add as liquidity if the B/A price is <=
     *  amountBDesired/amountADesired (A depreciates)
     * @param amountB The amount of tokenB to add as liquidity if the A/B price is <=
     *  amountADesired/amountBDesired (B depreciates)
     * @param amountAMin Bounds the extent to which the B/A price can go up before the transaction reverts.
     *  Must be <= amountADesired
     * @param amountBMin Bounds the extent to which the A/B price can go up before the transaction reverts.
     *  Must be <= amountBDesired
     *
     * @return minted Amount of freshly minted $uSD token
     */
    function mint(
        uint256 pairIndex,
        uint256 amountA,
        uint256 amountB,
        uint256 amountAMin,
        uint256 amountBMin
    ) external returns (uint256 minted);

    /**
     * Burn logic of the StableCoin.
     * @dev Burn the $uSD token
     *
     * @param pairIndex Index of the pair inside the allowedPairs array
     * @param pairAmount Amount of Uniswap liquidity tokens to send back to the pool
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert
     *
     * @return removedA The amount of tokenA received
     * @return removedB The amount of tokenB received
     *
     */
    function burn(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amountAMin,
        uint256 amountBMin
    ) external returns (uint256 removedA, uint256 removedB);

    /**
     * @dev Rebalance by Credit is triggered when the total amount of source tokens' is greater
     * than $uSD circulating supply. Rebalancing is done by withdrawing the excess from the pool.
     *
     * @notice Positive imbalances can be caused by the accrual of liquidity provider fee. Withdrawn tokens
     * are stored inside the Unifi DFO as a source of long-term value
     */
    function rebalanceByCredit(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amountA,
        uint256 amountB
    ) external returns (uint256 redeemed);

    /**
     * @dev Rebalance by Debt is triggered when the total amount of source tokens' is lesser
     * than $uSD circulating supply. Rebalancing is done by minting new equity ($unifi) at premium
     * in exchange for burning $uSD.
     *
     * @notice Negative imbalances can be caused by the failure of a Stable Coin in one of the whitelisted
     * source pairs.
     */
    function rebalanceByDebt(uint256 amount) external returns (uint256);
}

interface IDoubleProxy {
    function proxy() external view returns (address);
}

interface IMVDProxy {
    function getToken() external view returns (address);

    function getMVDFunctionalitiesManagerAddress() external view returns (address);

    function getMVDWalletAddress() external view returns (address);

    function getStateHolderAddress() external view returns (address);

    function submit(string calldata codeName, bytes calldata data)
        external
        payable
        returns (bytes memory returnData);
}

interface IMVDFunctionalitiesManager {
    function isAuthorizedFunctionality(address functionality) external view returns (bool);
}

interface IStateHolder {
    function getBool(string calldata varName) external view returns (bool);

    function getUint256(string calldata varName) external view returns (uint256);
}

interface IUniswapV2Router02 {
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );
}

interface IUniswapV2Pair {
    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint256);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function balanceOf(address account) external view returns (uint256);

    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );
}
