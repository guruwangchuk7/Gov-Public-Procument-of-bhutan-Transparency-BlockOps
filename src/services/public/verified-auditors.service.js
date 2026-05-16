import { AuditorRepository } from '@/repositories/auditor.repository';

export const VerifiedAuditorsService = {
  async getVerifiedAuditors() {
    try {
      const auditors = await AuditorRepository.getVerifiedAuditors();
      return {
        success: true,
        data: auditors
      };
    } catch (error) {
      console.error('Error fetching verified auditors:', error);
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
