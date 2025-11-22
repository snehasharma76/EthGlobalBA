export const CONTRACTS = {
  CREATOR_TOKEN_FACTORY: process.env.NEXT_PUBLIC_CREATOR_TOKEN_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
  TIP_JAR: process.env.NEXT_PUBLIC_TIP_JAR_ADDRESS || '0x0000000000000000000000000000000000000000',
};

export const WORLDCHAIN_SEPOLIA = {
  chainId: 4801,
  name: 'World Chain Sepolia',
  rpcUrl: 'https://worldchain-sepolia.g.alchemy.com/public',
};
