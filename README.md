# unifi
## Decentralized Finance on top of Uniswap, doing fantastic things securely
### UniFi is a new Decentralized Flexible Organization (DFO) that researches and develops a responsible Decentralized Finance layer on top of Uniswap. A DFO protocol powered DeFi set of tools built on top of Uniswap

### Website: <a href="https://unifihub.com">https://unifihub.com</a>

# Unified State Dollar

uSD is a stablecoin based on Uniswap Liquidity Pools Minted by the magic rainbow of Uniswap stablecoin pools, and backed by the power of the Unicorn, uSD is the most secure and resilient stablecoin on Ethereum - ever. The only way it could be destabilized is if the entire stablecoin industry crashed. | Etherscan Uniswap
Independent from any off-chain issuer, it is fortified against every risk inherent to all other stablecoins, and free of the anxiety that pervades the industry.

The protocol achieves this unprecedented feat by collateralizing other stablecoins. If any of them lose value or fail, it can simply rebalance itself to leverage the security of the others. And to account for excess due to fees earned by their pools, it can rebalance itself in another way.
The only way uSD can be destabilized is if the entire stablecoin industry collapses.

uSD is backed by a selection of Uniswap's (whitelisted) stablecoin liquidity pools.Anyone can mint it by adding these stablecoins to those pools.

### Example:

Mint 2x uSD by adding 1x Stablecoin A and 1x Stablecoin B And by burning uSD, anyone can receive these stablecoins from those pools.

### Example:

Burn 2x uSD and receive 1x Stablecoin A and 1x Stablecoin C

# Rebalancing

Sometimes, collateralization is not enough, and uSD must rebalance in one of two ways.

### DFO Debit

When a stablecoin loses value, the Uniswap Tier pools rebalance to an uneven disparity (≠ 50/50). 

If the stablecoin totally fails, the other stablecoins effectively pump in correlation.DFO Debit resolves this issue on-chain by rebalancing uSD, creating debt which the UniFi DFO then pays off by minting UniFi. Let’s look at how this plays out, step by step:

1 - A stablecoin collateralized by uSD loses value or fails altogether.

2 - $UniFi holders vote to remove the tiers containing the failed stablecoin from the whitelist.The uSD supply becomes grater than the supply of the collateralized pooled stablecoins.

3 - To restore 1:1 equilibrium, anyone holding uSD can burn it to receive new UniFi, minted at a 20% discount of the uSD/UniFi Uniswap pool mid-price ratio.

The goal of $UniFi holders, which aligns with their self-interest, is to ensure uSD’s security. Thus there is an economic disincentive to whitelist insecure stablecoins.

### DFO Credit

As established, uSD is backed by Uniswap pool liquidity. 

This raises an issue; Uniswap pools earn 0.3% of trading fees. This could destabilize uSD by creating an excess of collateralized stablecoins in the pools.DFO Credit, the second rebalancing function of the UniFi DFO, resolves this by removing that excess from the pools and sending it in the DFO wallet managed by $UniFi holders.

This is a long term economic incentive for the UniFi DFO to grow and invest credit in R&D.

### UniFi has a number of measures in place to ensure uSD's security.

 -  uSD pool collateral is locked. Stored in an external smart contract, it can't be touched even by the UniFi DFO, precluding voter fraud by bad actors.
 -  In the case of any bug or update, $UniFi holders can vote to pause the uSD smart contract. This prevents minting of new uSD or rebalancing of uSD, but holders will still be able to redeem it for the pooled stable coins, and thus revoke the collateral.
 -  Even if the uSD protocol fails, and even if the UniFi DFO votes to update uSD to an undesirable new version, uSD holders will still be able to interact with the old smart contract - until all collateral is revoked - as well as the new one.

### Resilience, Decentralization and Independence

uSD is indeed the most resilient and secure stablecoin in the industry. By taking advantage of Uniswap, a security layer with a decentralized core, it frees holders from dependence on censorship or centralized manipulation by states and stablecoin issuers, and resolves all risks that come with trusting the big stablecoin companies, like MakerDAO, Coinbase, etc.
It is backed by a Decentralized Flexible Organization. $UniFi holders on the Ethereum network have 100% control of the code and Credit/Debit of the protocol. Nobody can stop or censor the UniFi-uSD protocol; for the first time, the Ethereum network doesn't have to choose between stability and independence in a stablecoin; it can have both.

