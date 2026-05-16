import { RabbyWallet } from '@/lib/wallet/rabby';
import { SepoliaGuard } from '@/lib/wallet/sepolia-guard';
import { BGPSContract } from '@/lib/blockchain/contract';
import { BlockchainEventService } from './blockchain-event.service';

/**
 * Service for recording Bid proof on the blockchain.
 */
export const BidChainService = {
  async recordBidOnChain({ tender_id, bid_id, bid_hash }) {
    if (process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'mock') {
      return this._mockResponse('BidSubmitted', { tender_id, bid_id, hash: bid_hash });
    }

    try {
      await RabbyWallet.connect();
      await SepoliaGuard.ensureSepolia();

      const contract = await BGPSContract.getWithSigner();
      const tx = await contract.recordBidHash(tender_id, bid_id, bid_hash);
      
      const pendingEvent = BlockchainEventService.createPendingEvent({
        event_name: 'BidSubmitted',
        tx_hash: tx.hash,
        related_tender_id: tender_id,
        related_bid_id: bid_id,
        payload_hash: bid_hash
      });

      const receipt = await tx.wait();
      return BlockchainEventService.markConfirmed(pendingEvent, receipt);
    } catch (error) {
      throw error;
    }
  },

  async _mockResponse(eventName, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          event_name: eventName,
          tx_status: 'confirmed',
          tx_hash: '0x' + Math.random().toString(16).slice(2, 66),
          block_number: Math.floor(Math.random() * 1000000),
          payload_hash: data.hash,
          confirmed_at: new Date().toISOString()
        });
      }, 2000);
    });
  }
};
