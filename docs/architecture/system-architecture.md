# BGPS Professional System Architecture

## 1. Document Purpose

This document defines the professional system architecture for BGPS, the Blockchain-Based Government Procurement System.

The architecture is based on two core design inputs:

1. The BGPS flowchart, which defines the complete user journey, role-based process, system integrations, and procurement lifecycle.
2. The BGPS ERD, which defines the PostgreSQL database structure, entities, relationships, statuses, blockchain records, audit records, email records, documents, and public view tracking.

This architecture is designed for an international hackathon MVP, while still keeping the system clean enough to later become a real production-ready platform.

---

## 2. System Name

Project Name: BGPS

Full Name: Blockchain-Based Government Procurement System

Main Goal:

BGPS is a role-based procurement transparency system that allows government procurement actions to be recorded, tracked, audited, and publicly verified using database records, document hashes, and Ethereum Sepolia blockchain proof.

---

## 3. Core Architecture Principle

BGPS follows a hybrid architecture:

```text
Off-chain system
+
On-chain proof system
+
Public transparency layer
```

This means:

- Full documents and user data stay off-chain.
- Supabase PostgreSQL stores structured records.
- Supabase Storage / IPFS stores documents.
- Ethereum Sepolia stores proof hashes and transaction evidence.
- Auditors compare database/Supabase hashes with blockchain hashes.
- Public Citizens can verify published and awarded procurement records without login.

The system must never store full tender documents, bid proposals, registration files, or award justification documents directly on-chain.

Only hashes and proof events should be recorded on Ethereum Sepolia.

---

## 4. High-Level System Architecture

```text
BGPS Web Application
│
├── Landing Page
│   ├── Public Notification Section
│   ├── Public Transparency Access
│   └── Role Selection Entry
│
├── Role-Based Application Layer
│   ├── Admin Section
│   ├── Procuring Agency Section
│   ├── Supplier / Bidder Section
│   ├── Auditor Section
│   └── Public Citizen Section
│
├── Identity and Wallet Layer
│   ├── Bhutan NDI Identity Verification
│   └── Rabby Wallet Connection
│
├── Application Logic Layer
│   ├── Approval Logic
│   ├── Registration Logic
│   ├── Tender Logic
│   ├── Bid Logic
│   ├── Award Logic
│   ├── Audit Logic
│   ├── Notification Logic
│   └── Public Verification Logic
│
├── Data Layer
│   ├── Supabase PostgreSQL
│   ├── Supabase Storage / IPFS
│   └── Activity Logs
│
├── Blockchain Proof Layer
│   ├── Ethereum Sepolia Smart Contract
│   ├── Blockchain Events
│   ├── Transaction Hashes
│   └── Payload Hashes
│
└── Communication Layer
    ├── SMTP Email Service
    ├── Approval Emails
    ├── Rejection Emails
    ├── Auditor Invitation Emails
    └── Winning Supplier Notification Emails
```

---

## 5. System Roles

BGPS uses strict role-based architecture.

There is no generic user dashboard.

Each role has a specific responsibility and its own section.

| Role | Main Responsibility |
|---|---|
| Admin | Approves agencies, approves suppliers, invites auditors, views logs and blockchain events |
| Procuring Agency | Registers, creates tenders, publishes tenders, reviews bids, selects winner |
| Supplier / Bidder | Registers, views open tenders, submits bids, tracks award result |
| Auditor | Activates account through invitation, verifies hashes, creates audit reports |
| Public Citizen | Views published/awarded tenders and verifies blockchain proof without login |

Important rule:

Public Citizen does not log in.

Public Citizen only interacts with public transparency records and public notification information.

---

## 6. Role Routing Architecture

The system begins with a role selection gateway.

```text
User opens BGPS Web Application
↓
Select User Role
↓
Admin / Procuring Agency / Supplier / Bidder / Auditor / Public Citizen
↓
Role-specific flow begins
```

This role routing is important because each actor has different permissions, data visibility, and system responsibilities.

---

## 7. Authentication and Identity Architecture

### 7.1 Admin Authentication

Admin flow:

```text
Admin logs in with Bhutan NDI
↓
Admin connects Rabby Wallet
↓
System verifies Admin NDI identity, wallet, and active status
↓
If valid: Admin Dashboard
↓
If invalid: Deny access
```

