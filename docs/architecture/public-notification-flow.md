# Public Notification Flow

## 1. Purpose

The Public Notification Flow explains how public-facing procurement updates are shown to citizens in BGPS.

In the final BGPS system, Public Citizens do not need to log in. They can open the public transparency area and view verified procurement updates such as:

- Verified Procuring Agencies
- Verified Suppliers / Bidders
- Verified Auditors
- Published and awarded tenders
- Winning bid results
- Blockchain proof status
- Trusted procurement status

In the current frontend prototype, this flow can be shown using mock data, fake status changes, and local UI state.

---

## 2. Public Citizen Access Rule

Public Citizen does **not** log in.

Public Citizen does **not** connect Bhutan NDI.

Public Citizen does **not** connect Rabby Wallet.

Public Citizen only views public information.

According to the flowchart, Public Citizen follows this flow:

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
Show trusted procurement status
```

The system may store public view activity, but only as a public tender view record.

---

## 3. Public Notification Location

For the MVP, public notifications should appear in the landing page header as a dropdown or panel.

Recommended navigation:

```text
Landing Page Header
│
├── Home
├── How It Works
├── Transparency
├── Notifications
└── Select Role
```

The **Notifications** section should show:

```text
Verified Procuring Agencies
Verified Suppliers / Bidders
Verified Auditors
Winning Bid Results
```

---

## 4. Public Notification Categories

The public notification section should be divided into four main categories.

```text
Public Notifications
│
├── Verified Procuring Agencies
├── Verified Suppliers / Bidders
├── Verified Auditors
└── Winning Bid Results
```

Each category must only show information that is confirmed, public-safe, and useful for transparency.

---

## 5. Automatic Notification Update Rule

The public notification section must update automatically when important verified actions are completed in the system.

This applies to:

1. Admin approval of Procuring Agency registration
2. Admin approval of Supplier / Bidder registration
3. Successful Auditor addition and activation
4. Winning bid confirmation after award

The public notification section should not require manual public posting.

Once the required status is reached, the item should automatically become visible in the notification section.

---

## 6. Automatic Agency Notification Flow

When Admin approves a Procuring Agency registration, the agency must automatically appear in the public notification section.

### Flowchart Source

This comes from the Admin approval flow:

```text
View pending agency registrations
↓
Review agency documents, NDI, and wallet
↓
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
↓
Update blockchain event to confirmed
↓
Mark agency blockchain_authorized true
↓
Create agency approval email as pending
↓
Send agency approval email
↓
Agency approval completed
↓
Agency automatically appears in Public Notifications
```

### Public Display Rule

A Procuring Agency should appear publicly only when:

```text
agency status = approved
blockchain_authorized = true
blockchain event = confirmed
```

### Public Notification Placement

```text
Notifications
↓
Verified Procuring Agencies
```

### Public Notification Example

```text
Verified Procuring Agency

Agency: Ministry of Works and Transport
Status: Approved
Blockchain Authorization: Confirmed
Proof: Available
```

### Frontend Demo Behavior

In Frontend Flow Demo Mode:

```text
Admin clicks Approve Agency
↓
Agency status changes from pending to approved
↓
Blockchain status changes from pending to confirmed
↓
Agency automatically appears in Verified Procuring Agencies notification panel
```

---

## 7. Automatic Supplier / Bidder Notification Flow

When Admin approves a Supplier / Bidder registration, the supplier must automatically appear in the public notification section.

### Flowchart Source

This comes from the Admin supplier approval flow:

```text
View pending supplier registrations
↓
Review supplier documents, NDI, and wallet
↓
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
↓
Update blockchain event to confirmed
↓
Mark supplier blockchain_authorized true
↓
Create supplier approval email as pending
↓
Send supplier approval email
↓
Supplier approval completed
↓
Supplier automatically appears in Public Notifications
```

### Public Display Rule

A Supplier / Bidder should appear publicly only when:

```text
supplier status = approved
blockchain_authorized = true
blockchain event = confirmed
```

### Public Notification Placement

```text
Notifications
↓
Verified Suppliers / Bidders
```

### Public Notification Example

```text
Verified Supplier / Bidder

