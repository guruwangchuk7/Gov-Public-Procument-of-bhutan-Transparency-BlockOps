# BGPS Professional Data Flow Architecture

## 1. Document Purpose

This document defines the professional data flow architecture for BGPS, the Blockchain-Based Government Procurement System.

The data flow is based on:

1. The BGPS flowchart, which defines how each role moves through the system.
2. The BGPS ERD, which defines where each piece of data is stored in PostgreSQL.
3. The system integration points: Supabase Database, Supabase Storage / IPFS, Ethereum Sepolia Smart Contract, and SMTP Email Service.

This document is written for engineers, system architects, database engineers, frontend developers, backend developers, and hackathon judges to understand how data moves through the system from start to finish.

---

## 2. BGPS Data Flow Summary

BGPS data moves through five role-based flows:

```text
Admin Flow
↓
Procuring Agency Flow
↓
Supplier / Bidder Flow
↓
Auditor Flow
↓
Public Citizen Flow
```

The core data movement is:

```text
Identity verification
↓
Wallet verification
↓
Registration or dashboard access
↓
Document upload
↓
Hash generation
↓
Database record creation
↓
Blockchain proof creation
↓
Status update
↓
Email notification
↓
Audit verification
↓
Public transparency display
```

---

## 3. Main System Data Sources

The system uses four major data sources.

```text
1. Supabase PostgreSQL
2. Supabase Storage / IPFS
3. Ethereum Sepolia Smart Contract
4. SMTP Email Service
```

### 3.1 Supabase PostgreSQL

Stores structured system data:

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

### 3.2 Supabase Storage / IPFS

Stores file-based data:

```text
agency registration documents
supplier registration documents
tender documents
bid proposal documents
winner justification documents
```

### 3.3 Ethereum Sepolia Smart Contract

Stores blockchain proof:

```text
AgencyWalletAuthorized
SupplierWalletAuthorized
TenderCreated
BidSubmitted
WinnerSelected
```

### 3.4 SMTP Email Service

Sends communication messages:

```text
agency approval email
agency rejection email
supplier approval email
supplier rejection email
auditor invitation email
winning supplier notification email
```

---

## 4. High-Level Data Flow Diagram

```text
User opens BGPS Web Application
↓
Select User Role
↓
Role-specific identity and wallet flow
↓
Role-specific dashboard or public portal
↓
System action is performed
↓
Data is written to Supabase PostgreSQL
↓
Documents are stored in Supabase Storage / IPFS
↓
Document hash is generated
↓
Blockchain event is created as pending
↓
Rabby Wallet confirms transaction
↓
Ethereum Sepolia stores proof hash
↓
Blockchain event becomes confirmed or failed
↓
Business status is updated
↓
Email notification is created and sent
↓
Activity log is recorded
↓
Auditor can verify hash
↓
Public Citizen can verify proof
```

---

## 5. Role Selection Data Flow

The system begins with role selection.

```text
User opens BGPS Web Application
↓
System shows role selection
↓
User selects one role:
    Admin
    Procuring Agency
    Supplier / Bidder
    Auditor
    Public Citizen
↓
System routes user to selected role flow
```

No database write is required at role selection unless the system chooses to track anonymous navigation analytics.

---

## 6. Admin Login Data Flow

### 6.1 Flow

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

### 6.2 Data Read

The system reads from:

```text
admins
```

### 6.3 Data Checked

```text
admins.ndi_identifier
admins.wallet_address
admins.is_active
```

### 6.4 Data Output

If valid:

```text
Admin session is created
Admin Dashboard opens
```

If invalid:

```text
Access denied
No dashboard access
```

### 6.5 Recommended Activity Log

```text
actor_type = Admin
action = Admin login attempt
entity_type = admin
entity_id = admin.id
```

---

## 7. Admin Agency Approval Data Flow

This flow handles Procuring Agency registration approval.

### 7.1 Flow

```text
Admin Dashboard
↓
View pending agency registrations
↓
Review agency documents, NDI, and wallet
↓
Approve agency?
```

---

### 7.2 If Agency Is Rejected