The Admin record is stored in the `admins` table with:

- full_name
- email
- ndi_identifier
- wallet_address
- is_active

### 7.2 Procuring Agency Authentication

Agency flow:

```text
Agency logs in with Bhutan NDI
↓
Agency connects Rabby Wallet
↓
System checks NDI, wallet, active status, approval status, and blockchain authorization
↓
If approved and blockchain authorized: Agency Dashboard
↓
If not approved: Agency Registration Form
```

Agency records are stored in the `agencies` table.

### 7.3 Supplier / Bidder Authentication

Supplier flow:

```text
Supplier logs in with Bhutan NDI
↓
Supplier connects Rabby Wallet
↓
System checks NDI, wallet, active status, approval status, and blockchain authorization
↓
If approved and blockchain authorized: Supplier Dashboard
↓
If not approved: Supplier Registration Form
```

Supplier records are stored in the `suppliers` table.

### 7.4 Auditor Authentication

Auditor account creation begins through Admin invitation.

```text
Admin creates auditor invitation
↓
Auditor receives email
↓
Auditor opens invitation link
↓
Auditor enters temporary username and password
↓
System checks token, expiry time, and used status
↓
Auditor verifies Bhutan NDI
↓
Auditor connects Rabby Wallet
↓
Auditor account becomes active
```

Auditor invitation records are stored in `auditor_invitations`.

Activated auditor records are stored in `auditors`.

---

## 8. Database Architecture Overview

The BGPS ERD is built around role-specific tables instead of one generic user table.

This is a strong architecture because the system itself is role-based and each role has different lifecycle requirements.

Main tables:

```text
admins
agencies
suppliers
auditor_invitations
auditors
tenders
bids
awards
documents
blockchain_events
audit_reports
activity_logs
email_notifications
public_tender_views
```

---

## 9. Database Entity Responsibilities

### 9.1 admins

Stores Admin identity and wallet information.

Used for:

- Admin login
- Admin approval authority
- Admin audit trail
- Admin-created auditor invitations

Important fields:

```text
id
full_name
email
ndi_identifier
wallet_address
is_active
created_at
updated_at
```

---

### 9.2 agencies

Stores Procuring Agency registration, approval, wallet, and blockchain authorization information.

Used for:

- Agency registration
- Agency approval
- Agency tender creation
- Agency tender publishing
- Agency winner selection

Important fields:

```text
status
rejection_reason
verified_by_admin_id
verified_at
blockchain_authorized
authorization_tx_hash
```

Critical rule:

```text
Agency can create and publish tenders only if:
status = approved
AND blockchain_authorized = true
```

---

### 9.3 suppliers

Stores Supplier / Bidder registration, approval, wallet, and blockchain authorization information.

Used for:

- Supplier registration
- Supplier approval
- Tender browsing
- Bid submission
- Award result tracking

Critical rule:

```text
Supplier can submit bids only if:
status = approved
AND blockchain_authorized = true
```

---

### 9.4 auditor_invitations

Stores Admin-created auditor invitations.

Used for:

- Temporary username
- Temporary password hash
- Invitation token
- Expiry control
- Used status

Critical rule:

```text
Auditor invitation must be:
valid
unused
not expired
```

---

### 9.5 auditors

Stores active auditor accounts after successful invitation and verification.

Used for:

- Auditor login
- Audit dashboard access
- Audit report creation
- Public verified auditor display

Critical rule:

```text
Auditor can access dashboard only if is_active = true
```

---

### 9.6 tenders

Stores tender lifecycle information.

Tender statuses:

```text
draft
published
closed
awarded
```

Tender lifecycle:

```text
draft
↓
published
↓
closed
↓
awarded
```

Important fields:

```text
agency_id
title
description
estimated_amount
submission_deadline
status
tender_hash
wallet_confirmed
blockchain_tx_hash
published_at
closed_at
```

Critical rule:

```text
Tender becomes published only after blockchain transaction is confirmed.
```

---

### 9.7 bids

Stores supplier bids for tenders.

Bid statuses:

```text
submitted
on_chain_confirmed
under_review
rejected
winner
failed
```

