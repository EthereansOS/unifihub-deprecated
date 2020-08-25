// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "./ERC20.sol";
import "./IStableCoin.sol";

/**
 * @title StableCoin
 * @dev Contract for the "uSD" Stable Coin. It's an ERC20 token extended with the IStableCoin
 *  interface.
 */
contract StableCoin is ERC20, IStableCoin {
    // |------------------------------------------------------------------------------------------|
    // | ----- ATTRIBUTES ----- |
    // |------------------------------------------------------------------------------------------|

    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    address private _doubleProxy;

    address[] private _allowedPairs;

    uint256[] private _rebalanceRewardMultiplier;

    uint256[] private _timeWindows;

    uint256[] private _mintables;

    uint256 private _lastRedeemBlock;

    // |------------------------------------------------------------------------------------------|
    // | ----- CONSTRUCTOR ----- |
    // |------------------------------------------------------------------------------------------|

    /**
     * @dev Contract constructor. See StableCoin.init() docs.
     */
    constructor(
        string memory name,
        string memory symbol,
        address doubleProxy,
        address[] memory allowedPairs,
        uint256[] memory rebalanceRewardMultiplier,
        uint256[] memory timeWindows,
        uint256[] memory mintables
    ) {
        // DOCUMENT
        if (doubleProxy == address(0)) {
            return;
        }
        init(
            name,
            symbol,
            doubleProxy,
            allowedPairs,
            rebalanceRewardMultiplier,
            timeWindows,
            mintables
        );
    }

    /**
     * Initialize the StableCoin.
     * @inheritdoc IStableCoin
     */
    function init(
        string memory name,
        string memory symbol,
        address doubleProxy,
        address[] memory allowedPairs,
        uint256[] memory rebalanceRewardMultiplier,
        uint256[] memory timeWindows,
        uint256[] memory mintables
    ) public override {
        super.init(name, symbol);
        _doubleProxy = doubleProxy;
        _allowedPairs = allowedPairs;
        assert(rebalanceRewardMultiplier.length == 2);
        _rebalanceRewardMultiplier = rebalanceRewardMultiplier;
        assert(timeWindows.length == mintables.length);
        _timeWindows = timeWindows;
        _mintables = mintables;
    }

    // |------------------------------------------------------------------------------------------|
    // | ----- GETTERS ----- |
    // |------------------------------------------------------------------------------------------|

    /**
     * @inheritdoc IStableCoin
     */
    function tierData() public override view returns (uint256[] memory, uint256[] memory) {
        return (_timeWindows, _mintables);
    }

    /**
     * @inheritdoc IStableCoin
     */
    function availableToMint() public override view returns (uint256) {
        uint256 mintable = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
        if (_timeWindows.length > 0 && block.number < _timeWindows[_timeWindows.length - 1]) {
            for (uint256 i = 0; i < _timeWindows.length; i++) {
                if (block.number < _timeWindows[i]) {
                    mintable = _mintables[i];
                    break;
                }
            }
        }
        uint256 minted = totalSupply();
        return minted >= mintable ? 0 : mintable - minted;
    }

    /**
     * @inheritdoc IStableCoin
     */
    function doubleProxy() public override view returns (address) {
        return _doubleProxy;
    }

    /**
     * @inheritdoc IStableCoin
     */
    function rebalanceRewardMultiplier() public override view returns (uint256[] memory) {
        return _rebalanceRewardMultiplier;
    }

    /**
     * @inheritdoc IStableCoin
     */
    function allowedPairs() public override view returns (address[] memory) {
        return _allowedPairs;
    }

    // |------------------------------------------------------------------------------------------|
    // | ----- SETTERS ----- |
    // |------------------------------------------------------------------------------------------|

    /**
     * @inheritdoc IStableCoin
     */
    function setDoubleProxy(address newDoubleProxy) public override _byCommunity {
        _doubleProxy = newDoubleProxy;
    }

    /**
     * @inheritdoc IStableCoin
     */
    function setAllowedPairs(address[] memory newAllowedPairs) public override _byCommunity {
        _allowedPairs = newAllowedPairs;
    }

    /**
     * @inheritdoc IStableCoin
     */
    function differences() public override view returns (uint256 credit, uint256 debt) {
        uint256 totalSupply = totalSupply();
        uint256 effectiveAmount = 0;
        for (uint256 i = 0; i < _allowedPairs.length; i++) {
            (uint256 amount0, uint256 amount1) = _getPairAmount(i);
            effectiveAmount += (amount0 + amount1);
        }
        credit = effectiveAmount > totalSupply ? effectiveAmount - totalSupply : 0;
        debt = totalSupply > effectiveAmount ? totalSupply - effectiveAmount : 0;
    }

    /**
     * @inheritdoc IStableCoin
     */
    function calculateRebalanceByDebtReward(uint256 burnt)
        public
        override
        view
        returns (uint256 reward)
    {
        if (burnt == 0) {
            return 0;
        }
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = IMVDProxy(IDoubleProxy(_doubleProxy).proxy()).getToken();
        reward = IUniswapV2Router(UNISWAP_V2_ROUTER).getAmountsOut(burnt, path)[1];
        reward = (reward * _rebalanceRewardMultiplier[0]) / _rebalanceRewardMultiplier[1];
    }

    /**
     * @inheritdoc IStableCoin
     */
    function fromTokenToStable(address tokenAddress, uint256 amount)
        public
        override
        view
        returns (uint256)
    {
        StableCoin token = StableCoin(tokenAddress);
        uint256 remainingDecimals = decimals() - token.decimals();
        uint256 result = amount == 0 ? token.balanceOf(address(this)) : amount;
        if (remainingDecimals == 0) {
            return result;
        }
        return result * 10**remainingDecimals;
    }

    /**
     * @inheritdoc IStableCoin
     *
     * @dev Minting first check tha DFO auth protocol are respected, secondly it sends the tokens
     * to a Uniswap Pool (_createPoolToken)
     *
     */
    function mint(
        uint256 pairIndex,
        uint256 amountA,
        uint256 amountB,
        uint256 amountAMin,
        uint256 amountBMin
    ) public override _forAllowedPair(pairIndex) returns (uint256 minted) {
        // NOTE: Use DFO protocol to check for authorization
        require(
            IStateHolder(IMVDProxy(IDoubleProxy(_doubleProxy).proxy()).getStateHolderAddress())
                .getBool(_toStateHolderKey("stablecoin.authorized", _toString(address(this)))),
            "Unauthorized action!"
        );
        (address tokenA, address tokenB, ) = _getPairData(pairIndex);
        _transferTokensAndCheckAllowance(tokenA, amountA);
        _transferTokensAndCheckAllowance(tokenB, amountB);
        (uint256 firstAmount, uint256 secondAmount, ) = _createPoolToken(
            tokenA,
            tokenB,
            amountA,
            amountB,
            amountAMin,
            amountBMin
        );
        minted = fromTokenToStable(tokenA, firstAmount) + fromTokenToStable(tokenB, secondAmount);
        require(minted <= availableToMint(), "Minting amount is greater than availability!");
        _mint(msg.sender, minted);
    }

    /**
     * @inheritdoc IStableCoin
     */
    function burn(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amountAMin,
        uint256 amountBMin
    ) public override _forAllowedPair(pairIndex) returns (uint256 removedA, uint256 removedB) {
        (address tokenA, address tokenB, address pairAddress) = _getPairData(pairIndex);
        _checkAllowance(pairAddress, pairAmount);
        (removedA, removedB) = IUniswapV2Router(UNISWAP_V2_ROUTER).removeLiquidity(
            tokenA,
            tokenB,
            pairAmount,
            amountAMin,
            amountBMin,
            msg.sender,
            block.timestamp + 1000
        );
        _burn(
            msg.sender,
            fromTokenToStable(tokenA, removedA) + fromTokenToStable(tokenB, removedB)
        );
    }

    /**
     * @inheritdoc IStableCoin
     */
    function rebalanceByCredit(
        uint256 pairIndex,
        uint256 pairAmount,
        uint256 amount0,
        uint256 amount1
    ) public override _forAllowedPair(pairIndex) returns (uint256 redeemed) {
        // NOTE: Use DFO Protocol to check for authorization
        require(
            block.number >=
                _lastRedeemBlock +
                    IStateHolder(
                        IMVDProxy(IDoubleProxy(_doubleProxy).proxy()).getStateHolderAddress()
                    )
                        .getUint256("stablecoin.rebalancebycredit.block.interval"),
            "Unauthorized action!"
        );
        _lastRedeemBlock = block.number;
        (uint256 credit, ) = differences();
        (address token0, address token1, address pairAddress) = _getPairData(pairIndex);
        _checkAllowance(pairAddress, pairAmount);
        (uint256 removed0, uint256 removed1) = IUniswapV2Router(UNISWAP_V2_ROUTER).removeLiquidity(
            token0,
            token1,
            pairAmount,
            amount0,
            amount1,
            IMVDProxy(IDoubleProxy(_doubleProxy).proxy()).getMVDWalletAddress(),
            block.timestamp + 1000
        );
        redeemed = fromTokenToStable(token0, removed0) + fromTokenToStable(token1, removed1);
        require(redeemed <= credit, "Cannot redeem given pair amount");
    }

    /**
     * @inheritdoc IStableCoin
     */
    function rebalanceByDebt(uint256 amount) public override returns (uint256 reward) {
        require(amount > 0, "You must insert a positive value");
        (, uint256 debt) = differences();
        require(amount <= debt, "Cannot Burn this amount");
        _burn(msg.sender, amount);
        IMVDProxy(IDoubleProxy(_doubleProxy).proxy()).submit(
            "mintNewVotingTokensForStableCoin",
            abi.encode(address(0), 0, reward = calculateRebalanceByDebtReward(amount), msg.sender)
        );
    }

    /**
     * // DOCUMENT
     */
    modifier _byCommunity() {
        require(
            IMVDFunctionalitiesManager(
                IMVDProxy(IDoubleProxy(_doubleProxy).proxy()).getMVDFunctionalitiesManagerAddress()
            )
                .isAuthorizedFunctionality(msg.sender),
            "Unauthorized Action!"
        );
        _;
    }

    /**
     * // DOCUMENT
     */
    modifier _forAllowedPair(uint256 pairIndex) {
        require(pairIndex >= 0 && pairIndex < _allowedPairs.length, "Unknown pair!");
        _;
    }

    /**
     * // DOCUMENT
     */
    function _getPairData(uint256 pairIndex)
        private
        view
        returns (
            address token0,
            address token1,
            address pairAddress
        )
    {
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress = _allowedPairs[pairIndex]);
        token0 = pair.token0();
        token1 = pair.token1();
    }

    /**
     * // DOCUMENT
     */
    function _transferTokensAndCheckAllowance(address tokenAddress, uint256 value) private {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), value);
        _checkAllowance(tokenAddress, value);
    }

    /**
     * // DOCUMENT
     */
    function _checkAllowance(address tokenAddress, uint256 value) private {
        IERC20 token = IERC20(tokenAddress);
        if (token.allowance(address(this), UNISWAP_V2_ROUTER) <= value) {
            token.approve(
                UNISWAP_V2_ROUTER,
                0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            );
        }
    }

    /**
     * @dev Use the Uniswap Protocol to add liquidity to a pool.
     */
    function _createPoolToken(
        address firstToken,
        address secondToken,
        uint256 originalFirstAmount,
        uint256 originalSecondAmount,
        uint256 firstAmountMin,
        uint256 secondAmountMin
    )
        private
        returns (
            uint256 firstAmount,
            uint256 secondAmount,
            uint256 poolAmount
        )
    {
        (firstAmount, secondAmount, poolAmount) = IUniswapV2Router(UNISWAP_V2_ROUTER).addLiquidity(
            firstToken,
            secondToken,
            originalFirstAmount,
            originalSecondAmount,
            firstAmountMin,
            secondAmountMin,
            address(this),
            block.timestamp + 1000
        );
        if (firstAmount < originalFirstAmount) {
            IERC20(firstToken).transfer(msg.sender, originalFirstAmount - firstAmount);
        }
        if (secondAmount < originalSecondAmount) {
            IERC20(secondToken).transfer(msg.sender, originalSecondAmount - secondAmount);
        }
    }

    /**
     * // DOCUMENT
     */
    function _getPairAmount(uint256 i) private view returns (uint256 amount0, uint256 amount1) {
        (address token0, address token1, address pairAddress) = _getPairData(i);
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        uint256 pairAmount = pair.balanceOf(address(this));
        uint256 pairTotalSupply = pair.totalSupply();
        (amount0, amount1, ) = pair.getReserves();
        amount0 = fromTokenToStable(token0, (pairAmount * amount0) / pairTotalSupply);
        amount1 = fromTokenToStable(token1, (pairAmount * amount1) / pairTotalSupply);
    }

    /**
     * // DOCUMENT
     */
    function _toStateHolderKey(string memory a, string memory b)
        private
        pure
        returns (string memory)
    {
        return _toLowerCase(string(abi.encodePacked(a, "_", b)));
    }

    /**
     * // DOCUMENT
     */
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

    /**
     * // DOCUMENT
     */
    function _toLowerCase(string memory str) private pure returns (string memory) {
        bytes memory bStr = bytes(str);
        for (uint256 i = 0; i < bStr.length; i++) {
            bStr[i] = bStr[i] >= 0x41 && bStr[i] <= 0x5A ? bytes1(uint8(bStr[i]) + 0x20) : bStr[i];
        }
        return string(bStr);
    }
}
