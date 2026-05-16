import { NextResponse } from 'next/server';

const AUTH_BASE = process.env.NDI_AUTH_BASE || "https://staging.bhutanndi.com";
const API_BASE = process.env.NDI_API_BASE || "https://demo-client.bhutanndi.com";
const CLIENT_ID = process.env.NDI_CLIENT_ID;
const CLIENT_SECRET = process.env.NDI_CLIENT_SECRET;

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
  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
  return accessToken;
}

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');

  if (!threadId) {
    return NextResponse.json({ error: 'Missing threadId' }, { status: 400 });
  }

  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE}/verifier/v1/proof-request?threadId=${encodeURIComponent(threadId)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch proof status");
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