```text
Reject agency with reason
↓
Store rejection reason
↓
Create email notification as pending
↓
Send agency rejection email
↓
Update email status to sent or failed
↓
Agency remains blocked
```

### 7.3 Database Write

Tables updated:

```text
agencies
email_notifications
activity_logs
```

### 7.4 Fields Updated

```text
agencies.status = blocked or rejected
agencies.rejection_reason = reason
email_notifications.status = pending / sent / failed
```

### 7.5 If Agency Is Approved

```text
Approve agency
↓
Update agency status to approved
↓
Store admin verifier and timestamp
↓
Create blockchain event as pending
↓
Authorize agency wallet on blockchain
↓
Blockchain transaction confirmed?
```

### 7.6 Database Write Before Blockchain Confirmation

Tables updated:

```text
agencies
blockchain_events
activity_logs
```

Fields updated:

```text
agencies.status = approved
agencies.verified_by_admin_id = admin.id
agencies.verified_at = current timestamp
blockchain_events.event_name = AgencyWalletAuthorized
blockchain_events.tx_status = pending
blockchain_events.related_agency_id = agency.id
```

### 7.7 If Blockchain Transaction Is Confirmed

```text
Update blockchain event to confirmed
↓
Mark agency blockchain_authorized true
↓
Create agency approval email as pending
↓
Send agency approval email
↓
Agency approval completed
```

Tables updated:

```text
agencies
blockchain_events
email_notifications
activity_logs
```

Fields updated:

```text
blockchain_events.tx_status = confirmed
blockchain_events.confirmed_at = current timestamp
agencies.blockchain_authorized = true
agencies.authorization_tx_hash = tx_hash
email_notifications.status = sent or failed
```

### 7.8 If Blockchain Transaction Fails

```text
Update blockchain event to failed
↓
Keep agency pending/blocked
```

Fields updated:

```text
blockchain_events.tx_status = failed
blockchain_events.error_message = failure reason
blockchain_events.failed_at = current timestamp
agencies.blockchain_authorized = false
```

### 7.9 Public Notification Output

When:

```text
agencies.status = approved
AND agencies.blockchain_authorized = true
```

The agency appears in:

```text
Public Notification Section
↓
Verified Procuring Agencies
```

---

## 8. Admin Supplier / Bidder Approval Data Flow

This flow handles Supplier / Bidder registration approval.

### 8.1 Flow

```text
Admin Dashboard
↓
View pending supplier registrations
↓
Review supplier documents, NDI, and wallet
↓
Approve supplier?
```

---

### 8.2 If Supplier Is Rejected

```text
Reject supplier with reason
↓
Store rejection reason
↓
Create supplier rejection email as pending
↓
Send supplier rejection email
↓
Update email status to sent or failed
↓
Supplier remains blocked
```

Tables updated:

```text
suppliers
email_notifications
activity_logs
```

Fields updated:

```text
suppliers.status = blocked or rejected
suppliers.rejection_reason = reason
email_notifications.status = pending / sent / failed
```

---

### 8.3 If Supplier Is Approved

```text
Approve supplier
↓
Update supplier status to approved
↓
Store admin verifier and timestamp
↓
Create blockchain event as pending
↓
Authorize supplier wallet on blockchain
↓
Blockchain transaction confirmed?
```

Tables updated before blockchain confirmation:

```text
suppliers
blockchain_events
activity_logs
```

Fields updated:

```text
suppliers.status = approved
suppliers.verified_by_admin_id = admin.id
suppliers.verified_at = current timestamp
blockchain_events.event_name = SupplierWalletAuthorized
blockchain_events.tx_status = pending
blockchain_events.related_supplier_id = supplier.id
```

---

### 8.4 If Blockchain Transaction Is Confirmed

```text
Update blockchain event to confirmed
↓
Mark supplier blockchain_authorized true
↓
Create supplier approval email as pending
↓
Send supplier approval email
↓
Supplier approval completed
```

Tables updated:

```text
suppliers
blockchain_events
email_notifications
activity_logs
```

Fields updated:

