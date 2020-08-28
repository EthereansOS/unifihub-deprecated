pragma solidity ^0.7.0;

// DOCUMENT
interface IMVDFunctionalitiesManager {
    function isAuthorizedFunctionality(address functionality) external view returns (bool);
}
