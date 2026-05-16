import { AwardRepository } from '@/repositories/award.repository';

export const WinningBidResultsService = {
  async getWinningResults() {
    try {
      const results = await AwardRepository.getWinningResults();
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error fetching winning results:', error);
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