```text
blockchain_events.tx_status = confirmed
suppliers.blockchain_authorized = true
suppliers.authorization_tx_hash = tx_hash
email_notifications.status = sent or failed
```

---

### 8.5 If Blockchain Transaction Fails

```text
Update blockchain event to failed
↓
Keep supplier pending/blocked
```

Fields updated:

```text
blockchain_events.tx_status = failed
suppliers.blockchain_authorized = false
```

---

### 8.6 Public Notification Output

When:

```text
suppliers.status = approved
AND suppliers.blockchain_authorized = true
```

The supplier appears in:

```text
Public Notification Section
↓
Verified Suppliers / Bidders
```

---

## 9. Admin Auditor Invitation Data Flow

This flow handles auditor onboarding.

### 9.1 Flow

```text
Admin Dashboard
↓
Select Add Auditor
↓
Enter auditor name and email
↓
Create auditor invitation record
↓
Generate one-time temporary credentials
↓
Store auditor token and expiry status
↓
Create auditor invitation email as pending
↓
Send auditor invitation email
↓
Update email status to sent or failed
```

### 9.2 Database Write

Tables updated:

```text
auditor_invitations
email_notifications
activity_logs
```

### 9.3 Fields Written

```text
auditor_invitations.auditor_name
auditor_invitations.auditor_email
auditor_invitations.temporary_username
auditor_invitations.temporary_password_hash
auditor_invitations.invitation_token
auditor_invitations.status = pending
auditor_invitations.expires_at
auditor_invitations.created_by_admin_id
email_notifications.status = pending / sent / failed
```

### 9.4 Public Notification Output

The auditor should not appear publicly immediately after invitation.

The auditor appears publicly only after:

```text
auditor account becomes active
auditors.is_active = true
```

Then the auditor appears in:

```text
Public Notification Section
↓
Verified Auditors
```

---

## 10. Procuring Agency Registration Data Flow

This flow handles new agency registration.

### 10.1 Flow

```text
Agency logs in with Bhutan NDI
↓
Agency connects Rabby Wallet
↓
System checks NDI, wallet, active status, and approval status
↓
Agency already approved and blockchain authorized?
```

If no:

```text
Show Agency Registration Form
↓
Submit agency details and documents
↓
Upload documents to Supabase Storage / IPFS
↓
Generate document hash using one backend hash method
↓
Store agency request as pending
↓
Agency sees Pending Approval page
```

### 10.2 Data Written

Tables updated:

```text
agencies
documents
activity_logs
```

### 10.3 Fields Written

```text
agencies.agency_name
agencies.email
agencies.phone
agencies.registration_number
agencies.ndi_identifier
agencies.wallet_address
agencies.status = pending
agencies.blockchain_authorized = false

documents.agency_id
documents.document_type = agency_registration
documents.file_name
documents.storage_url
documents.document_hash
documents.hash_algorithm
documents.uploaded_at
```

### 10.4 Cross-Flow Output

After agency registration is stored:

```text
agency request appears in Admin pending agency registrations
```

This connects to:

```text
Admin Agency Approval Data Flow
```

---

## 11. Supplier / Bidder Registration Data Flow

This flow handles new supplier registration.

### 11.1 Flow

```text
Supplier logs in with Bhutan NDI
↓
Supplier connects Rabby Wallet
↓
System checks NDI, wallet, active status, and approval status
↓
Supplier already approved and blockchain authorized?
```

If no:

```text
Show Supplier Registration Form
↓
Submit company details and documents
↓
Upload documents to Supabase Storage / IPFS
↓
Generate document hash using one backend hash method
↓
Store supplier request as pending
↓
Supplier sees Pending Approval page
```

### 11.2 Data Written

Tables updated:

```text
suppliers
documents
activity_logs
```

### 11.3 Fields Written

```text
suppliers.company_name
suppliers.email
suppliers.phone
suppliers.license_number
suppliers.ndi_identifier
suppliers.wallet_address
suppliers.status = pending
suppliers.blockchain_authorized = false

documents.supplier_id
documents.document_type = supplier_registration
documents.file_name
documents.storage_url
documents.document_hash
documents.hash_algorithm
documents.uploaded_at
```

