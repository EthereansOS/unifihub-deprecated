pragma solidity ^0.7.0;

interface IERC20 {
    function mint(uint256 amount) external;

    function balanceOf(address account) external view returns (uint256);
}
