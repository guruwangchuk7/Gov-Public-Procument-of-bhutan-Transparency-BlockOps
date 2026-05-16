-- Seed Agency with Bhutan NDI demo identity and approval metadata
-- ID Number: 10709004662, DOB: 25/12/2003

WITH admin_lookup AS (
    SELECT id FROM admins WHERE email = 'admin@bgps.gov.bt' LIMIT 1
)
INSERT INTO agencies (
    agency_name, 
    email, 
    registration_number, 
    ndi_identifier, 
    wallet_address, 
    status, 
    blockchain_authorized,
    verified_at,
    verified_by_admin_id
)
VALUES (
    'Department of Procurement', 
    'procurement@gov.bt', 
    'PA-NDI-001', 
    '10709004662', 
    '0x996031d5527d8115AcCfC92015EF34BFA9A7f319', 
    'approved', 
    true,
    NOW() - INTERVAL '2 days',
    (SELECT id FROM admin_lookup)
)
ON CONFLICT (email) DO UPDATE 
SET ndi_identifier = EXCLUDED.ndi_identifier,
    wallet_address = EXCLUDED.wallet_address,
    status = EXCLUDED.status,
    blockchain_authorized = EXCLUDED.blockchain_authorized,
    verified_at = EXCLUDED.verified_at,
    verified_by_admin_id = EXCLUDED.verified_by_admin_id;
