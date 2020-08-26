pragma solidity ^0.6.0;

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
