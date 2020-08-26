pragma solidity ^0.6.0;

// DOCUMENT
interface IStateHolder {
    function getBool(string calldata varName) external view returns (bool);

    function getUint256(string calldata varName) external view returns (uint256);
}
