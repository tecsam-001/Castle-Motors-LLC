# Castle Motors - Auto Dealership Platform

## Overview

Castle Motors is a comprehensive automotive dealership platform that provides both an inventory management system and professional auto broker services. The application allows customers to browse available vehicles, request broker services for finding specific cars at auction, and contact the dealership. It features a modern React frontend with a robust Express.js backend, integrated with PostgreSQL for data persistence and Google Cloud Storage for file management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript throughout the stack for consistent type safety
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **File Uploads**: Uppy integration with direct-to-cloud uploads for efficient file handling
- **Development**: Hot module replacement and error overlay for improved developer experience

### Data Layer
- **Database**: PostgreSQL with Neon serverless driver for scalable database connections
- **Schema**: Well-defined schemas for vehicles, broker requests, contact inquiries, and users
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Validation**: Zod schemas for runtime type validation and form handling

### File Storage Strategy
- **Cloud Storage**: Google Cloud Storage for scalable file management
- **Upload Strategy**: Direct-to-cloud uploads using presigned URLs to reduce server load
- **ACL System**: Custom object access control system for managing file permissions
- **Integration**: Uppy dashboard for user-friendly file upload experience

### Form Handling & Validation
- **Form Library**: React Hook Form for performant form state management
- **Validation**: Zod resolvers for consistent validation between frontend and backend
- **UI Components**: Integrated form components with error handling and accessibility

### Code Organization
- **Monorepo Structure**: Shared TypeScript types and schemas between client and server
- **Path Aliases**: Configured for clean imports and better code organization
- **Component Structure**: Modular UI components with clear separation of concerns

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL for serverless database hosting
- **File Storage**: Google Cloud Storage for asset management
- **Authentication**: Replit's sidecar service for Google Cloud credentials

### UI & Design System
- **Component Library**: Radix UI primitives for accessibility-first components
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

### Development Tools
- **Replit Integration**: Cartographer plugin and runtime error modal for Replit environment
- **Build Tools**: ESBuild for server bundling, PostCSS for CSS processing
- **File Uploads**: Uppy ecosystem (core, dashboard, AWS S3 plugin, React integration)

### Form & Data Management
- **Form Validation**: Hookform resolvers with Zod integration
- **HTTP Client**: Native fetch with custom wrapper for API requests
- **State Management**: TanStack Query for server state and caching