# BGPS Risk Checklist

## 1. Purpose

This document lists the main risks that can affect the BGPS MVP demo and explains how to reduce them.

BGPS is a role-based blockchain government procurement system with the following main flows:

- Admin approval flow
- Procuring Agency registration and tender flow
- Supplier / Bidder registration and bid flow
- Auditor verification flow
- Public Citizen transparency flow
- Supabase Database and Storage integration
- Ethereum Sepolia blockchain proof integration
- SMTP email notification integration

For the current stage, the project may run in Frontend Flow Demo Mode using mock data, fake button actions, and local UI state. Later, these same risks must be handled in the real backend-connected MVP.

---

## 2. Risk Severity Levels

| Severity | Meaning |
|---|---|
| High | Can break the demo or cause incorrect procurement logic |
| Medium | Can confuse users or create incomplete demo behavior |
| Low | Can reduce polish, trust, or clarity but may not stop the demo |

---

## 3. Frontend Flow Demo Mode Risks

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| User flow is confusing | High | Judges may not understand how Admin, Agency, Supplier, Auditor, and Public Citizen connect | Use clear role selection, dashboard titles, breadcrumbs, and step indicators |
| Too many screens | Medium | Demo may feel scattered or hard to follow | Keep each role dashboard focused on the main flow |
| Mock data does not update | High | Public notification, approval, bid, and award flows may look broken | Use shared local state or mock service functions |
| Public notification does not update automatically | High | The main transparency feature will fail visually | Update mock notifications after approval, auditor activation, and winner selection |
| Fake actions look like real backend actions | Medium | Judges may misunderstand the prototype stage | Show “Frontend Flow Demo Mode” badge clearly |
| Buttons do not show result after click | High | User may think the system is not working | Every action must change status, card, badge, or timeline |
| Missing loading, empty, and success states | Medium | UI feels incomplete | Add mock loading and success messages |
| Navigation links break | High | Demo can stop during presentation | Test all route links before demo |
| Dashboard sidebar breaks on mobile | Medium | Presentation may look unpolished | Make sidebar collapsible |
| Inconsistent status badges | Medium | Users may not understand pending, approved, confirmed, failed | Use one shared StatusBadge component |
| Color palette inconsistent | Low | UI looks less professional | Use the approved blue palette only |
| Footer missing BlockOps copyright | Low | Branding requirement is incomplete | Add “Copyright © 2026 BlockOps. All rights reserved.” |

---

## 4. Admin Flow Risks

The Admin flow includes login with Bhutan NDI, Rabby Wallet connection, agency approval, supplier approval, auditor invitation, activity logs, and blockchain events.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Admin login not clearly shown | Medium | Judges may not understand Admin identity verification | Use fake “Connect NDI” and “Connect Wallet” buttons in demo mode |
| Admin can approve agency without visual blockchain confirmation | High | The approval flow may look incomplete | Show blockchain event pending → confirmed |
| Agency approved but not shown publicly | High | Public notification flow breaks | Automatically add approved agency to Verified Procuring Agencies |
| Supplier approved but not shown publicly | High | Public notification flow breaks | Automatically add approved supplier to Verified Suppliers / Bidders |
| Auditor added but not shown publicly | High | Auditor notification flow breaks | Add auditor to Verified Auditors after successful mock activation |
| Rejected agency/supplier appears publicly | High | Public information becomes incorrect | Only show approved and blockchain_authorized records |
| Email status not shown | Medium | Approval/rejection notification flow feels invisible | Show email status pending → sent / failed |
| Activity logs not updated | Medium | Audit trail looks weak | Add mock activity log after every admin action |
| Blockchain event table empty | Medium | Blockchain proof story becomes weak | Add mock blockchain event rows for approvals |
| Admin can approve already approved record repeatedly | Low | Demo data may look inconsistent | Disable button or change button text after approval |

---

## 5. Procuring Agency Flow Risks

