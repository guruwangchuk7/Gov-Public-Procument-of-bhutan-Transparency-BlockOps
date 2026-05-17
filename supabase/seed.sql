-- Seed Admin with Bhutan NDI demo identity
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

-- Seed Agency with Bhutan NDI demo identity and approval metadata
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

-- Seed Supplier with Bhutan NDI demo identity and approval metadata
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

-- Seed Auditor with Bhutan NDI demo identity and matching invitation
WITH admin_lookup AS (
    SELECT id FROM admins WHERE email = 'admin@bgps.gov.bt' LIMIT 1
),
upsert_invitation AS (
    INSERT INTO auditor_invitations (
        auditor_name, 
        auditor_email, 
        temporary_username, 
        temporary_password_hash, 
        invitation_token, 
        status, 
        expires_at, 
        used_at, 
        created_by_admin_id
    )
    VALUES (
        'Guru Wangchuk', 
        'guru.wangchuk@audit.gov.bt', 
        'auditor_guru', 
        'seeded_placeholder_hash', 
        'GURU-INV-TOKEN-2026', 
        'used', 
        NOW() + INTERVAL '1 year', 
        NOW() - INTERVAL '1 day', 
        (SELECT id FROM admin_lookup)
    )
    ON CONFLICT (invitation_token) DO UPDATE 
    SET status = EXCLUDED.status,
        used_at = EXCLUDED.used_at,
        auditor_name = EXCLUDED.auditor_name,
        auditor_email = EXCLUDED.auditor_email
    RETURNING id
)
INSERT INTO auditors (
    full_name, 
    email, 
    ndi_identifier, 
    wallet_address, 
    is_active, 
    activated_at, 
    invitation_id
)
VALUES (
    'Guru Wangchuk', 
    'guru.wangchuk@audit.gov.bt', 
    '10905006125', 
    '0x0f6cD5787b5b2c9D5F88401B83062d63c407A2FD', 
    true, 
    NOW() - INTERVAL '1 day', 
    (SELECT id FROM upsert_invitation)
)
ON CONFLICT (email) DO UPDATE 
SET invitation_id = EXCLUDED.invitation_id,
    activated_at = EXCLUDED.activated_at,
    ndi_identifier = EXCLUDED.ndi_identifier,
    wallet_address = EXCLUDED.wallet_address,
    is_active = EXCLUDED.is_active;
