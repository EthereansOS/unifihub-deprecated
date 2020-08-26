// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IERC20.sol";
import "./IMVDFunctionalitiesManager.sol";
import "./IMVDProxy.sol";
import "./IStateHolder.sol";

/**
 * @title Mint Voting Tokens ($unifi) by burning Stable Coin ($uSD)
 * @dev This contract adds unifi minting capabilies to uSD
 */
contract MintNewVotingTokensForStableCoinFunctionality {
    function onStart(address, address) public {
        IStateHolder stateHolder = IStateHolder(IMVDProxy(msg.sender).getStateHolderAddress());
        address stablecoinauthorized = 0x9f4c43A51C9a67F432E5C8BcBFa55312110BCD3A;
        stateHolder.setBool(
            _toStateHolderKey("stablecoin.authorized", _toString(stablecoinauthorized)),
            true
        );
    }

    function onStop(address) public {
        IStateHolder stateHolder = IStateHolder(IMVDProxy(msg.sender).getStateHolderAddress());
        address stablecoinauthorized = 0x9f4c43A51C9a67F432E5C8BcBFa55312110BCD3A;
        stateHolder.clear(
            _toStateHolderKey("stablecoin.authorized", _toString(stablecoinauthorized))
        );
    }

    function mintNewVotingTokensForStableCoin(
        address sender,
        uint256,
        uint256 amountToMint,
        address receiver
    ) public {
        IMVDProxy proxy = IMVDProxy(msg.sender);

        // NOTE: Use DFO Protocol to check for authorization
        require(
            IStateHolder(proxy.getStateHolderAddress()).getBool(
                _toStateHolderKey("stablecoin.authorized", _toString(sender))
            ),
            "Unauthorized action!"
        );

        IERC20 token = IERC20(proxy.getToken());
        uint256 proxyBalanceOf = token.balanceOf(address(proxy));

        token.mint(amountToMint);
        proxy.flushToWallet(address(token), false, 0);

        proxy.transfer(receiver, amountToMint, address(token));

        if (proxyBalanceOf > 0) {
            proxy.transfer(address(proxy), proxyBalanceOf, address(token));
        }
    }

    function _toStateHolderKey(string memory a, string memory b)
        private
        pure
        returns (string memory)
    {
        return _toLowerCase(string(abi.encodePacked(a, "_", b)));
    }

    function _toString(address _addr) private pure returns (string memory) {
        bytes32 value = bytes32(uint256(_addr));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(value[i + 12] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }

    function _toLowerCase(string memory str) private pure returns (string memory) {
        bytes memory bStr = bytes(str);
        for (uint256 i = 0; i < bStr.length; i++) {
            bStr[i] = bStr[i] >= 0x41 && bStr[i] <= 0x5A ? bytes1(uint8(bStr[i]) + 0x20) : bStr[i];
        }
        return string(bStr);
    }
}
