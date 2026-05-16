import { SupplierRepository } from '@/repositories/registration.repository';

export const VerifiedSuppliersService = {
  async getVerifiedSuppliers() {
    try {
      const suppliers = await SupplierRepository.getVerifiedSuppliers();
      return {
        success: true,
        data: suppliers
      };
    } catch (error) {
      console.error('Error fetching verified suppliers:', error);
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
