/**
 * Service for managing the blockchain_events table/state.
 * Synchronizes on-chain transaction data with the application backend.
 */
export const BlockchainEventService = {
  /**
   * Creates a placeholder record for a pending blockchain transaction.
   */
  createPendingEvent(payload) {
    const event = {
      ...payload,
      tx_status: 'pending',
      created_at: new Date().toISOString(),
      confirmed_at: null,
      failed_at: null
    };
    
    console.log('Blockchain [Pending]:', event.event_name, event.tx_hash);
    return event;
  },

  /**
   * Updates an event record to confirmed status based on a receipt.
   */
  markConfirmed(event, receipt) {
    return {
      ...event,
      tx_status: 'confirmed',
      block_number: receipt.blockNumber,
      confirmed_at: new Date().toISOString()
    };
  },

  /**
   * Updates an event record to failed status.
   */
  markFailed(event, error) {
    return {
      ...event,
      tx_status: 'failed',
      error_message: error.message || 'Transaction failed',
      failed_at: new Date().toISOString()
    };
  }
};