Important database rule:

```text
Unique index:
tender_id + supplier_id
```

This prevents a supplier from submitting multiple bids for the same tender.

Critical rule:

```text
Bid becomes on_chain_confirmed only after blockchain transaction is confirmed.
```

---

### 9.8 awards

Stores winning bid result and award justification.

Used for:

- Winner selection
- Award proof
- Public winning bid display
- Winning supplier notification

Critical rule:

```text
winning_supplier_id must match the supplier_id of winning_bid_id.
```

Award must only become final after the WinnerSelected blockchain event is confirmed.

---

### 9.9 documents

Stores document metadata and hashes.

Used for:

- Agency registration documents
- Supplier registration documents
- Tender documents
- Bid proposal documents
- Winner justification documents

Important fields:

```text
storage_url
ipfs_hash
document_hash
hash_algorithm
```

Critical rule:

```text
All documents are stored off-chain.
Only document hashes are used for blockchain proof.
```

---

### 9.10 blockchain_events

Stores blockchain proof records.

Event names:

```text
AgencyWalletAuthorized
SupplierWalletAuthorized
TenderCreated
BidSubmitted
WinnerSelected
```

Transaction statuses:

```text
pending
confirmed
failed
```

Used for:

- Tracking Sepolia transactions
- Connecting database records to blockchain proof
- Auditor verification
- Public proof verification

Critical rule:

```text
Business status must not be finalized until blockchain_events.tx_status = confirmed.
```

---

### 9.11 audit_reports

Stores auditor verification results.

Audit statuses:

```text
pending
verified
suspicious
```

Used for:

- Hash comparison
- Tender verification
- Bid verification
- Document verification
- Blockchain proof verification

Critical rule:

```text
If database_hash = blockchain_hash:
status = verified

If database_hash != blockchain_hash:
status = suspicious
```

---

### 9.12 activity_logs

Stores system activity for auditability.

Used for:

- Admin actions
- Agency actions
- Supplier actions
- Auditor actions
- Public verification actions
- System events

Actor types:

```text
Admin
Procuring_Agency
Supplier_Bidder
Auditor
System
Public_Citizen
```

---

### 9.13 email_notifications

Tracks all email messages.

Email statuses:

```text
pending
sent
failed
```

Used for:

- Agency approval/rejection emails
- Supplier approval/rejection emails
- Auditor invitation emails
- Winning supplier notification emails

Critical rule:

```text
Create email record as pending first.
Then update status to sent or failed.
```

---

### 9.14 public_tender_views

Tracks public tender views without requiring public login.

Used for:

- Public tender view tracking
- Public verification click tracking

Critical rule:

```text
Public Citizen does not need login.
Only public view activity is stored.
```

---

## 10. Admin Section Architecture

The Admin section controls access and trust onboarding.

Admin responsibilities:

```text
Approve agency
Reject agency
Approve supplier
Reject supplier
Add auditor
View activity logs
View blockchain events
```

### 10.1 Agency Approval Architecture

```text
Pending agency registration
↓
Admin reviews documents, NDI, and wallet
↓
Approve or reject
```

If rejected:

```text
Store rejection reason
↓
Create email notification as pending
↓
Send rejection email
↓
Update email status
↓
Agency remains blocked
```

If approved:

```text
Update agency status to approved
↓
Store admin verifier and timestamp
↓
Create blockchain event as pending
↓
Authorize agency wallet on Ethereum Sepolia
↓
If confirmed:
    update blockchain event to confirmed
    mark agency blockchain_authorized true
    send approval email
    agency approval completed
↓
If failed:
    update blockchain event to failed
    keep agency pending/blocked
```

### 10.2 Supplier Approval Architecture

Supplier approval follows the same structure as agency approval.

If approved:

```text
Update supplier status to approved
↓
Authorize supplier wallet on blockchain
↓
Mark supplier blockchain_authorized true only after confirmation
↓
Send supplier approval email
```

### 10.3 Auditor Invitation Architecture

```text
Admin enters auditor name and email
↓
Create auditor invitation record
↓
Generate one-time temporary credentials
↓
Store token and expiry status
↓
Create invitation email as pending
↓
Send invitation email
↓
Update email status to sent or failed
```

