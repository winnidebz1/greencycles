# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then navigate to the project directory and install:
```bash
cd "c:\Users\Cornelius Debpuur\Desktop\Web Projects\Backend"
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Step 3: Login

Use these demo credentials:
- **Email**: admin@example.com
- **Password**: password123

(Note: These are mock credentials for demonstration. In production, connect to your backend API)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Key Features to Explore

1. **Dashboard** - Overview of business metrics
2. **CRM Module**:
   - Clients Management
   - Leads Tracking
   - Proposals & Invoices
   - Support Tickets

3. **HRM Module** (Admin only):
   - Employee Management
   - Attendance Tracking
   - Leave Management
   - Payroll

4. **Project Management**
5. **File Sharing**
6. **Internal Messaging**

## 🔧 Configuration

### Connecting to Backend API

Update the API base URL in `src/services/api.ts`:

```typescript
const client = axios.create({
  baseURL: 'YOUR_BACKEND_API_URL', // Change this
  // ...
});
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CRM & HRM System
```

## 🎯 Next Steps

1. **Backend Integration**: Connect to your backend API
2. **Customize Branding**: Update colors, logo, and company name
3. **Add More Pages**: Expand CRM and HRM modules
4. **Deploy**: Build and deploy to your hosting platform

## 📚 Documentation

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)

## 🆘 Troubleshooting

### PowerShell Execution Policy Error

If you encounter execution policy errors:

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

If port 3000 is already in use, update `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to any available port
}
```

### Module Not Found Errors

Clear cache and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 💡 Tips

1. **Hot Reload**: The dev server supports hot module replacement
2. **TypeScript**: Enable strict mode for better type safety
3. **Components**: All UI components are in `src/components/ui`
4. **State Management**: Uses Zustand for lightweight state management
5. **Forms**: Uses React Hook Form + Zod for validation

## 🔐 Security Notes

- Never commit `.env` files
- Always use HTTPS in production
- Implement proper CORS policies
- Use secure password hashing
- Enable rate limiting on APIs

## 📞 Support

For issues or questions:
- Check the README.md
- Review the implementation plan in `.agent/implementation-plan.md`
- Contact the development team

---

Happy coding! 🎉
