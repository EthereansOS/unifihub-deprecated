// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.8.0;

/**
 * @title UnifiedStableFarming
 * @dev Arbitrage helper
 */
interface IUnifiedStableFarming {
    function percentage() external view returns (uint256[] memory);

    /**
     * @dev Earn by pumping $uSD: Swap stablecoins for $uSD in their pools, then burn $uSD until
     *  equilibrium.
     * @param stableCoinAddress Address of the $uSD stablecoin
     * @param pairIndex Index of the pair inside the whitelisted pairs array
     * @param pairAmount Amount of Uniswap liquidity tokens to send back to the pool
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert
     * @param tokenAddress Address of the token to swap to get $uSD
     * @param tokenValue How much to swap for
     */
    function earnByPump(
        address stableCoinAddress,
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amountAMin,
        uint256 amountBMin,
        address tokenAddress,
        uint256 tokenValue
    ) external payable;

    /**
     * @dev Earn by dumping $uSD: Mint stablecoins obtaining $usd then swap it back for caller choice of
     * stablecoins
     * @param stableCoinAddress Address of the uSD stablecoin
     * @param pairIndex Index of the pair inside the whitelisted pairs array
     * @param amountA Amount of tokenA
     * @param amountB Amount of tokenB
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert
     * @param tokenIndices Array of indices identifying which stablecoins to obtain as result of the
     * arbitrage
     * @param stableCoinAmounts Array of containing the amounts of stablecoins to get as result of the
     * arbitrage
     */
    function earnByDump(
        address stableCoinAddress,
        uint256 pairIndex,
        uint256 amountA,
        uint256 amountB,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256[] calldata tokenIndices,
        uint256[] calldata stableCoinAmounts
    ) external;
}

interface IStableCoin {
    function allowedPairs() external view returns (address[] memory);

    function fromTokenToStable(address tokenAddress, uint256 amount)
        external
        view
        returns (uint256);

    function mint(
        uint256 pairIndex,
        uint256 amount0,
        uint256 amount1,
        uint256 amount0Min,
        uint256 amount1Min
    ) external returns (uint256);

    function burn(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amount0,
        uint256 amount1
    ) external returns (uint256, uint256);
}

interface IUniswapV2Pair {
    function token0() external view returns (address);

    function token1() external view returns (address);
}

interface IUniswapV2Router02 {
    function WETH() external pure returns (address);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}
