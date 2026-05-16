-- Seed Admin with Bhutan NDI demo identity
-- ID Number: 1234, DOB: 19/07/1995
INSERT INTO admins (full_name, email, ndi_identifier, wallet_address, is_active)
VALUES (
    'Dorji Sonam', 
    'admin@bgps.gov.bt', 
    '1234', 
    '0xaC577ADaC20fDF2EFB428Dd6274CE84024Fd3a39', 
    true
)
ON CONFLICT (email) DO UPDATE 
SET ndi_identifier = EXCLUDED.ndi_identifier, 
    wallet_address = EXCLUDED.wallet_address;
