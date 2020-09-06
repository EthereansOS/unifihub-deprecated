// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IUnifiedStableFarming.sol";

contract UnifiedStableFarming is IUnifiedStableFarming {
    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    address private WETH_ADDRESS;

    uint256[] private _percentage;

    constructor(uint256[] memory percentage) {
        WETH_ADDRESS = IUniswapV2Router(UNISWAP_V2_ROUTER).WETH();
        assert(percentage.length == 2);
        _percentage = percentage;
    }

    function percentage() public override view returns (uint256[] memory) {
        return _percentage;
    }

    /**
     * @inheritdoc IUnifiedStableFarming
     */
    function earnByPump(
        address stableCoinAddress,
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amountAMin,
        uint256 amountBMin,
        address tokenAddress,
        uint256 tokenValue
    ) public override payable {
        if(tokenAddress != WETH_ADDRESS) {
            _transferToMeAndCheckAllowance(
                tokenAddress,
                tokenValue,
                UNISWAP_V2_ROUTER
            );
        }
        uint256 realTokenValue = tokenAddress == WETH_ADDRESS
            ? msg.value
            : tokenValue;
        uint256 stableCoinAmount = _swap(
            tokenAddress,
            stableCoinAddress,
            realTokenValue,
            address(this)
        );
        // Swap stablecoin for $uSD
        (uint256 returnA, uint256 returnB) = IStableCoin(stableCoinAddress).burn(
            pairIndex,
            pairAmount,
            amountAMin,
            amountBMin
        );
        (address tokenA, address tokenB, ) = _getPairData(stableCoinAddress, pairIndex);
        // Send the tokens back to their owner
        _flushToSender(tokenA, tokenB, stableCoinAddress);
    }


    /**
     * @inheritdoc IUnifiedStableFarming
     */
    function earnByDump(
        address stableCoinAddress,
        uint256 pairIndex,
        uint256 amountA,
        uint256 amountB,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256[] memory tokenIndices,
        uint256[] memory stableCoinAmounts
    ) public override {
        require(
            tokenIndices.length > 0 && tokenIndices.length <= 2,
            "You must choose at least one of the two Tokens"
        );
        // If you want N pairs as output there must be N amount specified
        require(
            tokenIndices.length == stableCoinAmounts.length,
            "Token Indices and StableCoin Amounts must have the same length"
        );
        (address tokenA, address tokenB) = _prepareForDump(
            stableCoinAddress,
            pairIndex,
            amountA,
            amountB
        );
        // Mint $uSD
        IStableCoin(stableCoinAddress).mint(pairIndex, amountA, amountB, amountAMin, amountBMin);
        // For each of the chosen output pair swap $uSD to obtain the desired amount of stablecoin
        for (uint256 i = 0; i < tokenIndices.length; i++) {
            _swap(
                stableCoinAddress,
                tokenIndices[i] == 0 ? tokenA : tokenB,
                stableCoinAmounts[i],
                msg.sender
            );
        }
        // Send the tokens back to their owner
        _flushToSender(tokenA, tokenB, stableCoinAddress, address(0));
    }

    function _transferTokens(
        address stableCoinAddress,
        uint256 pairIndex,
        uint256 amountA,
        uint256 amountB
    ) private {
        (address tokenA, address tokenB, ) = _getPairData(stableCoinAddress, pairIndex);
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);
    }

    function _getPairData(address stableCoinAddress, uint256 pairIndex)
        private
        view
        returns (
            address token0,
            address token1,
            address pairAddress
        )
    {
        IUniswapV2Pair pair = IUniswapV2Pair(
            pairAddress = IStableCoin(stableCoinAddress).allowedPairs()[pairIndex]
        );
        token0 = pair.token0();
        token1 = pair.token1();
    }

    function _checkAllowance(
        address tokenAddress,
        uint256 value,
        address spender
    ) private {
        IERC20 token = IERC20(tokenAddress);
        if (token.allowance(address(this), spender) <= value) {
            token.approve(spender, value);
        }
    }

    /**
     * @dev Transfer token to the smart contract
     */
    function _transferToMeAndCheckAllowance(
        address tokenAddress,
        uint256 value,
        address spender
    ) private {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), value);
        _checkAllowance(tokenAddress, value, spender);
    }

    function _prepareForDump(
        address stableCoinAddress,
        uint256 pairIndex,
        uint256 amount0,
        uint256 amount1
    ) private returns (address token0, address token1) {
        (token0, token1, ) = _getPairData(stableCoinAddress, pairIndex);
        _transferToMeAndCheckAllowance(token0, amount0, stableCoinAddress);
        _transferToMeAndCheckAllowance(token1, amount1, stableCoinAddress);
    }

    function _flushToSender(
        address tokenA,
        address tokenB,
        address tokenC,
        address tokenD,
    ) private {
        _flushToSender(tokenA);
        _flushToSender(tokenB);
        _flushToSender(tokenC);
        _flushToSender(tokenD);

    }

    /**
     * @dev Send token to the address calling this contract
     */
    function _flushToSender(address tokenAddress) private {
        if (tokenAddress == address(0)) {
            return;
        }
        if(tokenAddress == WETH_ADDRESS) {
            payable(msg.sender).transfer(address(this).balance);
            return;
        }
        IERC20 token = IERC20(tokenAddress);
        uint256 balanceOf = token.balanceOf(address(this));
        if (balanceOf > 0) {
            token.transfer(msg.sender, balanceOf);
        }
    }

    /**
     * @dev Swap on uniswap!
     * @param tokenIn Address of the input token
     * @param tokenOut Address of the output token
     * @param amountIn Amount to swap
     * @param receiver Address of the receiver of the swap (who gets the money)
     */
    function _swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address receiver
    ) private returns (uint256) {
        _checkAllowance(tokenIn, amountIn, UNISWAP_V2_ROUTER);

        IUniswapV2Router uniswapV2Router = IUniswapV2Router(UNISWAP_V2_ROUTER);

        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        if (path[0] == WETH_ADDRESS) {
            return
                uniswapV2Router.swapExactETHForTokens{value: amountIn}(
                    uniswapV2Router.getAmountsOut(amountIn, path)[1],
                    path,
                    receiver,
                    block.timestamp + 1000
                )[1];
        }
        return
            uniswapV2Router.swapExactTokensForTokens(
                amountIn,
                uniswapV2Router.getAmountsOut(amountIn, path)[1],
                path,
                receiver,
                block.timestamp + 1000
            )[1];
    }
}
