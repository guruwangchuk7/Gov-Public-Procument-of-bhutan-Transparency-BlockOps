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
      
      // The response structure from the NDI API verifier/v1/proof-request?threadId=...
      // contains the state of the proof request.
      const data = response.data;
      
      let status = 'pending';
      let profile = null;

      if (data.presentation && data.presentation.verification_result === "ProofValidated") {
        status = 'ProofValidated';
        const revealedAttrs = data.presentation.requested_presentation?.revealed_attrs || {};
        
        // Extract attributes
        const attrs = {};
        for (const [key, value] of Object.entries(revealedAttrs)) {
          const item = Array.isArray(value) ? value[0] : value;
          attrs[key] = item?.value ?? null;
        }

        profile = {
          fullName: attrs["Full Name"] || attrs["FullName"],
          idNumber: attrs["ID Number"] || attrs["ID No"] || attrs["IDNumber"],
          idType: attrs["ID Type"] || attrs["IDType"],
          gender: attrs["Gender"],
          dateOfBirth: attrs["Date of Birth"] || attrs["DOB"] || attrs["DateOfBirth"],
          relationshipDid: data.presentation.relationship_did || null,
          holderDid: data.presentation.holder_did || null,
        };
      } else if (data.state === 'request_sent') {
        status = 'requested';
      } else if (data.state === 'presentation_received') {
        status = 'processing';
      } else if (data.presentation && data.presentation.verification_result === "ProofFailed") {
        status = 'ProofRejected';
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

