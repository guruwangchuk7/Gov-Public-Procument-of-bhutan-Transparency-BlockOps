import { AgencyRepository } from '@/repositories/registration.repository';

export const VerifiedAgenciesService = {
  async getVerifiedAgencies() {
    try {
      const agencies = await AgencyRepository.getVerifiedAgencies();
      return {
        success: true,
        data: agencies
      };
    } catch (error) {
      console.error('Error fetching verified agencies:', error);
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