### 11.4 Cross-Flow Output

After supplier registration is stored:

```text
supplier request appears in Admin pending supplier registrations
```

This connects to:

```text
Admin Supplier / Bidder Approval Data Flow
```

---

## 12. Agency Tender Creation Data Flow

This flow handles tender creation by an approved agency.

### 12.1 Flow

```text
Agency Dashboard
↓
Create tender
↓
Backend checks agency is approved and blockchain authorized
↓
Agency allowed?
```

If no:

```text
Deny tender creation
```

If yes:

```text
Enter tender details
↓
Upload tender document
↓
Store tender document in Supabase Storage / IPFS
↓
Generate tender hash using one backend hash method
↓
Save tender as draft
```

### 12.2 Data Read

```text
agencies
```

### 12.3 Data Checked

```text
agencies.status = approved
agencies.blockchain_authorized = true
```

### 12.4 Data Written

Tables updated:

```text
tenders
documents
activity_logs
```

### 12.5 Fields Written

```text
tenders.agency_id
tenders.title
tenders.description
tenders.estimated_amount
tenders.submission_deadline
tenders.status = draft
tenders.tender_hash
tenders.wallet_confirmed = false

documents.tender_id
documents.document_type = tender_document
documents.storage_url
documents.document_hash
documents.hash_algorithm
```

---

## 13. Tender Publishing Data Flow

This flow handles publishing a draft tender to Ethereum Sepolia proof.

### 13.1 Flow

```text
Draft tender
↓
Publish tender?
↓
Create blockchain event as pending
↓
Confirm transaction with Rabby Wallet
↓
Record tender hash on blockchain
↓
Blockchain transaction confirmed?
```

### 13.2 Data Written Before Confirmation

Tables updated:

```text
blockchain_events
activity_logs
```

Fields written:

```text
blockchain_events.event_name = TenderCreated
blockchain_events.tx_status = pending
blockchain_events.related_tender_id = tender.id
blockchain_events.payload_hash = tenders.tender_hash
```

### 13.3 If Blockchain Transaction Is Confirmed

```text
Update blockchain event to confirmed
↓
Store transaction hash
↓
Tender status = published
↓
Suppliers view published tender
```

Tables updated:

```text
tenders
blockchain_events
activity_logs
```

Fields updated:

```text
blockchain_events.tx_status = confirmed
blockchain_events.tx_hash = tx_hash
blockchain_events.block_number = block_number
blockchain_events.confirmed_at = current timestamp

tenders.status = published
tenders.wallet_confirmed = true
tenders.blockchain_tx_hash = tx_hash
tenders.published_at = current timestamp
```

### 13.4 If Blockchain Transaction Fails

```text
Update blockchain event to failed
↓
Keep tender as draft
```

Fields updated:

```text
blockchain_events.tx_status = failed
blockchain_events.error_message = failure reason
tenders.status = draft
```

### 13.5 Output

Published tenders become visible to:

```text
Supplier / Bidder Section
Public Citizen Section
```

---

## 14. Supplier Bid Submission Data Flow

This flow handles supplier bid submission.

### 14.1 Flow

```text
Supplier Dashboard
↓
View open tenders
↓
Open tender details
↓
Submit bid?
```

If yes, backend checks:

```text
Supplier approved and blockchain authorized
Tender status is published
Current time before submission deadline
Supplier has not already submitted bid
```

### 14.2 Data Read

Tables read:

```text
suppliers
tenders
bids
```

### 14.3 Data Checked

```text
suppliers.status = approved
suppliers.blockchain_authorized = true
tenders.status = published
current_time < tenders.submission_deadline
no existing bids row for same tender_id + supplier_id
```

### 14.4 If Bid Is Not Allowed

```text
Deny bid submission
```

No bid record should be created.

### 14.5 If Bid Is Allowed

```text
Fill bid form
↓
Upload proposal documents
↓
Store bid documents in Supabase Storage / IPFS
↓
Generate bid hash using one backend hash method
↓
Create bid record as submitted
↓
Create blockchain event as pending
↓
Confirm bid transaction with Rabby Wallet
↓
Record bid hash on blockchain
↓
Blockchain transaction confirmed?
```

