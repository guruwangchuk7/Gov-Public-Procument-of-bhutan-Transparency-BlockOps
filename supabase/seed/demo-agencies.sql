-- Seed Agency with Bhutan NDI demo identity
-- ID Number: 10709004662, DOB: 25/12/2003
INSERT INTO agencies (agency_name, email, registration_number, ndi_identifier, wallet_address, status, blockchain_authorized)
VALUES (
    'Department of Procurement', 
    'procurement@gov.bt', 
    'PA-NDI-001', 
    '10709004662', 
    '0x996031d5527d8115AcCfC92015EF34BFA9A7f319', 
    'approved', 
    true
)
ON CONFLICT (email) DO UPDATE 
SET ndi_identifier = EXCLUDED.ndi_identifier,
    wallet_address = EXCLUDED.wallet_address,
    status = EXCLUDED.status,
    blockchain_authorized = EXCLUDED.blockchain_authorized;