The Procuring Agency flow includes registration, approval, tender creation, tender publishing, tender closing, bid review, winner selection, award confirmation, and notification to the winning supplier.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Agency enters dashboard before approval | High | Breaks role logic | In real backend, require status = approved and blockchain_authorized = true |
| Agency registration does not go to pending page | Medium | Registration flow feels incomplete | Redirect to mock pending page after submit |
| Tender created but not displayed | High | Agency flow appears broken | Add created tender to mock tender list as draft |
| Tender publishes without proof status | Medium | Blockchain story becomes weak | Show pending → confirmed transaction status |
| Tender remains draft after publish button | High | Supplier cannot see open tender in demo | Change tender status from draft to published |
| Tender publishing fails but UI says published | High | Incorrect demo logic | In real MVP, publish only after confirmed blockchain transaction |
| Winner selected before tender is closed | High | Breaks procurement process | Real backend must require tender status = closed |
| Winner selected without blockchain confirmation | High | Public trust logic breaks | Public result should appear only after award confirmation |
| Winning bid result does not update public notification | High | Public transparency flow fails | Automatically add winning bid to Winning Bid Results |
| Winning supplier email not shown | Medium | Notification flow feels incomplete | Show email status pending → sent |
| Other bids remain active after winner selected | Medium | Award flow looks inconsistent | Set other bids to rejected after winner selection |
| Invalid bid hash still accepted | High | Audit story breaks | Real backend must verify bid hashes before award |

---

## 6. Supplier / Bidder Flow Risks

The Supplier / Bidder flow includes registration, approval, viewing published tenders, bid submission, proposal upload, blockchain confirmation, bid tracking, and award result viewing.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Supplier enters dashboard before approval | High | Breaks role logic | Real backend must require status = approved and blockchain_authorized = true |
| Supplier registration does not show pending | Medium | Registration flow feels incomplete | Redirect to mock pending page |
| Published tender not visible to supplier | High | Supplier cannot continue the demo | Ensure published tenders appear in supplier open tenders list |
| Supplier can bid on draft tender | High | Procurement process breaks | Real backend must allow bidding only on published tenders |
| Supplier can bid after deadline | High | Tender fairness issue | Real backend must check current time before submission_deadline |
| Supplier can submit duplicate bid | High | Data inconsistency | Use unique index on tender_id + supplier_id |
| Bid created but no hash shown | Medium | Blockchain proof story weakens | Show mock bid hash after submission |
| Bid status does not change after confirmation | High | Blockchain flow appears broken | Change bid submitted → on_chain_confirmed |
| Failed blockchain state not supported | Medium | Real transaction failure later may break UI | Add pending, confirmed, and failed UI states |
| Supplier cannot view award result | Medium | Supplier journey feels incomplete | Add award result card or status page |

---

## 7. Auditor Flow Risks

The Auditor flow includes invitation, temporary credentials, NDI verification, wallet connection, account activation, audit search, timeline review, hash comparison, and audit report update.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Auditor invitation link flow missing | Medium | Auditor activation story becomes unclear | Add invitation page with mock token check |
| Temporary credentials not marked as used | Medium | Real security story weakens | In real backend, set invitation status to used |
| Auditor does not become active | High | Auditor cannot appear in public notification | Set auditor is_active = true in mock flow |
| Active auditor not shown publicly | High | Public notification requirement fails | Add active auditor to Verified Auditors |
| Audit search returns no result | High | Auditor demo cannot proceed | Seed mock tender, bid, award, document, and blockchain event |
| Audit timeline missing | Medium | Verification story is weak | Build timeline from mock activity logs and blockchain events |
| Hash comparison unclear | High | Main auditor purpose is not visible | Show database hash, blockchain hash, and match status |
| Suspicious result not supported | Medium | Audit flow lacks realism | Support verified and suspicious statuses |
| Auditor can edit procurement result | High | Breaks role permission logic | Auditor should only verify and report, not modify tender/award outcome |

---

## 8. Public Citizen and Public Notification Risks

