import "dotenv/config";

import crypto from "node:crypto";
import express from "express";
import * as nats from "nats";
import QRCode from "qrcode";

const PORT = Number(process.env.PORT || 3100);
const AUTH_BASE = process.env.NDI_AUTH_BASE || "https://staging.bhutanndi.com";
const API_BASE = process.env.NDI_API_BASE || "https://demo-client.bhutanndi.com";
const CLIENT_ID = process.env.NDI_CLIENT_ID || "3tq7ho23g5risndd90a76jre5f";
const CLIENT_SECRET =
  process.env.NDI_CLIENT_SECRET ||
  "111rvn964mucumr6c3qq3n2poilvq5v92bkjh58p121nmoverquh";
const FOUNDATIONAL_SCHEMA =
  process.env.NDI_FOUNDATIONAL_SCHEMA ||
  "https://dev-schema.ngotag.com/schemas/c7952a0a-e9b5-4a4b-a714-1e5d0a1ae076";
const NATS_WSS = process.env.NDI_NATS_WSS || "wss://natsdemoclient.bhutanndi.com";
const NATS_NKEY_SEED =
  process.env.NDI_NATS_NKEY_SEED ||
  "SUAPXY7TJFUFE3IX3OEMSLE3JFZJ3FZZRSRSOGSG2ANDIFN77O2MIBHWUM";

const app = express();
const sessions = new Map();
let accessToken = null;
let tokenExpiresAt = 0;
let natsConnection = null;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

app.get("/admin", (_req, res) => {
  res.sendFile(new URL("./public/admin.html", import.meta.url).pathname);
});

app.get("/user", (_req, res) => {
  res.sendFile(new URL("./public/user.html", import.meta.url).pathname);
});

