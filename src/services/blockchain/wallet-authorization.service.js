import { RabbyWallet } from '@/lib/wallet/rabby';
import { SepoliaGuard } from '@/lib/wallet/sepolia-guard';
import { BGPSContract } from '@/lib/blockchain/contract';
import { BlockchainEventService } from './blockchain-event.service';
import { EventParser } from '@/lib/blockchain/event-parser';

/**
 * Service for authorizing Agency and Supplier wallets on the blockchain.
 */
export const WalletAuthorizationService = {
  /**
   * Authorizes an Agency wallet on-chain.
   * Only callable by an Admin Operator.
   */
  async authorizeAgencyWallet({ agency_id, agency_wallet, proof_hash }) {
    if (process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'mock') {
      return this._mockResponse('AgencyWalletAuthorized', { agency_id, wallet: agency_wallet, hash: proof_hash });
    }

    try {
      await RabbyWallet.connect();
      await SepoliaGuard.ensureSepolia();

      const contract = await BGPSContract.getWithSigner();
      const tx = await contract.authorizeAgency(agency_wallet, proof_hash);
      
      const pendingEvent = BlockchainEventService.createPendingEvent({
        event_name: 'AgencyWalletAuthorized',
        tx_hash: tx.hash,
        related_agency_id: agency_id,
        payload_hash: proof_hash
      });

      const receipt = await tx.wait();
      return BlockchainEventService.markConfirmed(pendingEvent, receipt);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Authorizes a Supplier wallet on-chain.
   * Only callable by an Admin Operator.
   */
  async authorizeSupplierWallet({ supplier_id, supplier_wallet, proof_hash }) {
    if (process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'mock') {
      return this._mockResponse('SupplierWalletAuthorized', { supplier_id, wallet: supplier_wallet, hash: proof_hash });
    }

    try {
      await RabbyWallet.connect();
      await SepoliaGuard.ensureSepolia();

      const contract = await BGPSContract.getWithSigner();
      const tx = await contract.authorizeSupplier(supplier_wallet, proof_hash);
      
      const pendingEvent = BlockchainEventService.createPendingEvent({
        event_name: 'SupplierWalletAuthorized',
        tx_hash: tx.hash,
        related_supplier_id: supplier_id,
        payload_hash: proof_hash
      });

      const receipt = await tx.wait();
      return BlockchainEventService.markConfirmed(pendingEvent, receipt);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Internal helper for mock responses.
   */
  async _mockResponse(eventName, data) {
    console.log(`[Mock Blockchain] ${eventName}:`, data);
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
