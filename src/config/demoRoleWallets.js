export const DEMO_ROLE_WALLETS = {
  admin: {
    roleLabel: "System Admin",
    demoName: "Dorji Sonam",
    expectedWallet: "0xaC577ADaC20fDF2EFB428Dd6274CE84024Fd3a39",
    shortWallet: "0xaC57...3a39",
    network: "Ethereum Sepolia"
  },
  auditor: {
    roleLabel: "System Auditor",
    demoName: "Guru Wangchuk",
    expectedWallet: "0x0f6cD5787b5b2c9D5F88401B83062d63c407A2FD",
    shortWallet: "0x0f6c...A2FD",
    network: "Ethereum Sepolia"
  },
  supplier: {
    roleLabel: "Supplier / Bidder",
    demoName: "Karma Wangchuk",
    expectedWallet: "0xA7BFf7d4C90BB06292B30F4A69C896Ad7b781c82",
    shortWallet: "0xA7BF...1c82",
    network: "Ethereum Sepolia"
  },
  agency: {
    roleLabel: "Procuring Agency",
    demoName: "Ngawang Gyeltshen",
    expectedWallet: "0x996031d5527d8115AcCfC92015EF34BFA9A7f319",
    shortWallet: "0x9960...f319",
    network: "Ethereum Sepolia"
  }
};

export const getRoleWalletConfig = (role) => {
  if (!role) return null;
  const r = role.toLowerCase();
  if (r.includes('admin')) return DEMO_ROLE_WALLETS.admin;
  if (r.includes('audit')) return DEMO_ROLE_WALLETS.auditor;
  if (r.includes('supplier') || r.includes('bidder')) return DEMO_ROLE_WALLETS.supplier;
  if (r.includes('agency') || r.includes('procuring')) return DEMO_ROLE_WALLETS.agency;
  return null;
};