The Public Citizen flow includes public portal access, viewing published/awarded tenders, opening public tender records, verifying blockchain proof, and storing public tender views without login.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Public Citizen requires login | High | Contradicts the flowchart | Public Citizen must view without login |
| Public notification section is hidden | Medium | Public value is not obvious | Put Notifications in landing page header |
| Approved agencies do not appear automatically | High | Public notification flow breaks | Update notification state after Admin approves agency |
| Approved suppliers do not appear automatically | High | Public notification flow breaks | Update notification state after Admin approves supplier |
| Active auditors do not appear automatically | High | Public notification flow breaks | Update notification state after Auditor activation |
| Winning bid does not appear after award | High | Public transparency story fails | Update Winning Bid Results after award confirmation |
| Unconfirmed winning bid appears publicly | High | False public information | Show winner only when award transaction is confirmed |
| Private bid documents are visible | High | Confidentiality issue | Only show public-safe fields |
| Public proof page has no transaction/hash | Medium | Blockchain verification story weakens | Show mock Sepolia transaction hash and proof card |
| Verification failed/pending state missing | Medium | Real blockchain uncertainty not represented | Support trusted, pending, failed, suspicious |
| Public tender view not recorded | Low | Analytics/audit detail missing | In real backend, store public_tender_views |

---

## 9. Blockchain and Sepolia Risks

The flowchart uses blockchain events for agency authorization, supplier authorization, tender publishing, bid submission, award selection, auditor verification, and public proof checking.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Sepolia transaction is slow | High | Live demo may freeze | Show pending state and allow UI to continue |
| Wallet is not connected | High | Blockchain actions cannot happen | Add wallet connection check |
| Wrong wallet network | High | Transaction fails | Add Sepolia network guard |
| Transaction fails but status updates anyway | High | Data becomes incorrect | Update business status only after confirmation |
| No Sepolia ETH | High | Transaction cannot be sent | Fund demo wallets before demo |
| RPC provider fails | High | Chain interaction may fail | Prepare backup RPC provider |
| Etherscan delay | Medium | Proof may not appear instantly | Show transaction hash inside app |
| Duplicate blockchain events | Medium | Proof tracking becomes confusing | Use unique tx_hash and event linkage |
| Hash mismatch | High | Audit verification fails | Use one backend hash method |
| Full documents stored on-chain | High | Bad architecture and high cost | Store only hashes on-chain |

---

## 10. Supabase Database and Storage Risks

The ERD includes admins, agencies, suppliers, auditor_invitations, auditors, tenders, bids, awards, documents, blockchain_events, audit_reports, activity_logs, email_notifications, and public_tender_views.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| Missing seed data | High | Demo starts empty | Prepare demo seed data |
| RLS too strict | High | Users cannot access data | Test role policies carefully |
| RLS too weak | High | Users may see private data | Restrict by role and public-safe views |
| Unique email or wallet conflict | Medium | Registration fails unexpectedly | Use clean demo accounts |
| Duplicate bid records | High | Supplier can bid multiple times | Unique index on tender_id + supplier_id |
| Missing document hash | High | Audit verification impossible | Generate and store document_hash |
| Different hash algorithm used | High | Hash mismatch | Store hash_algorithm and centralize hashing |
| Storage upload fails | Medium | Tender/bid documents missing | Show retry/error states |
| Broken storage URL | Medium | Uploaded files cannot be previewed | Validate storage_url |
| Circular dependency in data updates | Medium | Insert/update sequence can fail | Create main record first, then blockchain event, then update status |

---

## 11. Email Notification Risks

The flowchart uses email notifications for agency approval/rejection, supplier approval/rejection, auditor invitations, and winning supplier notifications.

| Risk | Severity | Why It Can Break the Demo | Fix |
|---|---|---|---|
| SMTP fails | Medium | Email not sent | Store status as failed and show retry |
| Email sent before blockchain confirmation | High | User receives incorrect result | Send only after confirmed status where required |
| Winner email sent before award finalized | High | Supplier may receive wrong award info | Send after WinnerSelected confirmation |
| Wrong recipient email | Medium | Notification goes to wrong person | Use database email from approved record |
| Email status not visible | Low | Flow feels incomplete | Show pending/sent/failed badges |
| Auditor invitation email fails | Medium | Auditor cannot activate | Show failed status and retry option |

---

## 12. Backend Validation Risks for Real MVP

These are not enforced in Frontend Flow Demo Mode, but must be enforced before real backend integration.

