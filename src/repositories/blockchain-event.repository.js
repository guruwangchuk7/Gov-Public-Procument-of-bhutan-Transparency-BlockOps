import { createClient } from '@/lib/supabase/server';

export const blockchainEventRepository = {
  /**
   * Logs a new blockchain event as pending.
   */
  async createPendingEvent({ eventName, txHash, walletAddress, relatedEntityId, entityType }) {
    const supabase = createClient();
    const data = {
      event_name: eventName,
      tx_hash: txHash,
      wallet_address: walletAddress,
      tx_status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Dynamically set the related ID field based on entity type
    if (entityType === 'agency') data.related_agency_id = relatedEntityId;
    if (entityType === 'supplier') data.related_supplier_id = relatedEntityId;
    if (entityType === 'tender') data.related_tender_id = relatedEntityId;
    if (entityType === 'bid') data.related_bid_id = relatedEntityId;
    if (entityType === 'award') data.related_award_id = relatedEntityId;

    const { data: inserted, error } = await supabase
      .from('blockchain_events')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return inserted;
  },

  /**
   * Updates an event status to confirmed or failed.
   */
  async updateEventStatus(txHash, { status, blockNumber, errorMessage }) {
    const supabase = createClient();
    const updateData = {
      tx_status: status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
      if (blockNumber) updateData.block_number = blockNumber;
    } else if (status === 'failed') {
      updateData.failed_at = new Date().toISOString();
      if (errorMessage) updateData.error_message = errorMessage;
    }

    const { data, error } = await supabase
      .from('blockchain_events')
      .update(updateData)
      .eq('tx_hash', txHash)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
