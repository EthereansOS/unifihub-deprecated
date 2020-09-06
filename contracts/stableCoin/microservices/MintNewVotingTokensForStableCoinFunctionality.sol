/* Discussion:
 * https://github.com/b-u-i-d-l/unifi
 */

/* Description:
 * When a stablecoin loses value, the Uniswap Tier pools rebalance to an uneven disparity (≠ 50/50).
 * If the stablecoin totally fails, the other stablecoins effectively pump in correlation.
 *
 * DFO Debit resolves this issue on-chain by rebalancing uSD, creating debt which the UniFi DFO
 * then pays off by minting UniFi. Let’s look at how this plays out, step by step:
 *
 * 1 - A stablecoin collateralized by uSD loses value or fails altogether.
 *
 * 2 - $UniFi holders vote to remove the tiers containing the failed stablecoin from the whitelist.
 * The uSD supply becomes grater than the supply of the collateralized pooled stablecoins.
 *
 * 3 - To restore 1:1 equilibrium, anyone holding uSD can burn it to receive new UniFi, minted at a
 * 50% discount of the uSD/UniFi Uniswap pool mid-price ratio.
 *
 * The goal of $UniFi holders, which aligns with their self-interest, is to ensure uSD's security.
 * Thus there is an economic disincentive to whitelist insecure stablecoins.
 */
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IMVDFunctionalitiesManager.sol";
import "./IMVDProxy.sol";
import "./IStateHolder.sol";

/**
 * @title Mint Voting Tokens ($unifi) by burning Stable Coin ($uSD)
 * @dev This contract adds unifi minting capabilities to uSD
 */
contract MintNewVotingTokensForStableCoinFunctionality {
    function onStart(address, address) public {
        IStateHolder stateHolder = IStateHolder(IMVDProxy(msg.sender).getStateHolderAddress());
        address stablecoinauthorized = 0x44086035439E676c02D411880FcCb9837CE37c57;
        stateHolder.setBool(
            _toStateHolderKey("stablecoin.authorized", _toString(stablecoinauthorized)),
            true
        );
    }

    function onStop(address) public {
        IStateHolder stateHolder = IStateHolder(IMVDProxy(msg.sender).getStateHolderAddress());
        address stablecoinauthorized = 0x44086035439E676c02D411880FcCb9837CE37c57;
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