app.post("/api/ndi/login", async (_req, res, next) => {
  try {
    const proof = await createProofRequest();
    const threadId = proof.proofRequestThreadId;
    const qrDataUrl = await QRCode.toDataURL(proof.proofRequestURL, {
      margin: 2,
      width: 280,
      errorCorrectionLevel: "M",
    });

    sessions.set(threadId, {
      id: crypto.randomUUID(),
      threadId,
      status: "proofInvitationCreated",
      proof,
      qrDataUrl,
      user: null,
      rawResult: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.json({
      threadId,
      proofRequestURL: proof.proofRequestURL,
      deepLinkURL: proof.deepLinkURL,
      qrDataUrl,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/ndi/session/:threadId", async (req, res) => {
  const session = sessions.get(req.params.threadId);
  if (!session) {
    res.status(404).json({ error: "unknown_thread" });
    return;
  }

  res.json({
    threadId: session.threadId,
    status: session.status,
    verified: session.status === "verified",
    user: session.user,
    role: session.role || null,
    redirectTo: session.redirectTo || null,
    updatedAt: session.updatedAt,
  });
});

app.get("/api/ndi/proof-status/:threadId", async (req, res, next) => {
  try {
    res.json(await ndiRequest("GET", `/verifier/v1/proof-request?threadId=${encodeURIComponent(req.params.threadId)}`));
  } catch (error) {
    next(error);
  }
});

app.post("/oauth/token", (req, res) => {
  const clientId = process.env.NDI_WEBHOOK_CLIENT_ID || "bhutan-ndi-login-demo";
  const clientSecret = process.env.NDI_WEBHOOK_CLIENT_SECRET || "change-me";
  if (req.body.client_id !== clientId || req.body.client_secret !== clientSecret) {
    res.status(401).json({ error: "invalid_client" });
    return;
  }
  res.json({ access_token: clientSecret, expires_in: 3600, token_type: "Bearer" });
});

app.post("/ndi-webhook", (req, res) => {
  const expected = process.env.NDI_WEBHOOK_CLIENT_SECRET || "change-me";
  if (req.headers.authorization !== `Bearer ${expected}`) {
    res.sendStatus(401);
    return;
  }
  routeNdiPayload(req.body, "webhook");
  res.json({ ok: true });
});

app.post("/api/ndi/register-webhook", async (req, res, next) => {
  try {
    const baseUrl = process.env.NDI_WEBHOOK_BASE_URL || req.body.baseUrl;
    if (!baseUrl) {
      res.status(400).json({ error: "missing_base_url" });
      return;
    }
    const webhookId = process.env.NDI_WEBHOOK_ID || "bhutan-ndi-login-demo";
    const result = await ndiRequest("POST", "/webhook/v1/register", {
      webhookId,
      webhookURL: `${baseUrl.replace(/\/$/, "")}/ndi-webhook`,
      authentication: {
        type: "OAuth2",
        version: "v1",
        data: {
          url: `${baseUrl.replace(/\/$/, "")}/oauth/token`,
          grant_type: "client_credentials",
          client_id: process.env.NDI_WEBHOOK_CLIENT_ID || "bhutan-ndi-login-demo",
          client_secret: process.env.NDI_WEBHOOK_CLIENT_SECRET || "change-me",
        },
      },
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "server_error",
    detail: err.detail,
  });
});

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Bhutan NDI login demo: http://localhost:${PORT}`);
  await connectNats();
});

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

  const text = await response.text();
  const data = safeJson(text);
  if (!response.ok) {
    throw httpError(response.status, "NDI authentication failed", data || text);
  }

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

  const text = await response.text();
  const data = safeJson(text);
  if (!response.ok) {
    throw httpError(response.status, `NDI ${method} ${path} failed`, data || text);
  }
  return data;
}

async function createProofRequest() {
  const response = await ndiRequest("POST", "/verifier/v1/proof-request", {
    proofName: "Login with Bhutan NDI",
    proofAttributes: [
      { name: "Full Name", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "Gender", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "Bhutanese", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "ID Number", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "ID Type", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "Date of Birth", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "Dzongkhag", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
      { name: "Gewog", restrictions: [{ schema_name: FOUNDATIONAL_SCHEMA }] },
    ],
    purpose: "login",
    authenticationLevel: "Standard",
    isShortenUrl: true,
  });
  return response.data;
}

async function connectNats() {
  try {
    natsConnection = await nats.connect({
      servers: [NATS_WSS],
      authenticator: nats.nkeyAuthenticator(new TextEncoder().encode(NATS_NKEY_SEED)),
    });
    console.log(`Connected to Bhutan NDI NATS: ${NATS_WSS}`);

    const sub = natsConnection.subscribe(">");
    for await (const msg of sub) {
      const payload = safeJson(msg.string());
      if (payload) routeNdiPayload(payload, `nats:${msg.subject}`);
    }
  } catch (error) {
    console.error("NDI NATS connection failed. QR creation still works, but login completion needs NATS or webhook.");
    console.error(error.message);
  }
}

function routeNdiPayload(payload, via) {
  const inner = payload?.data || payload;
  const threadId =
    (typeof payload?.pattern === "string" && sessions.has(payload.pattern) && payload.pattern) ||
    (typeof inner?.thid === "string" && sessions.has(inner.thid) && inner.thid) ||
    (typeof inner?.threadId === "string" && sessions.has(inner.threadId) && inner.threadId) ||
    null;

  if (!threadId) return;
  const session = sessions.get(threadId);
  if (!session || session.status === "verified") return;

  if (inner.type === "present-proof/presentation-result") {
    const attrs = extractRevealedAttrs(inner.requested_presentation?.revealed_attrs || {});
    session.status =
      inner.verification_result === "ProofValidated" ? "verified" : "proof_received";
    session.user = {
      fullName: attrs["Full Name"] || attrs.FullName || attrs.name || null,
      gender: attrs.Gender || null,
      bhutanese: attrs.Bhutanese || null,
      idType: attrs["ID Type"] || null,
      idNumber: attrs["ID Number"] || attrs["ID No"] || null,
      dateOfBirth: attrs["Date of Birth"] || attrs.DOB || null,
      dzongkhag: attrs.Dzongkhag || null,
      gewog: attrs.Gewog || null,
      relationshipDid: inner.relationship_did || inner.relationshipDid || null,
      holderDid: inner.holder_did || null,
    };
    session.role = isAdminIdentity(session.user) ? "admin" : "user";
    session.redirectTo = session.role === "admin" ? "/admin" : "/user";
    session.rawResult = inner;
    session.updatedAt = new Date().toISOString();
    console.log(`NDI login ${session.status} for ${threadId} via ${via}`);
    return;
  }

  session.status = inner.type || session.status;
  session.rawResult = inner;
  session.updatedAt = new Date().toISOString();
}

function extractRevealedAttrs(revealedAttrs) {
  const out = {};
  for (const [key, value] of Object.entries(revealedAttrs)) {
    const item = Array.isArray(value) ? value[0] : value;
    out[key] = item?.value ?? null;
  }
  return out;
}

function isAdminIdentity(user) {
  return (
    sameText(user.fullName, "Dorji Sonam") &&
    sameText(user.gender, "Male") &&
    sameText(user.bhutanese, "Yes") &&
    sameText(user.dateOfBirth, "19/07/1995") &&
    sameText(user.idType, "National ID Card") &&
    sameText(user.idNumber, "1234") &&
    sameText(user.dzongkhag, "Trongsa") &&
    sameText(user.gewog, "Tangsibjee")
  );
}

function sameText(actual, expected) {
  return String(actual || "").trim().toLowerCase() === expected.toLowerCase();
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function httpError(status, message, detail) {
  const error = new Error(message);
  error.status = status;
  error.detail = detail;
  return error;
}
