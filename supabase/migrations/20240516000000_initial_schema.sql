-- Enums
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'blocked');
CREATE TYPE tender_status AS ENUM ('draft', 'published', 'closed', 'awarded');
CREATE TYPE bid_status AS ENUM ('submitted', 'on_chain_confirmed', 'under_review', 'rejected', 'winner', 'failed');
CREATE TYPE document_type AS ENUM ('agency_registration', 'supplier_registration', 'tender_document', 'bid_proposal', 'winner_justification');
CREATE TYPE audit_status AS ENUM ('pending', 'verified', 'suspicious');
CREATE TYPE email_status AS ENUM ('pending', 'sent', 'failed');
CREATE TYPE blockchain_event_name AS ENUM ('AgencyWalletAuthorized', 'SupplierWalletAuthorized', 'TenderCreated', 'BidSubmitted', 'WinnerSelected');
CREATE TYPE blockchain_tx_status AS ENUM ('pending', 'confirmed', 'failed');
CREATE TYPE actor_type AS ENUM ('Admin', 'Procuring_Agency', 'Supplier_Bidder', 'Auditor', 'System', 'Public_Citizen');
CREATE TYPE entity_type AS ENUM ('admin', 'agency', 'supplier', 'auditor_invitation', 'auditor', 'tender', 'bid', 'award', 'document', 'blockchain_event', 'audit_report', 'email_notification', 'public_tender_view');
CREATE TYPE invitation_status AS ENUM ('pending', 'used', 'expired');

-- Tables
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    ndi_identifier TEXT UNIQUE,
    wallet_address TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    registration_number TEXT UNIQUE,
    ndi_identifier TEXT UNIQUE,
    wallet_address TEXT UNIQUE,
    status approval_status DEFAULT 'pending',
    rejection_reason TEXT,
    verified_by_admin_id UUID REFERENCES admins(id),
    verified_at TIMESTAMPTZ,
    blockchain_authorized BOOLEAN DEFAULT false,
    authorization_tx_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    license_number TEXT UNIQUE,
    ndi_identifier TEXT UNIQUE,
    wallet_address TEXT UNIQUE,
    status approval_status DEFAULT 'pending',
    rejection_reason TEXT,
    verified_by_admin_id UUID REFERENCES admins(id),
    verified_at TIMESTAMPTZ,
    blockchain_authorized BOOLEAN DEFAULT false,
    authorization_tx_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auditor_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auditor_name TEXT NOT NULL,
    auditor_email TEXT NOT NULL,
    temporary_username TEXT NOT NULL,
    temporary_password_hash TEXT NOT NULL,
    invitation_token TEXT UNIQUE NOT NULL,
    status invitation_status DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_by_admin_id UUID REFERENCES admins(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auditors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID REFERENCES auditor_invitations(id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    ndi_identifier TEXT UNIQUE,
    wallet_address TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    estimated_amount DECIMAL(20, 2),
    submission_deadline TIMESTAMPTZ NOT NULL,
    status tender_status DEFAULT 'draft',
    tender_hash TEXT,
    wallet_confirmed BOOLEAN DEFAULT false,
    blockchain_tx_hash TEXT,
    published_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    bid_amount DECIMAL(20, 2) NOT NULL,
    proposal_summary TEXT,
    bid_hash TEXT,
    wallet_confirmed BOOLEAN DEFAULT false,
    blockchain_tx_hash TEXT,
    status bid_status DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tender_id, supplier_id)
);

CREATE TABLE awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id) NOT NULL,
    winning_bid_id UUID REFERENCES bids(id) NOT NULL,
    winning_supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    awarded_by_agency_id UUID REFERENCES agencies(id) NOT NULL,
    justification TEXT,
    justification_hash TEXT,
    wallet_confirmed BOOLEAN DEFAULT false,
    blockchain_tx_hash TEXT,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id),
    supplier_id UUID REFERENCES suppliers(id),
    tender_id UUID REFERENCES tenders(id),
    bid_id UUID REFERENCES bids(id),
    award_id UUID REFERENCES awards(id),
    document_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    ipfs_hash TEXT,
    document_hash TEXT NOT NULL,
    hash_algorithm TEXT DEFAULT 'SHA-256',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blockchain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name blockchain_event_name NOT NULL,
    tx_status blockchain_tx_status DEFAULT 'pending',
    contract_address TEXT,
    tx_hash TEXT UNIQUE NOT NULL,
    block_number INTEGER,
    wallet_address TEXT,
    related_agency_id UUID REFERENCES agencies(id),
    related_supplier_id UUID REFERENCES suppliers(id),
    related_tender_id UUID REFERENCES tenders(id),
    related_bid_id UUID REFERENCES bids(id),
    related_award_id UUID REFERENCES awards(id),
    payload_hash TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ
);

CREATE TABLE audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auditor_id UUID REFERENCES auditors(id) NOT NULL,
    tender_id UUID REFERENCES tenders(id) NOT NULL,
    bid_id UUID REFERENCES bids(id),
    document_id UUID REFERENCES documents(id),
    blockchain_event_id UUID REFERENCES blockchain_events(id),
    database_hash TEXT,
    blockchain_hash TEXT,
    status audit_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type actor_type NOT NULL,
    actor_id UUID,
    action TEXT NOT NULL,
    entity_type entity_type NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status email_status DEFAULT 'pending',
    related_agency_id UUID REFERENCES agencies(id),
    related_supplier_id UUID REFERENCES suppliers(id),
    related_auditor_invitation_id UUID REFERENCES auditor_invitations(id),
    related_tender_id UUID REFERENCES tenders(id),
    related_bid_id UUID REFERENCES bids(id),
    related_award_id UUID REFERENCES awards(id),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public_tender_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id) NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    verification_clicked BOOLEAN DEFAULT false,
    blockchain_tx_hash TEXT
);
