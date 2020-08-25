// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

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

    // |--------------------------------------------------------------------------------|
    // | ----- GETTTERS -----
    // |--------------------------------------------------------------------------------|

    /**
     * @return All tiers of data of the carried context
     */
    function tierData() external view returns (uint256[] memory, uint256[] memory);

    /**
     * @return The amount of available mintable token
     */
    function availableToMint() external view returns (uint256);

    /**
     * @return The address for the doubleProxy smart contract
     */
    function doubleProxy() external view returns (address);

    /**
     * @return Array of allowed Uniswap pairs
     */
    function allowedPairs() external view returns (address[] memory);

    // DOCUMENT
    function differences() external view returns (uint256, uint256);

    /**
     * @return The multiplier used to compute the rebalancing rewards
     */
    function rebalanceRewardMultiplier() external view returns (uint256[] memory);

    // |--------------------------------------------------------------------------------|
    // | ----- SETTTERS -----
    // |--------------------------------------------------------------------------------|

    /**
     * @param newDoubleProxy new DoubleProxy to set
     */
    function setDoubleProxy(address newDoubleProxy) external;

    /**
     * @param newAllowedPairs list of Uniswap pairs to be whitelisted
     */
    function setAllowedPairs(address[] calldata newAllowedPairs) external;

    // |--------------------------------------------------------------------------------|
    // | ----- CORE FUNCTIONS -----
    // |--------------------------------------------------------------------------------|

    /**
     * @dev // DOCUMENT
     * @param burnt amount of of uSD burnt
     */
    function calculateRebalanceByDebtReward(uint256 burnt) external view returns (uint256);

    /**
     * @dev Convert from one of the allowed whitelisted tokens to uSD
     * @param tokenAddress Address of the token to convert
     * @param amount Amount of Unifi token to be converted
     * @return Amount of uSD tokens
     */
    function fromTokenToStable(address tokenAddress, uint256 amount)
        external
        view
        returns (uint256);

    /**
     * Mint logic of the StableCoin.
     * @dev Mint the uSD token
     * @param pairIndex
     * @param amount0
     * @param amount1
     * @param amount0min
     * @param amount1min
     * @return Amount of freshly minted uSD token
     */
    function mint(
        uint256 pairIndex,
        uint256 amount0,
        uint256 amount1,
        uint256 amount0Min,
        uint256 amount1Min
    ) external returns (uint256);

    /**
     * @dev // DOCUMENT
     */
    function burn(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amount0,
        uint256 amount1
    ) external returns (uint256, uint256);

    /**
     * @dev // DOCUMENT
     */
    function rebalanceByCredit(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amount0,
        uint256 amount1
    ) external returns (uint256);

    /**
     * @dev // DOCUMENT
     */
    function rebalanceByDebt(uint256 amount) external returns (uint256);
}

// --------------------------------------------------------------------------------------

// DOCUMENT
interface IDoubleProxy {
    function proxy() external view returns (address);
}

// --------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------

// DOCUMENT
interface IMVDFunctionalitiesManager {
    function isAuthorizedFunctionality(address functionality) external view returns (bool);
}

// --------------------------------------------------------------------------------------

// DOCUMENT
interface IStateHolder {
    function getBool(string calldata varName) external view returns (bool);

    function getUint256(string calldata varName) external view returns (uint256);
}

// --------------------------------------------------------------------------------------

// DOCUMENT
interface IUniswapV2Router {
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

// --------------------------------------------------------------------------------------

// DOCUMENT
/**
 * @title Interface
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
