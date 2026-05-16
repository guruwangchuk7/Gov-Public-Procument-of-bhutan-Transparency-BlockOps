-- Demo Seed Data for BGPS Hackathon
-- Note: Replace UUIDs with actual auth.uid() if testing with real accounts

-- 1. Seed Admin
-- Usually handled by Supabase Auth, but we ensure a profile exists
-- INSERT INTO admins (id, full_name, email, is_active) 
-- VALUES ('admin-uuid-here', 'Tashi Wangchuk', 'admin@bgps.bt', true);

-- 2. Seed Agencies
-- Pending Agency
INSERT INTO agencies (agency_name, email, registration_number, status, wallet_address)
VALUES ('Ministry of Works and Transport', 'mowt@gov.bt', 'PA-2026-001', 'pending', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');

-- Approved Agency
INSERT INTO agencies (agency_name, email, registration_number, status, blockchain_authorized, verified_at, wallet_address)
VALUES ('Ministry of Education', 'moe@gov.bt', 'PA-2026-002', 'approved', true, NOW() - INTERVAL '1 day', '0x32Be343B94f860124dC4fEe278FDCBD38C102D88');

-- Rejected Agency
INSERT INTO agencies (agency_name, email, registration_number, status, rejection_reason, verified_at, wallet_address)
VALUES ('Incomplete Dept', 'inc@gov.bt', 'PA-2026-003', 'rejected', 'Missing official registration documents.', NOW() - INTERVAL '2 days', '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');

-- 3. Seed Suppliers
-- Pending Supplier
INSERT INTO suppliers (company_name, email, license_number, status, wallet_address)
VALUES ('Druk Infrastructure Pvt. Ltd.', 'info@drukinfra.bt', 'SP-2026-001', 'pending', '0x1234567890123456789012345678901234567890');

-- Approved Supplier
INSERT INTO suppliers (company_name, email, license_number, status, blockchain_authorized, verified_at, wallet_address)
VALUES ('Thimphu Construction', 'contact@thimphucon.bt', 'SP-2026-002', 'approved', true, NOW() - INTERVAL '5 hours', '0x0987654321098765432109876543210987654321');
