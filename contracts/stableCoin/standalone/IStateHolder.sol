// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.8.0;

// DOCUMENT
interface IStateHolder {
    function getBool(string calldata varName) external view returns (bool);

    function getUint256(string calldata varName) external view returns (uint256);
}
