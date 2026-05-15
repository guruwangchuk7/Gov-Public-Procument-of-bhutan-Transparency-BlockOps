# Bhutan NDI Login Demo

Simple Express demo for Bhutan NDI passwordless login.

## Run

```bash
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3100`, click **Login with NDI**, then scan the QR with the Bhutan NDI demo wallet.

## How it works

- `POST /api/ndi/login` authenticates against `https://staging.bhutanndi.com`, creates a verifier proof request at `https://demo-client.bhutanndi.com/verifier/v1/proof-request`, and returns a QR code for `proofRequestURL`.
- The server subscribes to Bhutan NDI NATS at `wss://natsdemoclient.bhutanndi.com` and listens for the proof result.
- `GET /api/ndi/session/:threadId` is polled by the page until the NATS proof payload marks the session as verified.
- `POST /ndi-webhook` is included as an optional production-style callback route if you register a public webhook.

The verifier request asks for `Full Name`, `ID Number`, and `Date of Birth` from the public staging Foundational ID schema.
