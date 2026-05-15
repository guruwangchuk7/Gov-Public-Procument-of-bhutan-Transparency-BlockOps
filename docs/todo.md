# Project Todo List: Bhutan Procurement Transparency Platform

This todo list breaks down the frontend development of the Bhutan Procurement Transparency Platform into manageable, feature-specific tasks.

## Phase 1: Project Setup & Design System
- [ ] **Initialize Project**
    - [ ] Setup Next.js with TailwindCSS and TypeScript.
    - [ ] Configure `tailwind.config.js` with the primary color palette (#1E7A5A, #DFF5EA, etc.).
    - [ ] Set up project folder structure (`/app`, `/components`, `/dashboard`, etc.).
- [ ] **Core Design System**
    - [ ] Setup Typography (Inter / Plus Jakarta Sans).
    - [ ] Create Reusable Components:
        - [ ] Buttons (Primary, Secondary, Danger, Ghost).
        - [ ] Cards (Rounded-2xl, subtle shadow).
        - [ ] Tables (Clean enterprise style).
        - [ ] Status Badges (Approved, Pending, Rejected, Under Review).
        - [ ] Form Inputs (Styled text fields, file uploads).
- [ ] **Global Layout**
    - [ ] Implement Top Navbar (Logo, User Profile, Notifications).
    - [ ] Implement Sidebar (Collapsible, dynamic navigation based on role).
    - [ ] Implement Main Content Wrapper (Responsive padding/spacing).

## Phase 2: Landing Page & Public Transparency Portal
- [ ] **Landing Page**
    - [ ] Hero Section (Headline: "Transparent Government Procurement...").
    - [ ] Features Section (4-card layout).
    - [ ] Workflow Section (Visual representation of registration → transparency).
    - [ ] Statistics Section (Active Tenders, Approved Vendors, etc.).
- [ ] **Public Transparency Portal**
    - [ ] Search & Filter Bar (By Tender ID, Agency, Vendor).
    - [ ] Procurement Cards (Awarded tenders with status).
    - [ ] Transparency Timeline View (Step-by-step history of a specific procurement).

## Phase 3: Authentication & Onboarding
- [ ] **Login & Registration**
    - [ ] Implement Centered Auth Card layout.
    - [ ] Registration Form (Organization details, Type selector).
    - [ ] Login Form (Email/Password).
- [ ] **Onboarding Status**
    - [ ] "Pending Approval" status page for newly registered organizations.

## Phase 4: PMDD Dashboard (Government Admin)
- [ ] **Overview**
    - [ ] Statistics Cards (Pending Agency/Vendor Requests, Total Approved).
- [ ] **Requests Management**
    - [ ] Implement Pending Requests Table with Approve/Reject actions.
    - [ ] View Details Modal for organization verification.
- [ ] **History**
    - [ ] List of Approved Agencies and Vendors.

## Phase 5: Procuring Agency Dashboard
- [ ] **Tender Management**
    - [ ] Implement Create Tender Form (Title, Budget, Deadline, File Upload).
    - [ ] Active Tenders List (Table/Cards).
- [ ] **Bid Evaluation**
    - [ ] Submitted Bids Table (Vendor pricing and status).
    - [ ] Comparison View for vendor proposals.
- [ ] **Approvals & History**
    - [ ] Approval workflow dashboard for ministry review.
    - [ ] Detailed Procurement History.

## Phase 6: Bidder Dashboard (Vendors)
- [ ] **Tender Discovery**
    - [ ] "Available Tenders" list with search/filter.
    - [ ] Tender Details View with "Submit Bid" CTA.
- [ ] **Bid Management**
    - [ ] My Bids Dashboard (Status tracking: Submitted, Pending, Awarded).
    - [ ] Bid Submission Form (Proposal text, pricing, document upload).

## Phase 7: Auditor Dashboard (Lightweight Prototype)
- [ ] **Audit Monitoring**
    - [ ] Audit Logs Timeline (Feed of all procurement activities).
    - [ ] Verification Status Indicators.
- [ ] **Alerts & Reports**
    - [ ] Audit Alerts Panel (Duplicate activities, delayed approvals).

## Phase 8: Final Polish & UX
- [ ] **Responsive Design**
    - [ ] Verify Mobile Sidebar (Hamburger menu).
    - [ ] Ensure all tables/grids are responsive.
- [ ] **Animations & Interactions**
    - [ ] Add subtle hover effects to cards and buttons.
    - [ ] Smooth transitions between dashboard pages.
- [ ] **Final Review**
    - [ ] Align with Design Document aesthetics (Clean, Government-grade).
    - [ ] SEO Best Practices (Title tags, Meta descriptions).