| Rule | Severity | Required Backend Check |
|---|---|---|
| Admin approval | High | Only active Admin can approve agencies/suppliers |
| Agency access | High | Agency must be approved and blockchain_authorized |
| Supplier access | High | Supplier must be approved and blockchain_authorized |
| Tender publishing | High | Agency must be approved and tender must have hash |
| Bid submission | High | Tender must be published and before deadline |
| Duplicate bid | High | Supplier cannot bid twice on same tender |
| Winner selection | High | Tender must be closed |
| Winning supplier match | High | winning_supplier_id must match winning_bid.supplier_id |
| Award finalization | High | Award blockchain transaction must be confirmed |
| Public winner display | High | Tender awarded + bid winner + blockchain confirmed |
| Auditor activation | Medium | Invitation must be valid, unused, and not expired |
| Audit verification | High | Compare database hash with blockchain hash |

---

## 13. Role Permission Risk Matrix

| Action | Admin | Procuring Agency | Supplier / Bidder | Auditor | Public Citizen |
|---|---|---|---|---|---|
| Approve agency | Allowed | Not allowed | Not allowed | Not allowed | Not allowed |
| Approve supplier | Allowed | Not allowed | Not allowed | Not allowed | Not allowed |
| Add auditor | Allowed | Not allowed | Not allowed | Not allowed | Not allowed |
| Create tender | Not allowed | Allowed | Not allowed | Not allowed | Not allowed |
| Publish tender | Not allowed | Allowed | Not allowed | Not allowed | Not allowed |
| Submit bid | Not allowed | Not allowed | Allowed | Not allowed | Not allowed |
| Select winner | Not allowed | Allowed | Not allowed | Not allowed | Not allowed |
| Verify audit record | Not allowed | Not allowed | Not allowed | Allowed | Not allowed |
| View public notifications | Allowed | Allowed | Allowed | Allowed | Allowed |
| Verify public proof | Allowed | Allowed | Allowed | Allowed | Allowed |

---

## 14. Pre-Demo Checklist

Before presenting the frontend MVP, confirm:

```text
Landing page loads
Frontend Flow Demo Mode badge is visible
Notifications dropdown opens
Verified Agencies panel works
Verified Suppliers / Bidders panel works
Verified Auditors panel works
Winning Bid Results panel works
Select Role page works
Admin dashboard opens
Fake NDI connect works
Fake Wallet connect works
Approve Agency button changes status
Approved Agency appears in public notification
Approve Supplier button changes status
Approved Supplier appears in public notification
Add Auditor button works
Auditor appears in public notification
Agency dashboard opens
Agency registration flow works
Tender creation creates draft card
Publish Tender changes draft to published
Supplier dashboard opens
Published tender appears for supplier
Bid submission creates submitted bid
Blockchain confirm changes bid to on_chain_confirmed
Agency can select winner
Winner selection updates bid to winner
Winner appears in public notification
Email status changes to sent
Auditor dashboard opens
Audit search works
Hash comparison shows verified or suspicious
Transparency tender page opens
Proof page shows mock Sepolia transaction
Footer shows BlockOps copyright
No broken routes
No TypeScript files if using JavaScript
Responsive layout works on laptop/mobile
```

---

## 15. Real MVP Integration Checklist

Before connecting the real backend, confirm:

```text
Supabase schema matches ERD
RLS policies are planned
Supabase Storage buckets are ready
Backend validation rules are implemented
NDI mock adapter can be replaced
Rabby Wallet connection works
Sepolia network guard works
Smart contract is tested
Smart contract is deployed to Sepolia
Demo wallets have Sepolia ETH
Email provider is configured
Hashing logic is centralized
Activity logging works
Blockchain event tracking works
Public notification queries are public-safe
Private bid files are not public
```

---

## 16. Highest Priority Risks to Fix First

Fix these first because they can break the demo story:

1. Broken navigation between role dashboards
2. Public notification not updating automatically
3. Agency/supplier approval status not changing visually
4. Tender publish status not changing from draft to published
5. Bid status not changing from submitted to on_chain_confirmed
6. Winner result not appearing publicly
7. Auditor hash verification not showing verified/suspicious
8. Missing blockchain pending/confirmed status
9. Missing Frontend Flow Demo Mode label
10. Missing BlockOps footer copyright

---

## 17. Final Risk Summary

The biggest current risk is not the real backend or blockchain.

The biggest current risk is that the demo flow may not clearly communicate how the system works.

The frontend must clearly show:

```text
who performs each action
what status changed
what proof was created
what email was sent
what appears publicly
what the auditor verifies
what the citizen can trust
```

If these points are clear, the MVP demo will be understandable, professional, and strong for an international hackathon.
