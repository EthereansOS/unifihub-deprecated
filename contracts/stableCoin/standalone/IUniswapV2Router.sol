pragma solidity ^0.7.0;

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
