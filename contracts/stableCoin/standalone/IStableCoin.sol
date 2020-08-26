// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @title Interface for the "uSD" AKA "uniswap State Dollar", Unifi stablecoin.
 * @dev Define the interface for the usD
 */
interface IStableCoin {
    /**
     * Initialize the StableCoin.
     * @dev Constructor signature
     * @param name name of the StableCoin ERC20 token
     * @param symbol ticker for the StableCoin ERC20 token
     * @param doubleProxy address for the DoubleProxy
     * @param allowedPairs array of Uniswap Pairs to be set as whitelisted source tokens
     * @param rebalanceRewardMultiplier multiplier used to compute how many unifi tokens to mint during uSD rebalance
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
     * @return The amount of available mintable token
     */
    function availableToMint() external view returns (uint256);

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
     * @dev // DOCUMENT
     *
     * =====
     *
     * @param burnt amount of of uSD burnt
     */
    function calculateRebalanceByDebtReward(uint256 burnt) external view returns (uint256);

    /**
     * @dev Convert from one of the allowed whitelisted tokens to uSD
     *
     * =====
     *
     * @param tokenAddress Address of the token to convert
     * @param amount Amount of Unifi token to be converted
     *
     * =====
     *
     * @return Amount of uSD tokens
     */
    function fromTokenToStable(address tokenAddress, uint256 amount)
        external
        view
        returns (uint256);

    /**
     * Mint logic of the StableCoin.
     * @dev Mint the uSD token
     *
     * =====
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
     * =====
     *
     * @return Amount of freshly minted uSD token
     */
    function mint(
        uint256 pairIndex,
        uint256 amountA,
        uint256 amountB,
        uint256 amountAMin,
        uint256 amountBMin
    ) external returns (uint256);

    /**
     * Mint logic of the StableCoin.
     * @dev Mint the uSD token
     *
     * =====
     *
     * @param pairIndex Index of the pair inside the allowedPairs array
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert
     *
     * =====
     *
     * @return amountA The amount of tokenA received
     * @return amountB The amount of tokenB received
     *
     */
    function burn(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amountAMin,
        uint256 amountBMin
    ) external returns (uint256 amountA, uint256 amountB);

    /**
     * @dev Rebalance by Credit is triggered when the total amount of source tokens is greater
     * than uSD circulating supply. Rebalancing is done by withdrawing the excess from the pool.
     *
     * =====
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
     * @dev // DOCUMENT
     */
    function rebalanceByDebt(uint256 amount) external returns (uint256);
}

// -----------------------------------------------------------------------------------------------|

// DOCUMENT
interface IDoubleProxy {
    function proxy() external view returns (address);
}

// -----------------------------------------------------------------------------------------------|

// DOCUMENT
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

// -----------------------------------------------------------------------------------------------|

// DOCUMENT
interface IMVDFunctionalitiesManager {
    function isAuthorizedFunctionality(address functionality) external view returns (bool);
}

// -----------------------------------------------------------------------------------------------|

// DOCUMENT
interface IStateHolder {
    function getBool(string calldata varName) external view returns (bool);

    function getUint256(string calldata varName) external view returns (uint256);
}

// -----------------------------------------------------------------------------------------------|

/**
 * @title Uniswap V2 Router
 * @dev Route liquidity back and forth an Uniswap Liquidity Pool.
 * For more information see: https://uniswap.org/docs/v2/smart-contracts/router02/
 *
 */
interface IUniswapV2Router {
    /**
     * https://uniswap.org/docs/v2/smart-contracts/library#getamountsout
     * Given an input asset amount and an array of token addresses, calculates all subsequent maximum
     * output token amounts by calling getReserves for each pair of token addresses in the path in
     * turn, and using these to call getAmountOut. Useful for calculating optimal token amounts
     * before calling swap.
     */
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    /**
     * @dev Removes liquidity from an ERC-20⇄ERC-20 pool
     *
     * https://uniswap.org/docs/v2/smart-contracts/router02/#addliquidity
     *
     * =====
     *
     * @param tokenA A pool token
     * @param tokenB A pool token
     * @param liquidity The amount of liquidity tokens to remove
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert
     * @param to Recipient of the underlying assets
     * @param deadline Unix timestamp after which the transaction will revert
     *
     * =====
     *
     * @return amountA The amount of tokenA received
     * @return amountB The amount of tokenB received
     *
     */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    /**
     * @dev Add Liquidity to an ERC-20⇄ERC-20 pool
     *
     * - To cover all possible scenarios, msg.sender should have already given the router an allowance
     *   of at least amountADesired/amountBDesired on tokenA/tokenB.
     * - Always adds assets at the ideal ratio, according to the price when the transaction is executed.
     * - If a pool for the passed tokens does not exists, one is created automatically, and exactly
     *   amountADesired/amountBDesired tokens are added.
     *
     * https://uniswap.org/docs/v2/smart-contracts/router02/#addliquidity
     *
     * =====
     *
     * @param tokenA A pool token
     * @param tokenB A pool token
     * @param liquidity The amount of liquidity tokens to remove
     * @param amountADesired The amount of tokenA to add as liquidity if the B/A price is <=
     *  amountBDesired/amountADesired (A depreciates).
     * @param amountBDesired The amount of tokenB to add as liquidity if the A/B price is <=
     *  amountADesired/amountBDesired (B depreciates).
     * @param amountAMin Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.
     * @param amountBMin Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired.
     * @param to Recipient of the underlying assets
     * @param deadline Unix timestamp after which the transaction will revert
     *
     * =====
     *
     * @return amountA The amount of tokenA sent to the pool
     * @return amountB The amount of tokenB sent to the pool
     * @return liquidity The amount of liquidity tokens minted
     *
     */
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

// -----------------------------------------------------------------------------------------------|

// DOCUMENT
/**
 * @title Uniswap V2 Pair
 */
interface IUniswapV2Pair {
    // DOCUMENT
    function decimals() external pure returns (uint8);

    // DOCUMENT
    function totalSupply() external view returns (uint256);

    // DOCUMENT
    function token0() external view returns (address);

    // DOCUMENT
    function token1() external view returns (address);

    // DOCUMENT
    function balanceOf(address account) external view returns (uint256);

    // DOCUMENT
    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );
}
