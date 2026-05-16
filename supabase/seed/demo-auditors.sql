-- Seed Auditor with Bhutan NDI demo identity
-- ID Number: 10905006125, DOB: 01/11/2004
INSERT INTO auditors (full_name, email, ndi_identifier, wallet_address, is_active)
VALUES (
    'Guru Wangchuk', 
    'guru.wangchuk@audit.gov.bt', 
    '10905006125', 
    '0x0f6cD5787b5b2c9D5F88401B83062d63c407A2FD', 
    true
)
ON CONFLICT (email) DO UPDATE 
SET ndi_identifier = EXCLUDED.ndi_identifier,
    wallet_address = EXCLUDED.wallet_address,
    is_active = EXCLUDED.is_active;