---

## 11. Procuring Agency Section Architecture

The Procuring Agency section manages tender creation, publishing, bid review, and award selection.

### 11.1 Agency Registration Flow

```text
Agency logs in
↓
System checks approval and blockchain authorization
↓
If not approved:
    show registration form
    upload documents
    generate document hash
    store agency request as pending
    show pending approval page
```

### 11.2 Tender Creation Flow

```text
Agency dashboard
↓
Create tender
↓
Backend checks agency is approved and blockchain authorized
↓
Enter tender details
↓
Upload tender document
↓
Store document in Supabase Storage / IPFS
↓
Generate tender hash
↓
Save tender as draft
```

### 11.3 Tender Publishing Flow

```text
Draft tender
↓
Create blockchain event as pending
↓
Agency confirms transaction with Rabby Wallet
↓
Record tender hash on Ethereum Sepolia
↓
If confirmed:
    update blockchain event to confirmed
    store transaction hash
    tender status = published
    suppliers can view tender
↓
If failed:
    update blockchain event to failed
    tender remains draft
```

### 11.4 Tender Evaluation and Award Flow

```text
Tender closes after deadline
↓
Backend updates tender status to closed
↓
Agency reviews bids
↓
Compare bid details
↓
Verify bid hashes against blockchain events
↓
Select winner
↓
Backend checks tender is closed
↓
Generate winner justification hash
↓
Create award record
↓
Create blockchain event as pending
↓
Confirm winner selection with Rabby Wallet
↓
Record award decision on Ethereum Sepolia
```

If award transaction is confirmed:

```text
Update blockchain event to confirmed
↓
Store award transaction hash
↓
Tender status = awarded
↓
Winning bid status = winner
↓
Other bids status = rejected
↓
Create winning supplier email as pending
↓
Notify winning supplier
```

If award transaction fails:

```text
Update blockchain event to failed
↓
Keep tender closed
↓
Do not show winner publicly
```

---

## 12. Supplier / Bidder Section Architecture

The Supplier / Bidder section manages registration, tender browsing, bid submission, and award tracking.

### 12.1 Supplier Registration Flow

```text
Supplier logs in
↓
System checks approval and blockchain authorization
↓
If not approved:
    show registration form
    upload documents
    generate document hash
    store supplier request as pending
    show pending approval page
```

### 12.2 Bid Submission Flow

```text
Supplier dashboard
↓
View open tenders
↓
Open tender details
↓
Choose submit bid
↓
Backend checks supplier approved and blockchain authorized
↓
Backend checks tender status is published
↓
Backend checks current time before submission deadline
↓
Backend checks supplier has not already submitted bid
```

If bid is allowed:

```text
Fill bid form
↓
Upload proposal documents
↓
Store bid documents in Supabase Storage / IPFS
↓
Generate bid hash
↓
Create bid record as submitted
↓
Create blockchain event as pending
↓
Confirm bid transaction with Rabby Wallet
↓
Record bid hash on Ethereum Sepolia
```

If blockchain transaction is confirmed:

```text
Update blockchain event to confirmed
↓
Store transaction hash
↓
Bid status = on_chain_confirmed
↓
Supplier can track bid status
```

If blockchain transaction fails:

```text
Update blockchain event to failed
↓
Keep bid submitted/failed
```

---

## 13. Auditor Section Architecture

The Auditor section provides independent verification.

### 13.1 Auditor Activation Flow

```text
Auditor receives invitation email
↓
Auditor opens invitation link
↓
Enter temporary username and password
↓
System checks token, expiry time, and used status
↓
If invalid:
    show invalid or expired message
    deny access
↓
If valid:
    open Bhutan NDI login
    verify auditor identity
    connect Rabby Wallet
    store NDI, wallet, role, timestamp
    mark temporary credentials as used
    auditor account becomes active
```

### 13.2 Auditor Verification Flow

```text
Auditor dashboard
↓
Search by tender ID, transaction hash, or document hash
↓
Open audit timeline from activity logs and blockchain events
↓
View tender, bid, approval, winner, and blockchain records
↓
Compare Supabase hash with blockchain hash
```

If hashes match:

```text
Mark record as verified
↓
Update audit report
```

