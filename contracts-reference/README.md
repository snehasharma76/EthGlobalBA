# Smart Contracts Reference

These contracts should be deployed separately using Remix IDE or another deployment tool.

## Deployment Instructions

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new files and paste the contract code
3. Compile with Solidity 0.8.24
4. Deploy to World Chain Sepolia:
   - Network: World Chain Sepolia
   - RPC: https://worldchain-sepolia.g.alchemy.com/public
   - Chain ID: 4801

## Deployment Order

1. **CreatorToken.sol** - This is deployed by the factory, no need to deploy manually
2. **CreatorTokenFactory.sol** - Deploy this first
3. **TipJar.sol** - Deploy this second

## After Deployment

Update the contract addresses in `.env.local`:

```
NEXT_PUBLIC_CREATOR_TOKEN_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_TIP_JAR_ADDRESS=0x...
```

Also add these addresses to the World Developer Portal under Configuration → Advanced → Allowed Contracts.
