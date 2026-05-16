export const ROLES = {
  ADMIN: 'Admin',
  AGENCY: 'Procuring_Agency',
  SUPPLIER: 'Supplier_Bidder',
  AUDITOR: 'Auditor',
  PUBLIC: 'Public_Citizen',
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
};

export const TENDER_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  AWARDED: 'awarded',
};

export const BID_STATUS = {
  SUBMITTED: 'submitted',
  ON_CHAIN_CONFIRMED: 'on_chain_confirmed',
  UNDER_REVIEW: 'under_review',
  REJECTED: 'rejected',
  WINNER: 'winner',
  FAILED: 'failed',
};

export const DOCUMENT_TYPES = {
  AGENCY_REGISTRATION: 'agency_registration',
  SUPPLIER_REGISTRATION: 'supplier_registration',
  TENDER_DOCUMENT: 'tender_document',
  BID_PROPOSAL: 'bid_proposal',
  WINNER_JUSTIFICATION: 'winner_justification',
};

export const BLOCKCHAIN_TX_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
};

export const EMAIL_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
};
