import crypto from 'node:crypto';

const AUTH_BASE = process.env.NDI_AUTH_BASE || "https://staging.bhutanndi.com";
const API_BASE = process.env.NDI_API_BASE || "https://demo-client.bhutanndi.com";
const CLIENT_ID = process.env.NDI_CLIENT_ID;
const CLIENT_SECRET = process.env.NDI_CLIENT_SECRET;
const FOUNDATIONAL_SCHEMA = process.env.NDI_FOUNDATIONAL_SCHEMA || "https://dev-schema.ngotag.com/schemas/c7952a0a-e9b5-4a4b-a714-1e5d0a1ae076";

let accessToken = null;
let tokenExpiresAt = 0;

async function getToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response = await fetch(`${AUTH_BASE}/authentication/v1/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NDI authentication failed: ${text}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + Math.max(60, Number(data.expires_in || 3600) - 300) * 1000;
  return accessToken;
}

async function ndiRequest(method, path, body) {
  const token = await getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NDI ${method} ${path} failed: ${text}`);
  }
  return await response.json();
}

/**
 * Normalizes a status value for consistent comparison.
 */
function normalizeStatus(val) {
  if (!val) return '';
  return val.toString().trim().toLowerCase().replace(/[\s-]/g, '_');
}

/**
 * Production-ready Bhutan NDI Client.
 */
export const NdiClient = {
  /**
   * Creates a proof request for the user to scan.
   */
  async createProofRequest() {
    try {
      const response = await ndiRequest("POST", "/verifier/v1/proof-request", {
        proofName: "Login with Bhutan NDI",
        proofAttributes: [
          { name: "Full Name", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
          { name: "Gender", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
          { name: "ID Number", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
          { name: "ID Type", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
          { name: "Date of Birth", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
        ],
        purpose: "login",
        authenticationLevel: "Standard",
        isShortenUrl: true,
      });

      const proof = response.data;
      return {
        success: true,
        threadId: proof.proofRequestThreadId,
        proofRequestURL: proof.proofRequestURL,
        deepLinkURL: proof.deepLinkURL,
      };
    } catch (error) {
      console.error('NDI Proof Request Error:', error);
      throw new Error('Failed to initialize NDI verification');
    }
  },

  /**
   * Polls the status of a specific proof request using threadId.
   */
  async getProofStatus(threadId) {
    try {
      const response = await ndiRequest("GET", `/verifier/v1/proof-request?threadId=${encodeURIComponent(threadId)}`);
      
      // Handle both {data: ...} and direct object responses
      const data = response.data || response;
      
      let status = 'pending';
      let profile = null;

      // 1. Extract raw status indicators from multiple possible paths
      const rawVerificationResult = data.presentation?.verification_result || data.verification_result || data.proof?.verification_result;
      const rawState = data.state || data.presentation?.state || data.status || data.presentation?.status || data.proof?.status;
      
      const normalizedVerification = normalizeStatus(rawVerificationResult);
      const normalizedState = normalizeStatus(rawState);

      // 2. Define accepted value sets for different lifecycle stages
      const verifiedValues = ['proofvalidated', 'proof_validated', 'verified', 'success', 'validated', 'valid', 'done', 'completed'];
      const pendingValues = ['requested', 'pending', 'processing', 'proof_requested', 'waiting', 'scanned', 'in_progress', 'request_sent', 'presentation_received'];
      const failedValues = ['failed', 'rejected', 'expired', 'error', 'invalid', 'denied', 'prooffailed', 'proof_failed'];

      // 3. Determine the final status based on normalized indicators
      if (verifiedValues.includes(normalizedVerification) || verifiedValues.includes(normalizedState)) {
        status = 'ProofValidated';
        
        // 4. Robust attribute extraction from multiple possible nested structures
        const presentation = data.presentation || data.proof || data;
        const requestedPresentation = presentation.requested_presentation || data.requested_presentation || presentation;
        const revealedAttrs = requestedPresentation.revealed_attrs || requestedPresentation.revealed_attr || requestedPresentation.attributes || data.revealed_attrs || data.attributes || {};
        
        // Helper to extract the actual value from complex attribute objects
        const extractValue = (attr) => {
          if (!attr) return null;
          if (typeof attr !== 'object') return attr;
          return attr.raw ?? attr.value ?? attr.encoded ?? attr.name ?? null;
        };

        const attrs = {};
        for (const [key, value] of Object.entries(revealedAttrs)) {
          const item = Array.isArray(value) ? value[0] : value;
          attrs[key] = extractValue(item);
        }

        profile = {
          fullName: attrs["Full Name"] || attrs["FullName"] || attrs["full_name"] || attrs["Name"] || attrs["name"],
          idNumber: attrs["ID Number"] || attrs["ID No"] || attrs["IDNumber"] || attrs["id_number"] || attrs["Citizenship ID"] || attrs["cid"] || attrs["citizen_id"],
          idType: attrs["ID Type"] || attrs["IDType"] || attrs["id_type"],
          gender: attrs["Gender"] || attrs["gender"],
          dateOfBirth: attrs["Date of Birth"] || attrs["DOB"] || attrs["DateOfBirth"] || attrs["date_of_birth"] || attrs["dob"],
          relationshipDid: presentation.relationship_did || data.relationship_did || null,
          holderDid: presentation.holder_did || data.holder_did || presentation.holder || null,
        };
        
        // Explicitly set the identifier used for matching across the system
        profile.ndi_identifier = profile.idNumber || profile.holderDid || profile.relationshipDid;
      } else if (failedValues.includes(normalizedVerification) || failedValues.includes(normalizedState)) {
        status = 'ProofRejected';
      } else if (pendingValues.includes(normalizedState)) {
        // Distinguish between waiting for scan and verifying the proof
        status = (normalizedState === 'presentation_received' || normalizedState === 'processing') ? 'processing' : 'requested';
      }

      return {
        status,
        profile
      };
    } catch (error) {
      console.error('NDI Status Check Error:', error);
      return { status: 'Error' };
    }
  }
};