### Allowed Stable Coins

The allowed stablecoins to mint and burn uSD with are:

DAI <a targer="_blank" href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f">0x6b175474e89094c44da98b954eedeac495271d0f</a>
USDC <a targer="_blank" href="https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48</a>
GSDC <a targer="_blank" href="https://etherscan.io/token/0x056fd409e1d7a124bd7017459dfea2f387b6d5cd">0x056fd409e1d7a124bd7017459dfea2f387b6d5cd</a>
BUSD <a targer="_blank" href="https://etherscan.io/token/0x4fabb145d64652a948d72533023f6e7a623c7c53">0x4fabb145d64652a948d72533023f6e7a623c7c53</a>
TUSD <a targer="_blank" href="https://etherscan.io/token/0x0000000000085d4780b73119b644ae5ecd22b376">0x0000000000085d4780b73119b644ae5ecd22b376</a>
PAX <a targer="_blank" href="https://etherscan.io/token/0x8e870d67f660d95d5be530380d0ec0bd388289e1">0x8e870d67f660d95d5be530380d0ec0bd388289e1</a>

### APIs and Documentation

To build on top of uSD and to interact with the dApp, you can find all of the documentation and APIs here: <a href="https://github.com/b-u-i-d-l/unifi-docs">Documentation</a>

### Responsible DeFi Limits

Because we take a Responsible DeFi Approach, UniFi uSD minting is limited in its early stages:

- 500,000 uSD mintable for the first month (until block n 10941929)
- 2,000,000 uSD mintable for the first two months (until block n 11141929)
- 5,000,000 uSD mintable for the first three months (until block n 11341929)
- 10,000,000 uSD mintable for the first four months (until block n 11541929)
- 20,000,000 uSD mintable for the first five months (until block n 11741929)

# Craft and Initial Liquidity Offerings (ILOs)

Craft makes it possible to provide liquidity that is programmable with advanced rules. Using Unicorn magic, pools can balance tokens diversely, and with unprecedented security.

Programmable liquidity is an exciting new feature in AMMs (Automated Market Makers). However, if not applied correctly, it can actually be a security hole for bugs, due to math complexities (as we saw with Balancer recently).

UniFi Crafting resolves this by offering programmable liquidity, but with Uniswap as a base layer, taking advantage of its secure and decentralized core. This also helps liquidity providers customize their investments, and empowers new applications on top of Uniswap.

### How Does It Work?

Uniswap allows for liquidity pools composed of 50:50 asset ratios. This is usually the most secure setup for an AMM, but disincentivizes liquidity provision by incurring impermanent losses. Crafting resolves this, and opens up novel financial use cases for Uniswap pools. It is a fancy new way to build liquidity together, without needing to trust and know each other.

Anyone can create a Craft order, customize the liquidity setup and deploy it by contributing initial liquidity. Others can then contribute the rest of the liquidity required to pool the order on Uniswap. Later, after the predetermined block, any of the participants can trigger removal of the liquidity. It is then distributed to all participants based on the predetermined rules.

## Programmable Liquidity Rules

With Crafting, Uniswap liquidity providers can program a liquidity order by customizing the following:

- Tier: The Uniswap tier to which the liquidity will be added
- Waiting Length: The max time (in blocks) the order can remain available while the required liquidity is waiting to be filled.
- Min Block Length: The time (in blocks) for which the liquidity will be locked. If 0, any participant can trigger the removal of liquidity anytime.
- Liquidity Ratio: The ratio of liquidity, e.g. 10% DAI - 90% ETH or 0% DAI - 100 ETH. Once deployed by the creator, others can add the required liquidity. If the creator sets the ratio at 10% DAI - 90% ETH, the others can add the rest at 90% DAI - 10% ETH.
- Liquidity Exit/Discount: An advanced feature for orders that allows for the creation of a different ratio or even a discount for the exit.

### Let's play out that aforementioned example.