If hashes do not match:

```text
Flag suspicious activity
↓
Update audit report
```

---

## 14. Public Citizen Architecture

Public Citizen has no login and no private access.

Public flow:

```text
Open Public Transparency Portal
↓
View published and awarded tenders
↓
Open public tender record
↓
View agency, winner, amount, timeline, and proof
↓
Click verify blockchain proof
↓
Check Ethereum Sepolia transaction or hash
↓
Show trusted procurement status if proof matches
↓
Show failed or pending status if proof does not match
↓
Store public tender view only
```

Public Citizen can see:

```text
Verified agencies
Verified suppliers
Verified auditors
Published tenders
Awarded tenders
Winning bid results
Blockchain proof status
Trusted verification status
```

Public Citizen must not see:

```text
Private bid documents
Supplier confidential proposal files
Internal admin notes
Temporary auditor credentials
Private session data
Unconfirmed winner as final result
```

---

## 15. Public Notification Architecture

Public notifications should appear in the landing page header or public transparency section.

Public notification categories:

```text
Verified Procuring Agencies
Verified Suppliers / Bidders
Verified Auditors
Winning Bid Results
```

### 15.1 Verified Agency Notification

Trigger:

```text
Admin approves agency
↓
Agency blockchain authorization confirmed
↓
Agency appears in Verified Procuring Agencies
```

Display condition:

```text
agency.status = approved
AND agency.blockchain_authorized = true
```

### 15.2 Verified Supplier Notification

Trigger:

```text
Admin approves supplier
↓
Supplier blockchain authorization confirmed
↓
Supplier appears in Verified Suppliers / Bidders
```

Display condition:

```text
supplier.status = approved
AND supplier.blockchain_authorized = true
```

### 15.3 Verified Auditor Notification

Trigger:

```text
Admin adds auditor
↓
Auditor successfully activates account
↓
Auditor appears in Verified Auditors
```

Display condition:

```text
auditor.is_active = true
```

### 15.4 Winning Bid Notification

Trigger:

```text
Agency selects winner
↓
WinnerSelected blockchain event confirmed
↓
Tender status becomes awarded
↓
Winning bid status becomes winner
↓
Winning supplier email sent
↓
Winning result appears in Winning Bid Results
```

Display condition:

```text
tender.status = awarded
AND bid.status = winner
AND award.blockchain_tx_hash exists
```

---

## 16. System Integration Architecture

### 16.1 Supabase Database

Supabase Database stores:

```text
admins
agencies
suppliers
auditors
auditor_invitations
tenders
bids
awards
documents
blockchain_events
audit_reports
activity_logs
email_notifications
public_tender_views
```

### 16.2 Supabase Storage / IPFS

Supabase Storage / IPFS stores:

```text
agency registration documents
supplier registration documents
tender documents
bid proposal documents
winner justification documents
```

### 16.3 Ethereum Sepolia Smart Contract

Ethereum Sepolia stores proof for:

```text
AgencyWalletAuthorized
SupplierWalletAuthorized
TenderCreated
BidSubmitted
WinnerSelected
```

### 16.4 SMTP Email Service

SMTP sends:

```text
agency approval email
agency rejection email
supplier approval email
supplier rejection email
auditor invitation email
winning supplier notification email
```

---

## 17. Smart Contract Architecture

The smart contract should be proof-focused and minimal.

Recommended contract name:

```text
BGPSProcurement.sol
```

Recommended functions:

```text
authorizeAgency(address agencyWallet, bytes32 proofHash)
authorizeSupplier(address supplierWallet, bytes32 proofHash)
recordTenderHash(uint256 tenderId, bytes32 tenderHash)
recordBidHash(uint256 tenderId, uint256 bidId, bytes32 bidHash)
recordWinnerHash(uint256 tenderId, uint256 bidId, bytes32 justificationHash)
```

Recommended events:

```text
AgencyWalletAuthorized
SupplierWalletAuthorized
TenderCreated
BidSubmitted
WinnerSelected
```

Smart contract design rule:

```text
Store proof hashes only.
Do not store full documents.
```

---

## 18. Status Lifecycle Architecture

### 18.1 Approval Status

