pragma solidity ^0.6.0;

interface IMVDFunctionalitiesManager {
    function isAuthorizedFunctionality(address functionality) external view returns (bool);
}