Person A creates an order for USDC - DAI, with a min block length of 543055 Blocks and a ratio of 10% DAI - 90% USDC. He adds 100 DAI and 900 USDC, and also decides to set the exit liquidity at 30% DAI and 70% USDC (read on to see exactly how exit liquidity works).

B fills part of the remaining required liquidity (at a ratio of 90% DAI and 10% USDC) with 500 DAI and 50 USDC.

C fills part of the remaining required liquidity (at a ratio of 90% DAI and 10% USDC) with 100 DAI and 10 USDC.

D fills the rest of the required liquidity (at a ratio of 90% DAI and 10% USDC) with 300 DAI and 30 USDC.

By adding the final remaining required liquidity, D has triggered Uniswap's Add Liquidity order …

The total Uniswap liquidity pooled by A,B,C and D is 1,000 DAI and 1,000 USDC.

After 543055 blocks, the liquidity pool has earned 1,000 USDC and 1,000 DAI in Uniswap trading fees, bringing the total to 2,000 DAI and 2,000 USDC.

… B then triggers the removal action, and based on the fixed predetermined rules, the providers receive the following:

A receives 600 DAI and 1,400 USDC (at the Exit Ratio of 30% DAI and 70% USDC).

Based on how much they individually contributed, B, C and D receive their respective proportion of 1,400 DAI and 600 USDC (at the Exit Ratio of 70% DAI and 30% USDC).

# Initial Liquidity Offering (ILO)

ILOs are a way for Ethereum-based startups to configure "Crafting" - i.e, Programmable Liquidity - rules to secure long term funding by providing Uniswap liquidity.

ILOs are helpful for three specific reasons:

### Securing Initial Liquidity for AMMs With Fixed Inflation/Liquidity Staking

Providers can offer liquidity with fixed inflation without dumping on new holders. They also help new investors reduce slippage and become holders with a large amount of capital.

### Disarming Sniper Bots

Sniper Bots track new low liquidity Uniswap pools for sizable capital before liquidity even comes in, making it (until now) impossible for startups to offer liquidity with low collateral.

### Securing Long Term Locked Investors

Investors lock their funds for the long run.

### How ILOs work:

Before distributing their tokens, startups can set crafting orders with fixed pre-values, adding the token and requesting the collateral required to fill the order. Investors provide that collateral, and if the startup chooses, investors get an Exit/Discount to mitigate the high risk.

### Example

The token creator sets a Crafting order with low liquidity, e.g. 1,000,000 of the token and 1 ETH, with a 90% - 10% ratio, or even 1,000,000 of token and 0 ETH, with a 100% - 0% ratio (adding a pre-value of the token, if the liquidity pool is not open yet) for one year. Setting the Liquidity Exit/Discount 10%/20%, investors will receive at the end of the order 90%/80%.

In this case, investors invest their own Ethereum for a new token that is not already tradable. This entails a high level or risk, and so they are compensated by receiving a more significant portion of the liquidity at the end of the year; in this case, from 50% added to 170% received.

ILOs enable new Ethereum fundraising rules that solve liquidity issues in early stages, while also helping legitimate projects set Fixed Inflation. This empowers projects and investors in the long run.UniFi DFO Tax:

### UniFi DFO Tax

The UniFi DFO earns via the Crafting function; 0.1% of the total Uniswap pool tokens in a Craft order is taxed and paid directly when a participant calls the remove function.

### Release

The release Of Crafting and ILOs is expected for early October 2020.

# The Bazar

Ancient black magic is unleashing the true power of the Unicorn. Programmable Equities and Token Index Funds (and soon NFTs, including ERC1155s, thanks to ethArt V2) can now be swapped on the new Bazar DEX.

The UniFi Bazar unleashes the true potential of Uniswap, by enabling Ethereans to trade these more easily than ever before.

## Listing

### Index Funds

Previously, any ERC20 Uniswap V2 pool token could be traded on Uniswap. But Index Funds - backed by multiple ERC20 tokens - could not. Until now.

On the Bazar, Ethereans can freely swap and track crypto Index Funds.

### Programmable Equities

Programmable equities are a new asset class in crypto. They are the ERC20 voting tokens of Decentralized Flexible Organizations (DFOs). Holders have 100% ownership of the protocol; there is no opportunity for external manipulation.