```text
pending
↓
approved / rejected / blocked
```

### 18.2 Tender Status

```text
draft
↓
published
↓
closed
↓
awarded
```

### 18.3 Bid Status

```text
submitted
↓
on_chain_confirmed
↓
under_review
↓
winner / rejected / failed
```

### 18.4 Blockchain Transaction Status

```text
pending
↓
confirmed / failed
```

### 18.5 Email Status

```text
pending
↓
sent / failed
```

### 18.6 Audit Status

```text
pending
↓
verified / suspicious
```

---

## 19. Security Architecture

### 19.1 Identity Security

Use Bhutan NDI to verify:

```text
Admin identity
Agency identity
Supplier identity
Auditor identity
```

### 19.2 Wallet Security

Use Rabby Wallet to verify blockchain address ownership and sign blockchain actions.

Wallet address should match the saved record for the identity.

### 19.3 Role-Based Access Control

Each role can only perform its allowed actions.

| Action | Admin | Procuring Agency | Supplier / Bidder | Auditor | Public Citizen |
|---|---|---|---|---|---|
| Approve agency | Yes | No | No | No | No |
| Approve supplier | Yes | No | No | No | No |
| Add auditor | Yes | No | No | No | No |
| Create tender | No | Yes | No | No | No |
| Publish tender | No | Yes | No | No | No |
| Submit bid | No | No | Yes | No | No |
| Select winner | No | Yes | No | No | No |
| Verify audit record | No | No | No | Yes | No |
| View public records | Yes | Yes | Yes | Yes | Yes |
| Verify public proof | Yes | Yes | Yes | Yes | Yes |

### 19.4 Data Security

Do not expose:

```text
private bid proposal documents
supplier confidential files
temporary auditor credentials
internal rejection notes
private session data
```

### 19.5 Blockchain Security

Only update business status after confirmed transaction.

Never mark:

```text
tender as published
bid as on_chain_confirmed
tender as awarded
winner as public
```

until blockchain event status is confirmed.

---

## 20. Backend Validation Architecture

The backend must enforce all critical rules.

Frontend validation alone is not enough.

Critical backend checks:

```text
Only active Admin can approve agencies and suppliers.
Only approved and blockchain_authorized Agency can create/publish tender.
Only approved and blockchain_authorized Supplier can submit bid.
Tender must be published before bids are accepted.
Bid submission must happen before submission_deadline.
Supplier must not have already submitted bid for the same tender.
Winner selection requires tender status = closed.
Winning bid must belong to selected tender.
Winning supplier must match winning bid supplier.
Award finalization requires confirmed blockchain transaction.
Public winner display requires awarded tender and confirmed proof.
Auditor activation requires valid unused invitation.
Audit verification compares database hash with blockchain hash.
```

---

## 21. Audit Architecture

The audit architecture depends on three sources:

```text
documents
blockchain_events
activity_logs
```

Auditor checks:

```text
database hash
document hash
blockchain payload hash
transaction hash
activity timeline
```

Audit result:

```text
verified
or
suspicious
```

The audit report is stored in `audit_reports`.

---

## 22. Public Verification Architecture

Public verification allows citizens to trust procurement results.

Public verification checks:

```text
published or awarded tender exists
blockchain transaction hash exists
transaction status is confirmed
payload hash matches expected hash
```

Result shown:

```text
Trusted Procurement Status
Verification Pending
Verification Failed
Suspicious
```

Public views are stored in `public_tender_views`.

---

## 23. Email Notification Architecture

Email notification must use a durable state model.

Correct flow:

```text
Create email notification as pending
↓
Send email through SMTP
↓
If success: update status to sent
↓
If failure: update status to failed and store error_message
```

Email must be used for:

```text
agency rejection
agency approval
supplier rejection
supplier approval
auditor invitation
winning supplier notification
```

---

## 24. Activity Logging Architecture

Every important system action should create an activity log.

Examples:

```text
Admin approved agency
Admin rejected supplier
Admin invited auditor
Agency created tender
Agency published tender
Supplier submitted bid
Agency selected winner
Auditor verified record
Public clicked verify proof
```

Activity logs support:

```text
audit timeline
admin monitoring
forensic review
system transparency
```

---