### 14.6 Data Written Before Blockchain Confirmation

Tables updated:

```text
bids
documents
blockchain_events
activity_logs
```

Fields written:

```text
bids.tender_id
bids.supplier_id
bids.bid_amount
bids.proposal_summary
bids.bid_hash
bids.wallet_confirmed = false
bids.status = submitted
bids.submitted_at = current timestamp

documents.bid_id
documents.document_type = bid_proposal
documents.storage_url
documents.document_hash
documents.hash_algorithm

blockchain_events.event_name = BidSubmitted
blockchain_events.tx_status = pending
blockchain_events.related_tender_id = tender.id
blockchain_events.related_bid_id = bid.id
blockchain_events.related_supplier_id = supplier.id
blockchain_events.payload_hash = bids.bid_hash
```

### 14.7 If Blockchain Transaction Is Confirmed

```text
Update blockchain event to confirmed
↓
Store transaction hash
↓
Bid status = on_chain_confirmed
↓
Supplier can track bid status
```

Fields updated:

```text
blockchain_events.tx_status = confirmed
blockchain_events.tx_hash = tx_hash
blockchain_events.confirmed_at = current timestamp

bids.wallet_confirmed = true
bids.blockchain_tx_hash = tx_hash
bids.status = on_chain_confirmed
```

### 14.8 If Blockchain Transaction Fails

```text
Update blockchain event to failed
↓
Keep bid submitted or mark failed
```

Fields updated:

```text
blockchain_events.tx_status = failed
blockchain_events.error_message = failure reason
bids.status = failed or submitted
```

---

## 15. Tender Closing Data Flow

This flow handles the transition after tender deadline.

### 15.1 Flow

```text
Tender closes after deadline
↓
Backend updates tender status to closed
```

### 15.2 Data Read

```text
tenders.submission_deadline
tenders.status
```

### 15.3 Data Checked

```text
current_time >= tenders.submission_deadline
tenders.status = published
```

### 15.4 Data Written

```text
tenders.status = closed
tenders.closed_at = current timestamp
activity_logs action = Tender closed
```

### 15.5 Output

Closed tender becomes available for:

```text
Agency bid review
Winner selection
Auditor timeline
```

---

## 16. Winner Selection and Award Data Flow

This flow handles award creation and winning bid selection.

### 16.1 Flow

```text
Agency reviews bids
↓
Compare bid details
↓
Verify bid hashes against blockchain events
↓
All required hashes valid?
↓
Select winner?
```

If hashes are invalid:

```text
Flag invalid bid for review
```

If winner is selected:

```text
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
Record award decision on blockchain
↓
Blockchain transaction confirmed?
```

### 16.2 Data Read

Tables read:

```text
tenders
bids
suppliers
blockchain_events
documents
```

### 16.3 Data Checked

```text
tenders.status = closed
bids.tender_id = selected tender id
bids.status = on_chain_confirmed
winning_supplier_id = bids.supplier_id
bid hash matches blockchain payload hash
```

### 16.4 Data Written Before Blockchain Confirmation

Tables updated:

```text
awards
blockchain_events
activity_logs
```

Fields written:

```text
awards.tender_id
awards.winning_bid_id
awards.winning_supplier_id
awards.awarded_by_agency_id
awards.justification
awards.justification_hash
awards.wallet_confirmed = false

blockchain_events.event_name = WinnerSelected
blockchain_events.tx_status = pending
blockchain_events.related_tender_id = tender.id
blockchain_events.related_bid_id = bid.id
blockchain_events.related_award_id = award.id
blockchain_events.payload_hash = awards.justification_hash
```

### 16.5 If Blockchain Transaction Is Confirmed

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
↓
Update email status to sent or failed
```

Tables updated:

```text
awards
tenders
bids
blockchain_events
email_notifications
activity_logs
```

Fields updated:

```text
blockchain_events.tx_status = confirmed
blockchain_events.tx_hash = tx_hash
blockchain_events.confirmed_at = current timestamp