On the Bazar, all programmable equities can be listed and traded on Uniswap.

### Non-Fungible Tokens (NFTs)

ERC1155 NFTs are tokens with metadata, but at the same time have a supply. The reason they haven't been tradable in AMMs before is due to their 'transfer' function. They use the 'SafeTransferFrom' method, instead of the ERC20 methods, 'Transfer' and 'TransferFrom.' Also, they don't have decimals; they're transferred using ID and Amount.

ethArt V2 will be released in November, and the Bazar will be able to synthesise ERC1155 tokens with ERC20s (as WETH with ETH) in the background, fundamentally reshaping the NFT market by allowing Ethereans to trade ERC1155 tokens for the first time.

### Swappable ERC 1155 Release

The release of ethArt V2 and swappable NFTs is scheduled for late November. 

# UniFi Token Distribution

The total supply of $UniFi is 88,888,888, which is initially distributed and Locked as follows:

- 36% (32,042,000) are locked in the NERV Wallet <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x25756f9C2cCeaCd787260b001F224159aB9fB97A">[0x25756f9C2cCeaCd787260b001F224159aB9fB97A]</a> This is the DFOhub Operation' DFO wallet, funded by Fair Inflation.
- 40% (35,900,000) are locked in the UniFI's DFO wallet <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x2578aA454b29C15c8eEF62C972Ee1ff57CD99DEf">[0x2578aA454b29C15c8eEF62C972Ee1ff57CD99DEf]</a>. This pays out the liquidity staking rewards. The active reward staking contract is <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0xb266252Fd70D253b4330151A96694d35e94b846c">[0xb266252Fd70D253b4330151A96694d35e94b846c]</a>
- 16% (14,333,333) are locked in the DFOhub wallet (owned by $buidl holders) <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x5D40c724ba3e7Ffa6a91db223368977C522BdACD">[0x5D40c724ba3e7Ffa6a91db223368977C522BdACD]</a>

# UniFi Fair Inflation

A sustainable economic model for DFO-based startups to maintain value and fund operations | UniFi version

The original whitepaper of the first fair inflation mechanism was for buidl (<a target="_blank" href="https://github.com/b-u-i-d-l/fair-inflation-v2">(https://github.com/b-u-i-d-l/fair-inflation-v2)</a>)
UniFi's fair inflation will inflate the supply by 2% (1,788,500 $UniFi) over the first year via <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x25756f9C2cCeaCd787260b001F224159aB9fB97A">NERV</a> (The DFOhub Team Operations' DFO)

Inflation events will occur once a day (every 6,300 ETH Blocks) across three Uniswap pairs, for a total of 4,900 $UniFi each event:

- Uniswap V2 $ETH/$UniFi (2695 $UniFi every day) - 55%
- Uniswap V2 $USDC/$UniFi (1470 $UniFi every day) - 30%
- Uniswap V2 $BUIDL/$UniFi (735 $UniFi every day) - 15%

All functionalities related to this R&D will become available for every DFO as Optional Basic Functionalities, to accelerate the exploration of Programmable Equity R&D.

# UniFi Liquidity Staking

$UniFi liquidity staking is available here: <a href="https://dapp.dfohub.com/?staking=0xb266252Fd70D253b4330151A96694d35e94b846c">https://dapp.dfohub.com/?staking=0xb266252Fd70D253b4330151A96694d35e94b846c</a>

The UniFi Liquidity Staking Mechanism is designed to reward those who lock up Uniswap V2 liquidity for the long term.

Staking will inflate the supply over the first year (if every tier is completely filled) by 918,000 $UniFi (1% of the supply).

The Five Year tier was filled by the team in an early test, and we won't touch the rewards for three years. When they are unlocked and redeemed, 50% of the UniFi will be sent to the UniFi wallet and 50% to the NERV operations wallet.

# UniFi Earning System

The UniFi DFO earn from:

- The uSD positive rebalance (the trading fees of Uniswap collateralized stablecoins)
- The 0.1% in Uniswap Pool Tokens taxed by crafting Programmable Liquidity

As an on-chain company, UniFi's value will be backed by these earnings, and by the core of Flexible Organizations, totally ruled in code and assets by tokens, without any chance of external manipulation.
