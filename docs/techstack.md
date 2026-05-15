Core Technology Stack

  | Area | Technology | Purpose |
  |---|---|---|
  | Frontend | Next.js 16 + React 19 + JS (JSDoc) | Builds the dashboards, portals, and forms with premium monochromatic styling |

  | Backend | Next.js API Routes | Handles server-side actions without a separate backend server |
  | Identity | Bhutan NDI | Verifies real digital identity of users such as agencies, suppliers, auditors,
  and citizens |
  | Wallet | Rabby Wallet | Connects user wallet address and confirms blockchain transactions |
  | Blockchain Network | Ethereum Sepolia | Test network used to record tender, bid, approval, and award
  proofs |
  | Blockchain Language | Solidity 0.8.19 | Used to write smart contracts |
  | Smart Contract Framework | Hardhat | Used to compile, test, deploy, and verify smart contracts |
  | Blockchain JS Library | Ethers.js | Connects the Next.js app to Rabby Wallet and smart contracts |
  | Database | Supabase PostgreSQL | Stores users, roles, tenders, bids, approvals, audit logs, and
  transaction hashes |
  | Authentication Sessions | Supabase Auth | Manages app sessions after identity verification |
  | Database Security | Supabase Row Level Security | Controls which user can access which data |
  | File Storage | Supabase Storage | Stores tender documents, bid documents, and supplier documents |
  | Deployment | Vercel | Deploys the Next.js web application |
  | Blockchain Explorer | Etherscan | Verifies deployed contracts and shows Sepolia transaction proof |