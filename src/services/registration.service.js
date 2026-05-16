import { AgencyRepository, SupplierRepository } from '@/repositories/registration.repository';
import { DocumentRepository, ActivityLogRepository } from '@/repositories/audit.repository';
import { sendEmail } from '@/lib/email/smtp';

export const AgencyRegistrationService = {
  async register(formData, documentData) {
    // 1. Create Agency
    const agency = await AgencyRepository.create({
      ...formData,
      status: 'pending',
      blockchain_authorized: false
    });

    // 2. Link Document if provided
    if (documentData) {
      await DocumentRepository.create({
        ...documentData,
        agency_id: agency.id,
        document_type: 'agency_registration'
      });
    }

    // 3. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Procuring_Agency',
      action: 'Agency registration submitted',
      entity_type: 'agency',
      entity_id: agency.id,
      details: `Agency ${agency.agency_name} submitted registration request.`
    });

    // 4. Send Confirmation Email to Agency
    await sendEmail({
      to: agency.email,
      subject: 'BGPS Registration Received - Pending Review',
      message: `Dear ${agency.agency_name},\n\nYour registration request for the BGPS platform has been received and is currently under review by the system administrator.`,
      senderRole: 'ADMIN'
    });

    // 5. Notify Admin
    await sendEmail({
      to: '12220064.gcit@rub.edu.bt',
      subject: 'ACTION REQUIRED: New Agency Registration',
      message: `A new agency has registered on BGPS:\n\nName: ${agency.agency_name}\nEmail: ${agency.email}\nReg No: ${agency.registration_number}\n\nPlease log in to the Admin Dashboard to review and approve.`,
      senderRole: 'SYSTEM'
    });

    return agency;
  }
};

export const SupplierRegistrationService = {
  async register(formData, documentData) {
    // 1. Create Supplier
    const supplier = await SupplierRepository.create({
      ...formData,
      status: 'pending',
      blockchain_authorized: false
    });

    // 2. Link Document if provided
    if (documentData) {
      await DocumentRepository.create({
        ...documentData,
        supplier_id: supplier.id,
        document_type: 'supplier_registration'
      });
    }

    // 3. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Supplier_Bidder',
      action: 'Supplier registration submitted',
      entity_type: 'supplier',
      entity_id: supplier.id,
      details: `Supplier ${supplier.company_name} submitted registration request.`
    });

    // 4. Send Confirmation Email to Supplier
    await sendEmail({
      to: supplier.email,
      subject: 'BGPS Supplier Registration Received',
      message: `Dear ${supplier.company_name},\n\nThank you for registering as a supplier on the BGPS platform. Your registration is now pending administrative review.`,
      senderRole: 'ADMIN'
    });

    // 5. Notify Admin
    await sendEmail({
      to: '12220064.gcit@rub.edu.bt',
      subject: 'ACTION REQUIRED: New Supplier Registration',
      message: `A new supplier has registered on BGPS:\n\nName: ${supplier.company_name}\nEmail: ${supplier.email}\nLicense No: ${supplier.license_number}\n\nPlease log in to the Admin Dashboard to review and approve.`,
      senderRole: 'SYSTEM'
    });

    return supplier;
  }
};
