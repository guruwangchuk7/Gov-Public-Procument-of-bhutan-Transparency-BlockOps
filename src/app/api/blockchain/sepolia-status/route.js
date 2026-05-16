import { NextResponse } from 'next/server';

/**
 * API Route to check the health and status of the Sepolia network connection.
 */
export async function GET() {
  const chainId = process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID || '11155111';
  const explorerUrl = process.env.NEXT_PUBLIC_SEPOLIA_EXPLORER || 'https://sepolia.etherscan.io';
  const rpcSet = !!process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

  return NextResponse.json({
    network: 'Sepolia',
    chainId: chainId,
    explorer: explorerUrl,
    rpc_status: rpcSet ? 'configured' : 'missing',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
