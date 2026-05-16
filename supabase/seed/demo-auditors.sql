-- Seed Auditor with Bhutan NDI demo identity and matching invitation
-- ID Number: 10905006125, DOB: 01/11/2004

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
