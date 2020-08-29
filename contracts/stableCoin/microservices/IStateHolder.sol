// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IStateHolder {
    function clear(string calldata varName)
        external
        returns (string memory oldDataType, bytes memory oldVal);

    function setBool(string calldata varName, bool val) external returns (bool);

    function getBool(string calldata varName) external view returns (bool);
}
