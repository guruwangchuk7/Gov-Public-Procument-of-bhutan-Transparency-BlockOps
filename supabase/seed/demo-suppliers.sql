-- Seed Supplier with Bhutan NDI demo identity
-- ID Number: 10205005922, DOB: 25/02/2003
INSERT INTO suppliers (company_name, email, license_number, ndi_identifier, wallet_address, status, blockchain_authorized)
VALUES (
    'Karma Construction Solutions', 
    'karma@business.bt', 
    'LIC-NDI-99', 
    '10205005922', 
    '0xA7BFf7d4C90BB06292B30F4A69C896Ad7b781c82', 
    'approved', 
    true
)
ON CONFLICT (email) DO UPDATE 
SET ndi_identifier = EXCLUDED.ndi_identifier,
    wallet_address = EXCLUDED.wallet_address,
    status = EXCLUDED.status,
    blockchain_authorized = EXCLUDED.blockchain_authorized;