awards.wallet_confirmed = true
awards.blockchain_tx_hash = tx_hash
awards.awarded_at = current timestamp

tenders.status = awarded

winning bid:
bids.status = winner

other bids for same tender:
bids.status = rejected

email_notifications.status = pending / sent / failed
```

### 16.6 If Blockchain Transaction Fails

```text
Update blockchain event to failed
↓
Keep tender closed
↓
Do not show winner publicly
```

Fields updated:

```text
blockchain_events.tx_status = failed
blockchain_events.error_message = failure reason
tenders.status = closed
```

### 16.7 Public Notification Output

When:

```text
tenders.status = awarded
AND bids.status = winner
AND awards.blockchain_tx_hash exists
```

Winning result appears in:

```text
Public Notification Section
↓
Winning Bid Results
```

---

## 17. Auditor Activation Data Flow

This flow handles auditor activation after invitation.

### 17.1 Flow

```text
Auditor receives invitation email
↓
Auditor opens invitation link
↓
Enter temporary username and password
↓
System checks token, expiry time, and used status
↓
Credentials valid and unused?
```

If no:

```text
Show invalid or expired message
↓
Access denied
```

If yes:

```text
Open Bhutan NDI login
↓
Verify auditor NDI identity
↓
Auditor connects Rabby Wallet
↓
Store NDI, wallet, role, and timestamp
↓
Mark temporary credentials as used
↓
Auditor account becomes active
```

### 17.2 Data Read

```text
auditor_invitations
```

### 17.3 Data Checked

```text
invitation_token exists
status = pending
expires_at > current timestamp
used_at is null
temporary credentials match
```

### 17.4 Data Written

Tables updated:

```text
auditors
auditor_invitations
activity_logs
```

Fields written:

```text
auditors.invitation_id
auditors.full_name
auditors.email
auditors.ndi_identifier
auditors.wallet_address
auditors.is_active = true
auditors.activated_at = current timestamp

auditor_invitations.status = used
auditor_invitations.used_at = current timestamp
```

### 17.5 Public Notification Output

When:

```text
auditors.is_active = true
```

Auditor appears in:

```text
Public Notification Section
↓
Verified Auditors
```

---

## 18. Auditor Verification Data Flow

This flow handles audit verification.

### 18.1 Flow

```text
Auditor Dashboard
↓
Search by tender ID, transaction hash, or document hash
↓
Open audit timeline from activity logs and blockchain events
↓
View tender, bid, approval, winner, and blockchain records
↓
Compare Supabase hash with blockchain hash
↓
Do hashes match?
```

If yes:

```text
Mark record as verified
↓
Update audit report
```

If no:

```text
Flag suspicious activity
↓
Update audit report
```

### 18.2 Data Read

Tables read:

```text
auditors
tenders
bids
awards
documents
blockchain_events
activity_logs
```

### 18.3 Data Compared

```text
documents.document_hash
blockchain_events.payload_hash
audit_reports.database_hash
audit_reports.blockchain_hash
```

### 18.4 Data Written

Table updated:

```text
audit_reports
activity_logs
```

Fields written:

```text
audit_reports.auditor_id
audit_reports.tender_id
audit_reports.bid_id
audit_reports.document_id
audit_reports.blockchain_event_id
audit_reports.database_hash
audit_reports.blockchain_hash
audit_reports.status = verified or suspicious
audit_reports.notes
```

---

## 19. Public Citizen Data Flow

Public Citizen does not log in.

### 19.1 Flow

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
Blockchain proof found and hash matches?
```

If yes:

```text
Show trusted procurement status
```

If no:

```text
Show verification failed or pending status
```

Finally:

```text
Store public tender view only, no login required
```

### 19.2 Data Read

Tables read:

```text
tenders
agencies
suppliers
bids
awards
blockchain_events
audit_reports
```

### 19.3 Data Written

Table updated:

```text
public_tender_views
```

Fields written:

```text
public_tender_views.tender_id
public_tender_views.viewed_at
public_tender_views.verification_clicked
public_tender_views.blockchain_tx_hash
```

