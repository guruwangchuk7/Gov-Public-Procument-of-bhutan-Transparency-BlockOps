/**
 * Parser for BGPS smart contract events.
 * Converts raw transaction receipts into ERD-aligned blockchain event payloads.
 */
export const EventParser = {
  /**
   * General parser for all BGPS events.
   * Extracts data from the logs based on the event name.
   */
  parseReceipt(receipt, eventName) {
    if (!receipt || !receipt.logs) return null;

    // Find the log that matches our event name
    // In a real implementation, we would use the contract interface to parse logs
    // For this prototype, we'll assume the receipt data is structured
    
    const eventLog = receipt.logs.find(log => log.eventName === eventName) || receipt.logs[0];
    const args = eventLog?.args || {};

    return {
      event_name: eventName,
      tx_status: receipt.status === 1 ? 'confirmed' : 'failed',
      contract_address: receipt.to,
      tx_hash: receipt.hash,
      block_number: receipt.blockNumber,
      wallet_address: receipt.from,
      // Related IDs are typically passed in as context or found in args
      related_agency_id: args.agencyId || null,
      related_supplier_id: args.supplierId || null,
      related_tender_id: args.tenderId?.toString() || null,
      related_bid_id: args.bidId?.toString() || null,
      related_award_id: args.awardId?.toString() || null,
      payload_hash: args.proofHash || args.tenderHash || args.bidHash || args.justificationHash || null,
      error_message: receipt.status === 0 ? 'Transaction execution failed' : null,
      created_at: new Date().toISOString(),
      confirmed_at: receipt.status === 1 ? new Date().toISOString() : null,
      failed_at: receipt.status === 0 ? new Date().toISOString() : null
    };
  }
};
