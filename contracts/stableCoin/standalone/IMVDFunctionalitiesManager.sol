// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.8.0;

// DOCUMENT
interface IMVDFunctionalitiesManager {
    function isAuthorizedFunctionality(address functionality) external view returns (bool);
}
