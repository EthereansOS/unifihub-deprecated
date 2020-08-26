pragma solidity ^0.6.0;

// DOCUMENT
interface IMVDProxy {
    function getToken() external view returns (address);

    function getMVDFunctionalitiesManagerAddress() external view returns (address);

    function getMVDWalletAddress() external view returns (address);

    function getStateHolderAddress() external view returns (address);

    function submit(string calldata codeName, bytes calldata data)
        external
        payable
        returns (bytes memory returnData);
}
