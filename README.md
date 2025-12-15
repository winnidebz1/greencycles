# CRM & HRM Backend System

A comprehensive, secure, and scalable Customer Relationship Management (CRM) and Human Resource Management (HRM) system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### CRM Module
- **Client Management** - Complete client profile management with interaction history
- **Lead Tracking** - Capture and manage leads from multiple sources
- **Proposals & Estimates** - Create professional proposals with customizable templates
- **Invoices & Payments** - Generate invoices and track payments
- **Contracts Management** - Upload, manage, and track contract statuses
- **Ticketing System** - Support ticket management with client portal access

### HRM Module
- **Employee Management** - Comprehensive employee profiles and records
- **Attendance Tracking** - Daily attendance logs and reports
- **Leave Management** - Leave requests with approval workflow
- **Payroll Management** - Automated payroll calculation and payslip generation
- **Performance Tracking** - KPI tracking and performance reviews
- **Holiday Calendar** - Company-wide holiday management

### Project Management
- **Project Tracking** - Manage projects with team assignments
- **Task Management** - Create and assign tasks with deadlines
- **Progress Tracking** - Monitor project completion and milestones

### Additional Features
- **Role-Based Access Control** - Super Admin, Admin, Staff, and Client roles
- **File Management** - Secure file uploads and sharing
- **Internal Messaging** - Staff-to-staff communication
- **Notifications** - Real-time notification system
- **Dashboard & Analytics** - Comprehensive business insights
- **Mobile Responsive** - Fully responsive design for all devices

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
Backend/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   │   └── ui/              # Reusable UI components
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   ├── Dashboard/       # Dashboard page
│   │   ├── CRM/             # CRM module pages
│   │   └── HRM/             # HRM module pages
│   ├── services/            # API services
│   ├── store/               # State management (Zustand)
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .agent/                  # Implementation plan
├── index.html               # HTML template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🎨 Design System

The application uses a comprehensive design system with:
- Custom color palette (Primary, Secondary, Success, Warning, Danger)
- Consistent spacing and typography
- Reusable component classes
- Smooth animations and transitions
- Mobile-first responsive design

## 🔐 Authentication

The system uses JWT-based authentication with:
- Secure login/logout
- Password hashing
- Session management
- Role-based access control

## 👥 User Roles

1. **Super Admin** - Full system access
2. **Admin** - Access to CRM and HRM modules
3. **Staff** - Limited access based on permissions
4. **Client** - Access to client portal only

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Secure password handling
- Protected API routes
- XSS protection
- CSRF protection

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Project setup and configuration
- ✅ Authentication system
- ✅ Dashboard with analytics
- ✅ Basic CRM module (Clients)
- ⏳ Complete CRM module
- ⏳ Complete HRM module

### Phase 2 (Upcoming)
- Project management module
- File management system
- Internal messaging
- Email notifications
- Advanced analytics

### Phase 3 (Future)
- WhatsApp integration
- Mobile app
- Advanced reporting
- API documentation
- Multi-language support

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Development Team

Built with ❤️ by the CRM & HRM Development Team

---

**Note**: This is a frontend application. For full functionality, it requires a backend API server. Please refer to the backend documentation for API setup and configuration.
