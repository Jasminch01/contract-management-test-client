# Growth Grain Contract Management System

## Overview

Growth Grain Contract Management is a comprehensive web application designed to streamline contract management processes for agricultural businesses. The system provides tools for creating, tracking, and managing grain contracts with features for buyers, sellers, and administrators.

## Features

### 1. User Authentication System

- Secure login/logout functionality
- Role-based access control (Admin, Buyer, Seller)
- Password reset via email
- User profile management
- Session management

### 2. Dashboard

- Overview of active contracts
- Quick stats (total contracts, pending approvals, expiring soon)
- Recent activity feed
- Graphical representation of contract status distribution
- Upcoming important dates

### 3. Contract Management (CRUD Operations)

- **Create**: Add new contracts with all relevant details
- **Read**: View contract details in organized layouts
- **Update**: Modify existing contract terms and conditions
- **Delete**: Archive or remove contracts (with confirmation)
- **Bulk operations**: Manage multiple contracts simultaneously

### 4. Advanced Search & Filtering

- Full-text search across all contract fields
- Filter by:
  - Contract status (Draft, Active, Completed, Cancelled)
  - Date ranges (created, modified, expiration)
  - Buyer/Seller information
  - Grain type and quality specifications
  - Price ranges and delivery terms
- Saved search/filter presets

### 5. Export Functionality

- Export contract data to:
  - CSV (for spreadsheet analysis)
  - PDF (for printing or sharing)
- Customizable export templates
- Batch export multiple contracts
- Scheduled automatic exports

### 6. Buyer/Seller Management

- Maintain directories of buyers and sellers
- Contact information management
- Performance history tracking
- Relationship notes and tags
- Communication logs

### 7. Notes System

- Add notes to contracts, buyers, or sellers
- Categorize notes (general, quality, payment, etc.)
- Attach documents to notes
- Note search functionality
- Pin important notes

### 8. Email Communication

- Send emails directly from the system
- Email templates for common communications
- Track email history per contract
- Scheduled email reminders
- Read receipts and delivery notifications

## Technology Stack

### Frontend

- Next.js
- Redux for state management
- Chart.js for data visualization
- react-pdf for PDF generation
- react-data-table-component for data tables

### Backend

- Node.js with Express.js
- MongoDB with Mongoose ORM
- JWT for authentication
- Nodemailer for email functionality
- PDFKit for server-side PDF generation
- ExcelJS for CSV/Excel exports
