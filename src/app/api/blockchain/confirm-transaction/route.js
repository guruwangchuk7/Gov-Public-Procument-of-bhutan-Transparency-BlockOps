import { NextResponse } from 'next/server';
import { SepoliaProvider } from '@/lib/blockchain/sepolia-provider';

/**
 * API Route to verify a transaction status on-chain.
 */
export async function POST(request) {
  try {
    const { tx_hash } = await request.json();

    if (!tx_hash) {
      return NextResponse.json({ error: 'Missing transaction hash' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'mock') {
      return NextResponse.json({
        tx_hash,
        status: 'confirmed',
        message: 'Mock transaction verified'
      });
    }

    const provider = SepoliaProvider.getProvider();
    const receipt = await provider.getTransactionReceipt(tx_hash);

    if (!receipt) {
      return NextResponse.json({
        tx_hash,
        status: 'pending',
        message: 'Transaction not found or still pending'
      });
    }

    return NextResponse.json({
      tx_hash,
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      block_number: receipt.blockNumber,
      receipt
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
