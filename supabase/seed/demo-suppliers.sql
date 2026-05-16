-- Seed Supplier with Bhutan NDI demo identity and approval metadata
-- ID Number: 10205005922, DOB: 25/02/2003

WITH admin_lookup AS (
    SELECT id FROM admins WHERE email = 'admin@bgps.gov.bt' LIMIT 1
)
INSERT INTO suppliers (
    company_name, 
    email, 
    license_number, 
    ndi_identifier, 
    wallet_address, 
    status, 
    blockchain_authorized,
    verified_at,
    verified_by_admin_id
)
VALUES (
    'Karma Construction Solutions', 
    'karma@business.bt', 
    'LIC-NDI-99', 
    '10205005922', 
    '0xA7BFf7d4C90BB06292B30F4A69C896Ad7b781c82', 
    'approved', 
    true,
    NOW() - INTERVAL '3 days',
    (SELECT id FROM admin_lookup)
)
ON CONFLICT (email) DO UPDATE 
SET ndi_identifier = EXCLUDED.ndi_identifier,
    wallet_address = EXCLUDED.wallet_address,
    status = EXCLUDED.status,
    blockchain_authorized = EXCLUDED.blockchain_authorized,
    verified_at = EXCLUDED.verified_at,
    verified_by_admin_id = EXCLUDED.verified_by_admin_id;
