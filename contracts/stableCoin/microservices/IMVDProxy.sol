pragma solidity ^0.7.0;

interface IMVDProxy {
    function getToken() external view returns (address);

    function getStateHolderAddress() external view returns (address);

    function getMVDFunctionalitiesManagerAddress() external view returns (address);

    function transfer(
        address receiver,
        uint256 value,
        address token
    ) external;

    function flushToWallet(
        address tokenAddress,
        bool is721,
        uint256 tokenId
    ) external;
}