### 19.4 Public Data Safety Rule

Public Citizen can see:

```text
agency name
supplier company name
auditor name
tender title
winning supplier
award amount
timeline
transaction hash
proof status
verification result
```

Public Citizen must not see:

```text
private bid documents
confidential proposal files
temporary auditor credentials
internal admin notes
private session data
unconfirmed winner as final result
```

---

## 20. Public Notification Data Flow

The public notification section automatically updates when trusted system actions are completed.

### 20.1 Verified Procuring Agencies

Trigger:

```text
Admin approves agency
↓
Agency blockchain authorization confirmed
↓
agencies.status = approved
↓
agencies.blockchain_authorized = true
↓
Agency appears in Verified Procuring Agencies
```

Data source:

```text
agencies
blockchain_events
```

---

### 20.2 Verified Suppliers / Bidders

Trigger:

```text
Admin approves supplier
↓
Supplier blockchain authorization confirmed
↓
suppliers.status = approved
↓
suppliers.blockchain_authorized = true
↓
Supplier appears in Verified Suppliers / Bidders
```

Data source:

```text
suppliers
blockchain_events
```

---

### 20.3 Verified Auditors

Trigger:

```text
Admin invites auditor
↓
Auditor activates account
↓
auditors.is_active = true
↓
Auditor appears in Verified Auditors
```

Data source:

```text
auditors
auditor_invitations
```

---

### 20.4 Winning Bid Results

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
Winning bid appears in Winning Bid Results
```

Data source:

```text
tenders
bids
awards
suppliers
agencies
blockchain_events
email_notifications
```

---

## 21. Document Data Flow

Documents are never stored directly on blockchain.

### 21.1 Upload Flow

```text
User uploads document
↓
Document stored in Supabase Storage / IPFS
↓
System generates document hash
↓
Document metadata stored in documents table
↓
Hash is later used for blockchain proof or audit comparison
```

### 21.2 Document Table Links

The `documents` table can link to:

```text
agency_id
supplier_id
tender_id
bid_id
award_id
```

### 21.3 Document Types

```text
agency_registration
supplier_registration
tender_document
bid_proposal
winner_justification
```

### 21.4 Hash Rule

```text
Use one backend hash method everywhere.
Store hash_algorithm with every document.
```

This prevents audit mismatch later.

---

## 22. Blockchain Event Data Flow

Blockchain event flow is used for every important proof action.

### 22.1 General Flow

```text
System action needs blockchain proof
↓
Create blockchain_events row as pending
↓
User confirms transaction using Rabby Wallet
↓
Transaction is submitted to Ethereum Sepolia
↓
System waits for transaction confirmation
↓
If confirmed:
    tx_status = confirmed
    store tx_hash
    store block_number
    store confirmed_at
    update business status
↓
If failed:
    tx_status = failed
    store error_message
    store failed_at
    do not finalize business status