## 25. MVP Deployment Architecture

Recommended MVP stack:

```text
Frontend:
Next.js + React + JavaScript

Backend:
Next.js API Routes

Database:
Supabase PostgreSQL

Storage:
Supabase Storage / IPFS

Identity:
Bhutan NDI beta/demo

Wallet:
Rabby Wallet

Blockchain:
Ethereum Sepolia

Smart Contract:
Solidity + Hardhat

Email:
SMTP service

Deployment:
Vercel
```

---

## 26. Frontend Flow Demo Mode Architecture

For the current frontend-only stage:

```text
No real backend
No real Supabase
No real NDI
No real Rabby Wallet
No real Sepolia
No real SMTP
No real validation
```

Use:

```text
mock data
local state
fake buttons
status changes
demo mode badges
```

Frontend demo should still preserve backend-ready architecture.

Visual demo actions:

```text
Approve Agency -> agency appears in public notifications
Approve Supplier -> supplier appears in public notifications
Add Auditor -> auditor appears in public notifications
Create Tender -> tender appears as draft
Publish Tender -> tender becomes published
Submit Bid -> bid becomes submitted
Confirm Blockchain -> status becomes confirmed
Select Winner -> bid becomes winner
Send Email -> email status becomes sent
Verify Proof -> status becomes trusted or suspicious
```

---

## 27. System Architecture Diagram

```text
                         ┌───────────────────────────────┐
                         │      BGPS Web Application      │
                         └───────────────┬───────────────┘
                                         │
                         ┌───────────────▼───────────────┐
                         │        Role Selection          │
                         └───────────────┬───────────────┘
                                         │
        ┌────────────────┬───────────────┼───────────────┬────────────────┐
        │                │               │               │                │
        ▼                ▼               ▼               ▼                ▼
   Admin Section   Agency Section   Supplier Section  Auditor Section  Public Section
        │                │               │               │                │
        ▼                ▼               ▼               ▼                ▼
  Approvals       Tender Workflow    Bid Workflow     Audit Workflow    Public Proof
        │                │               │               │                │
        └────────────────┬───────────────┴───────────────┬────────────────┘
                         │                               │
                         ▼                               ▼
              ┌────────────────────┐          ┌────────────────────┐
              │ Supabase Database  │          │ Supabase Storage   │
              └─────────┬──────────┘          └─────────┬──────────┘
                        │                               │
                        ▼                               ▼
              ┌────────────────────┐          ┌────────────────────┐
              │ Blockchain Events  │          │ Document Hashes    │
              └─────────┬──────────┘          └─────────┬──────────┘
                        │                               │
                        └───────────────┬───────────────┘
                                        ▼
                         ┌───────────────────────────────┐
                         │ Ethereum Sepolia Smart Contract│
                         └───────────────────────────────┘
```

---

## 28. Final Professional Assessment

The BGPS architecture is logically strong because:

1. Roles are clearly separated.
2. Public Citizen does not require login.
3. Admin controls agency, supplier, and auditor onboarding.
4. Agencies can only publish tenders after approval and blockchain authorization.
5. Suppliers can only submit bids after approval and blockchain authorization.
6. Bids are protected against duplicate supplier submissions.
7. Winner selection happens after tender closure.
8. Blockchain events track pending, confirmed, and failed states.
9. Email notifications track pending, sent, and failed states.
10. Auditors verify hashes using database records and blockchain proof.
11. Public Citizens can independently verify procurement results.
12. Documents stay off-chain while hashes are stored as proof.

The most important production rule is:

```text
Never update final business status before blockchain confirmation.
```

The most important public trust rule is:

```text
Never show a winning bid publicly until the award transaction is confirmed and the tender status is awarded.
```

The most important demo rule is:

```text
Make the full role-based flow easy to understand before connecting real backend systems.
```

---

## 29. Final Summary

BGPS is designed as a transparent, role-based, audit-friendly government procurement platform.

The architecture connects:

```text
Admin approval
↓
Agency tender creation
↓
Supplier bid submission
↓
Agency winner selection
↓
Blockchain proof
↓
Auditor verification
↓
Public transparency
```

This makes the system suitable for a professional international hackathon MVP and gives it a strong foundation for future production development.
