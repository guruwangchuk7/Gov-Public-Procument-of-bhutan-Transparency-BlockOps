import { VerifiedAgenciesService } from './verified-agencies.service';
import { VerifiedSuppliersService } from './verified-suppliers.service';
import { VerifiedAuditorsService } from './verified-auditors.service';
import { WinningBidResultsService } from './winning-bid-results.service';

export const PublicNotificationService = {
  async getNotifications() {
    try {
      const [agencies, suppliers, auditors, awards] = await Promise.all([
        VerifiedAgenciesService.getVerifiedAgencies(),
        VerifiedSuppliersService.getVerifiedSuppliers(),
        VerifiedAuditorsService.getVerifiedAuditors(),
        WinningBidResultsService.getWinningResults()
      ]);

      return {
        success: true,
        data: {
          verified_agencies: agencies.data || [],
          verified_suppliers: suppliers.data || [],
          verified_auditors: auditors.data || [],
          winning_bid_results: awards.data || []
        }
      };
    } catch (error) {
      console.error('Error fetching public notifications:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error.message
        }
      };
    }
  }
};