Supplier: Druk Infrastructure Pvt. Ltd.
Status: Approved
Blockchain Authorization: Confirmed
Proof: Available
```

### Frontend Demo Behavior

In Frontend Flow Demo Mode:

```text
Admin clicks Approve Supplier
↓
Supplier status changes from pending to approved
↓
Blockchain status changes from pending to confirmed
↓
Supplier automatically appears in Verified Suppliers / Bidders notification panel
```

---

## 8. Automatic Auditor Notification Flow

When Admin successfully adds an Auditor and the Auditor account becomes active, the auditor must automatically appear in the public notification section.

### Flowchart Source

This comes from the Admin Add Auditor flow and Auditor activation flow:

```text
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
Email sent?
↓
Update email status to sent
↓
Auditor receives invitation email
↓
Auditor opens invitation link
↓
Enter temporary username and password
↓
System checks token, expiry time, and used status
↓
Credentials valid and unused?
↓
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
↓
Auditor automatically appears in Public Notifications
```

### Public Display Rule

An Auditor should appear publicly only when:

```text
auditor account = active
temporary credentials = used
identity verification completed
wallet verification completed
```

### Public Notification Placement

```text
Notifications
↓
Verified Auditors
```

### Public Notification Example

```text
Verified Auditor

Auditor: Karma Dorji
Status: Active Auditor
Verification: Completed
```

### Frontend Demo Behavior

In Frontend Flow Demo Mode:

```text
Admin clicks Add Auditor
↓
Auditor invitation status becomes sent
↓
Auditor becomes active in mock data
↓
Auditor automatically appears in Verified Auditors notification panel
```

---

## 9. Automatic Winning Bid Notification Flow

When a Procuring Agency selects a winning bid and the award transaction is confirmed, the winning result must automatically appear in the public notification section.

### Flowchart Source

This comes from the Procuring Agency tender evaluation and winner selection flow:

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
Select winner?
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
↓
Update blockchain event to confirmed
↓
Store award transaction hash
↓
Tender status: Awarded
↓
Winning bid status: winner
↓
Other bids status: rejected
↓
Create winning supplier email as pending
↓
Notify winning supplier
↓
Email sent?
↓
Update email status to sent
↓
Winning bid result automatically appears in Public Notifications
```

### Public Display Rule

A winning bid result should appear publicly only when:

```text
tender status = awarded
winning bid status = winner
award blockchain event = confirmed
award transaction hash exists
```

Do not show the winner publicly if the award transaction is still pending or failed.

### Public Notification Placement

```text
Notifications
↓
Winning Bid Results
```

### Public Notification Example

```text
Winning Bid Result

Tender: Rural Road Maintenance Project
Procuring Agency: Ministry of Works and Transport
Winning Supplier: Druk Infrastructure Pvt. Ltd.
Awarded Amount: Nu. 4,500,000
Award Status: Awarded
Proof: Sepolia Confirmed
Email Status: Sent
```

### Frontend Demo Behavior

In Frontend Flow Demo Mode:

```text
Agency selects winner
↓
Award blockchain status becomes pending
↓
User clicks Confirm Blockchain
↓
Blockchain status becomes confirmed
↓
Tender status becomes awarded
↓
Winning bid status becomes winner
↓
Winning supplier email status becomes sent
↓
Winning result automatically appears in Winning Bid Results notification panel
```

---

## 10. Public Tender Record Flow

When a Public Citizen opens a public tender record, the system should show:

```text
Agency
Winner
Amount
Timeline
Proof
```

From the flowchart:

```text
Open public tender record
↓
View agency, winner, amount, timeline, and proof
```

The public tender record should include:

| Public Field | Meaning |
|---|---|
| Tender title | Name of the tender |
| Procuring agency | Agency that created the tender |
| Tender status | Published / Awarded |
| Winning supplier | Supplier selected as winner |
| Awarded amount | Final winning bid amount |
| Timeline | Tender created, published, closed, awarded |
| Blockchain proof | Transaction hash or mock proof |
| Verification status | Trusted / Pending / Failed |

---

## 11. Public Blockchain Proof Verification Flow

From the flowchart:

```text
Click verify blockchain proof
↓
Check Ethereum Sepolia transaction or hash
↓
Blockchain proof found and hash matches?
↓
Yes → Show trusted procurement status
↓
No → Show verification failed or pending status
```

### Trusted Status

Show trusted status when:

```text
blockchain proof exists
transaction status = confirmed
database hash = blockchain hash
```

Example:

```text
Trusted Procurement Status

This procurement record is verified.
The stored hash matches the blockchain proof.
```

### Failed or Pending Status

Show failed or pending status when:

```text
blockchain proof is missing
transaction is pending
transaction failed
hash does not match
```

Example:

```text
Verification Pending

This record is waiting for blockchain confirmation.
```

or:

```text
Verification Failed

The database hash does not match the blockchain hash.
```

---

## 12. Public Notification Update Triggers