```

### 22.2 Blockchain Event Names

```text
AgencyWalletAuthorized
SupplierWalletAuthorized
TenderCreated
BidSubmitted
WinnerSelected
```

### 22.3 Critical Blockchain Rule

```text
Do not finalize business status until blockchain_events.tx_status = confirmed.
```

---

## 23. Email Notification Data Flow

Email notifications are tracked using a durable status model.

### 23.1 General Flow

```text
System needs to send email
↓
Create email_notifications row as pending
↓
Send email through SMTP
↓
Email sent?
```

If yes:

```text
Update email_notifications.status = sent
Update sent_at timestamp
```

If no:

```text
Update email_notifications.status = failed
Store error_message
```

### 23.2 Email Use Cases

```text
Agency rejection email
Agency approval email
Supplier rejection email
Supplier approval email
Auditor invitation email
Winning supplier notification email
```

---

## 24. Activity Log Data Flow

Activity logs provide traceability.

### 24.1 General Flow

```text
Important system action occurs
↓
Create activity_logs row
↓
Store actor type, actor id, action, entity type, entity id, and details
```

### 24.2 Activity Log Examples

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

### 24.3 Activity Log Purpose

Activity logs support:

```text
auditor timeline
admin monitoring
public trust
system debugging
forensic review
```

---

## 25. End-to-End Procurement Data Flow

This is the complete BGPS procurement data flow from registration to public verification.

```text
Agency registers
↓
Agency document uploaded
↓
Agency document hash generated
↓
Agency pending record stored
↓
Admin reviews agency
↓
Admin approves agency
↓
Agency wallet authorized on blockchain
↓
Agency becomes approved and blockchain_authorized
↓
Agency appears in public notification
↓
Agency creates tender
↓
Tender document uploaded
↓
Tender hash generated
↓
Tender saved as draft
↓
Agency publishes tender
↓
Tender hash recorded on blockchain
↓
Tender becomes published
↓
Supplier views tender
↓
Supplier submits bid
↓
Bid document uploaded
↓
Bid hash generated
↓
Bid hash recorded on blockchain
↓
Bid becomes on_chain_confirmed
↓
Tender closes after deadline
↓
Agency reviews bids
↓
Agency selects winner
↓
Winner justification hash generated
↓
WinnerSelected proof recorded on blockchain
↓
Tender becomes awarded
↓
Winning bid becomes winner
↓
Winning supplier receives email
↓
Winning result appears publicly
↓
Auditor verifies hashes
↓
Public Citizen verifies blockchain proof
```

---

## 26. Data Consistency Rules

The following rules keep the system logically correct.

```text
Agency dashboard access requires:
agencies.status = approved
AND agencies.blockchain_authorized = true

Supplier dashboard access requires:
suppliers.status = approved
AND suppliers.blockchain_authorized = true

Tender publishing requires:
agency approved
agency blockchain_authorized
tender status = draft
tender_hash exists

Bid submission requires:
supplier approved
supplier blockchain_authorized
tender status = published
current time before submission_deadline
no duplicate bid for same tender and supplier

Winner selection requires:
tender status = closed
bid belongs to tender
bid status = on_chain_confirmed
winning_supplier_id matches bid.supplier_id

Public winning result requires:
tender status = awarded
winning bid status = winner
award blockchain transaction confirmed
award transaction hash exists
```

---

## 27. Recommended Data Flow for Frontend Flow Demo Mode

For the current frontend-only stage, data should move through mock files and local state.

```text
Mock data file
↓
Frontend service
↓
React component
↓
Button click changes local state
↓
Status badge updates
↓
Public notification updates
```

Example:

```text
mockAgencies.js
↓
admin-ui.service.js
↓
AgencyApprovalTable.jsx
↓
Click Approve Agency
↓
agency.status = approved
↓
agency.blockchain_authorized = true
↓
Verified Agencies notification updates
```

Frontend demo mode must not connect:

```text
Supabase
real Bhutan NDI
real Rabby Wallet
real Ethereum Sepolia
real SMTP
real backend validation
```

---

## 28. Recommended Data Flow for Real MVP

For the backend-connected MVP, data should move through API routes, services, repositories, and integrations.

```text
Frontend page/component
↓
Next.js API route
↓
Validation layer
↓
Service layer
↓
Repository layer
↓
Supabase PostgreSQL
↓
Storage / Blockchain / Email integration
↓
Response returned to frontend
↓
UI status updated
```

Correct backend architecture:

```text
API routes should be thin.
Services should contain business logic.
Repositories should contain database access.
Blockchain services should contain blockchain logic.
Email services should contain email logic.
Hash services should contain hash logic.
```

---

## 29. Final Data Flow Summary

BGPS data flow is strong because every important action leaves a trace:

```text
Registration creates database record
Document upload creates storage record and hash
Approval creates status change
Blockchain action creates blockchain event
Email action creates email notification record
Procurement action creates activity log
Award creates public result
Audit compares hashes
Public verification stores public view
```

The most important rule is:

```text
Database status must match blockchain confirmation status.
```

The second most important rule is:

```text
Public notification must only show confirmed and transparency-safe data.
```

The third most important rule is:

```text
Documents stay off-chain; hashes become proof.
```

This data flow makes BGPS suitable for a professional hackathon MVP and future production development.
