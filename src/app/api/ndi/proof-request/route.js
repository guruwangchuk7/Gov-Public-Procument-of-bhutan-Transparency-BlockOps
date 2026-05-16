import { NextResponse } from 'next/server';

const AUTH_BASE = process.env.NDI_AUTH_BASE || "https://staging.bhutanndi.com";
const API_BASE = process.env.NDI_API_BASE || "https://demo-client.bhutanndi.com";
const CLIENT_ID = process.env.NDI_CLIENT_ID;
const CLIENT_SECRET = process.env.NDI_CLIENT_SECRET;
const FOUNDATIONAL_SCHEMA = process.env.NDI_FOUNDATIONAL_SCHEMA;

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
    throw new Error("NDI authentication failed");
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
  return accessToken;
}

export async function POST() {
  try {
    const token = await getToken();
    
    const response = await fetch(`${API_BASE}/verifier/v1/proof-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proofName: "Login to BGPS",
        proofAttributes: [
          { name: "Full Name", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
          { name: "ID Number", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
          { name: "Date of Birth", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
        ],
        purpose: "login",
        authenticationLevel: "Standard",
        isShortenUrl: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create proof request");
    }

    const result = await response.json();
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('NDI Proof Request Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
