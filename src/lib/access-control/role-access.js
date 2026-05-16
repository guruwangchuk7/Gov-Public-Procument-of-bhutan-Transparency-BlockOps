import { NDIVerifier } from '@/lib/ndi/ndi-verifier';
import { WalletLinking } from '@/lib/wallet/wallet-linking';

/**
 * Central logic for resolving role-based access based on NDI and Wallet.
 */
export async function resolveRoleAccess({
  selected_role,
  ndi_profile,
  wallet_address,
  mock_records = [] // Can be passed for demo mode
}) {
  if (!selected_role) return { allowed: false, status: 'denied', reason: 'No role selected' };

  // Public Citizen is always allowed without NDI/Wallet
  if (selected_role === 'Public_Citizen') {
    return {
      allowed: true,
      status: 'allowed',
      redirect_target: '/transparency'
    };
  }

  // All other roles MUST have NDI and Wallet
  if (!ndi_profile || !wallet_address) {
    let target = '/select-role';
    if (selected_role === 'Admin') target = '/admin/login';
    if (selected_role === 'Procuring_Agency') target = '/agency/login';
    if (selected_role === 'Supplier_Bidder') target = '/supplier/login';
    if (selected_role === 'Auditor') target = '/auditor/login';

    return {
      allowed: false,
      status: 'denied',
      reason: 'NDI and Wallet linking required',
      redirect_target: target
    };
  }

  const ndi_id = NDIVerifier.extractNDIIdentifierFromProof(ndi_profile);
  const normalized_wallet = WalletLinking.normalizeWalletAddress(wallet_address);

  // Real backend verification
  let record = null;
  try {
    const res = await fetch('/api/auth/resolve-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selected_role,
        ndi_identifier: ndi_id,
        wallet_address: normalized_wallet
      })
    });
    const data = await res.json();
    if (data.success) {
      record = data.record;
    } else {
      return {
        allowed: false,
        status: 'denied',
        reason: data.error || 'Access denied',
        redirect_target: selected_role === 'Admin' ? '/admin/login' :
          selected_role === 'Auditor' ? '/auditor/login' :
            selected_role === 'Procuring_Agency' ? '/agency/login' : '/supplier/login'
      };
    }
  } catch (err) {
    console.error('Failed to resolve role access:', err);
  }

  // 1. Admin Logic
  if (selected_role === 'Admin') {
    if (record && record.is_active) {
      return { allowed: true, status: 'allowed', role_record: record, redirect_target: '/admin/dashboard' };
    }
    return { allowed: false, status: 'denied', reason: 'Account not found or not active as Admin', redirect_target: '/admin/login' };
  }

  // 2. Agency Logic
  if (selected_role === 'Procuring_Agency') {
    if (!record) {
      return { allowed: false, status: 'registration_required', redirect_target: '/agency/register' };
    }
    if (record.status === 'pending') {
      return { allowed: false, status: 'pending', redirect_target: '/agency/pending' };
    }
    if (record.status === 'approved' && record.blockchain_authorized) {
      return { allowed: true, status: 'allowed', role_record: record, redirect_target: '/agency/dashboard' };
    }
    if (record.status === 'approved' && !record.blockchain_authorized) {
      return { allowed: false, status: 'pending', reason: 'Awaiting Blockchain Authorization' };
    }
    return { allowed: false, status: 'blocked', reason: 'Access to this agency is blocked', redirect_target: '/agency/login' };
  }

  // 3. Supplier Logic
  if (selected_role === 'Supplier_Bidder') {
    if (!record) {
      return { allowed: false, status: 'registration_required', redirect_target: '/supplier/register' };
    }
    if (record.status === 'pending') {
      return { allowed: false, status: 'pending', redirect_target: '/supplier/pending' };
    }
    if (record.status === 'approved' && record.blockchain_authorized) {
      return { allowed: true, status: 'allowed', role_record: record, redirect_target: '/supplier/dashboard' };
    }
    return { allowed: false, status: 'blocked', reason: 'Access to this supplier is blocked', redirect_target: '/supplier/login' };
  }

  // 4. Auditor Logic
  if (selected_role === 'Auditor') {
    if (record && record.is_active) {
      return { allowed: true, status: 'allowed', role_record: record, redirect_target: '/auditor/dashboard' };
    }
    return { allowed: false, status: 'denied', reason: 'Account not found or not active as Auditor', redirect_target: '/auditor/login' };
  }

  return { allowed: false, status: 'denied', reason: 'Unknown role or error' };
}