| System Action | Trigger Condition | Public Notification Result |
|---|---|---|
| Admin approves agency | Agency status becomes approved and blockchain_authorized becomes true | Agency appears under Verified Procuring Agencies |
| Admin approves supplier / bidder | Supplier status becomes approved and blockchain_authorized becomes true | Supplier appears under Verified Suppliers / Bidders |
| Admin successfully adds auditor | Auditor account becomes active | Auditor appears under Verified Auditors |
| Agency publishes tender | Tender status becomes published | Tender appears as public published tender |
| Agency selects winner | Award transaction confirmed and tender status becomes awarded | Winning bid appears under Winning Bid Results |
| Winning supplier email sent | Email status becomes sent | Winning result shows email notification completed |
| Auditor verifies record | Audit status becomes verified | Public proof can show trusted status |
| Public verifies proof | Blockchain proof found and hash matches | Public sees trusted procurement status |

---

## 13. Data Used by Public Notifications

### 13.1 Frontend Demo Mode Data

In the frontend prototype, public notifications should use mock data:

```text
mockAgencies.js
mockSuppliers.js
mockAuditors.js
mockTenders.js
mockBids.js
mockAwards.js
mockBlockchainEvents.js
mockNotifications.js
mockEmails.js
```

The UI should update using:

```text
local state
mock services
fake button actions
```

No real backend is required for this stage.

---

### 13.2 Future Backend Data

In the real MVP, the public notification section will read from:

```text
agencies
suppliers
auditors
tenders
bids
awards
blockchain_events
email_notifications
public_tender_views
```

---

## 14. Public Notification UI States

The notification section should support these states:

| State | Meaning |
|---|---|
| Loading | Public notification data is being prepared |
| Empty | No public updates yet |
| Verified | Agency, supplier, or auditor is confirmed |
| Pending | Blockchain or email status is still pending |
| Confirmed | Blockchain proof is confirmed |
| Failed | Blockchain or verification failed |
| Trusted | Public proof is valid |
| Suspicious | Auditor found mismatch |
| Demo Mode | Data is simulated for frontend flow testing |

---

## 15. Public Safety Rules

The public notification section must not expose private or sensitive information.

Do not show:

```text
private bid documents
supplier confidential proposal files
internal admin notes
rejection reasons
private user session data
temporary auditor credentials
full wallet metadata
unconfirmed winner as final result
```

Only show transparency-safe information.

Safe public information includes:

```text
agency name
supplier company name
auditor name
tender title
award amount
winner name
tender timeline
transaction hash
proof status
verification result
```

---

## 16. Public Notification Flow Diagram

```text
Admin approves agency
↓
Agency blockchain authorization confirmed
↓
Agency automatically appears in Verified Agencies

Admin approves supplier
↓
Supplier blockchain authorization confirmed
↓
Supplier automatically appears in Verified Suppliers / Bidders

Admin successfully adds auditor
↓
Auditor activates account
↓
Auditor automatically appears in Verified Auditors

Agency publishes tender
↓
Tender appears as published public record

Agency selects winner
↓
WinnerSelected blockchain event confirmed
↓
Tender status becomes awarded
↓
Winning bid status becomes winner
↓
Winning supplier email status becomes sent
↓
Winning bid automatically appears in Winning Bid Results

Public Citizen opens notification section
↓
Public Citizen views public procurement updates
↓
Public Citizen opens tender record
↓
Public Citizen verifies blockchain proof
↓
System shows trusted, pending, failed, or suspicious status
```

---

## 17. Frontend Flow Demo Mode Rules

For the current frontend-only prototype:

```text
Do not connect Supabase
Do not connect real Bhutan NDI
Do not connect real Rabby Wallet
Do not connect real Ethereum Sepolia
Do not send real email
Do not enforce real backend validation
```

Use:

```text
mock data
local state
fake buttons
simulated status changes
```

Demo actions:

```text
Approve Agency → status becomes approved → appears in Verified Agencies
Approve Supplier → status becomes approved → appears in Verified Suppliers / Bidders
Add Auditor → auditor becomes active → appears in Verified Auditors
Publish Tender → tender becomes published
Confirm Blockchain → blockchain status becomes confirmed
Select Winner → bid becomes winner
Send Email → email status becomes sent
Verify Proof → status becomes trusted or suspicious
```

---

## 18. Public Notification Success Criteria

The public notification flow is successful if users can clearly understand:

```text
which agencies are verified
which suppliers are verified
which auditors are active
which tender was awarded
who won the bid
whether blockchain proof is confirmed
whether the procurement record is trusted
```

For the hackathon demo, the section should help judges quickly see the public transparency value of BGPS.

---

## 19. Final Summary

The Public Notification Flow connects all major parts of BGPS:

```text
Admin approval
↓
Agency and supplier verification
↓
Auditor activation
↓
Tender publishing
↓
Winner selection
↓
Blockchain proof
↓
Public transparency
```

This makes the system easy to understand for citizens and strong for an international hackathon demo.
