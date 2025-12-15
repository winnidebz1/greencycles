# Development Workflow Guide

## 🔄 How to Add New Features

This guide will help you extend the CRM & HRM system by adding new pages and features.

---

## 📝 Adding a New Page (Example: Leads Management)

### Step 1: Create the Page Component

Create a new file: `src/pages/CRM/LeadsPage.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusBadge,
  LoadingSpinner,
  Modal,
} from '@/components/ui';
import { crmService } from '@/services/crmService';
import type { Lead } from '@/types';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.leads.getAll();
      if (response.success && response.data) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Track and manage your leads</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Lead
        </Button>
      </div>

      {/* Your content here */}
    </div>
  );
};
```

### Step 2: Add Route

Update `src/App.tsx`:

```typescript
import { LeadsPage } from '@/pages/CRM/LeadsPage';

// In the Routes section:
<Route path="crm/leads" element={<LeadsPage />} />
```

### Step 3: Test

Navigate to http://localhost:3000/crm/leads

---

## 🎨 Creating Custom Components

### Example: Custom Status Badge

Create `src/components/ui/CustomBadge.tsx`:

```typescript
import React from 'react';

interface CustomBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger';
}

export const CustomBadge: React.FC<CustomBadgeProps> = ({ status, variant = 'success' }) => {
  const colors = {
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
  };

  return (
    <span className={`badge ${colors[variant]}`}>
      {status}
    </span>
  );
};
```

Export in `src/components/ui/index.ts`:

```typescript
export { CustomBadge } from './CustomBadge';
```

---

## 🔌 Adding API Endpoints

### Step 1: Define Types

Add to `src/types/index.ts`:

```typescript
export interface NewFeature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
```

### Step 2: Create Service

Create `src/services/newFeatureService.ts`:

```typescript
import { apiClient } from './api';
import type { NewFeature, PaginatedResponse } from '@/types';

export const newFeatureService = {
  getAll: (filters?: any) => 
    apiClient.get<PaginatedResponse<NewFeature>>('/features', filters),
  
  getById: (id: string) => 
    apiClient.get<NewFeature>(`/features/${id}`),
  
  create: (data: Partial<NewFeature>) => 
    apiClient.post<NewFeature>('/features', data),
  
  update: (id: string, data: Partial<NewFeature>) => 
    apiClient.put<NewFeature>(`/features/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/features/${id}`),
};
```

### Step 3: Use in Component

```typescript
import { newFeatureService } from '@/services/newFeatureService';

const fetchData = async () => {
  const response = await newFeatureService.getAll();
  if (response.success) {
    setData(response.data.data);
  }
};
```

---

## 🗄️ Adding State Management

### Create a New Store

Create `src/store/featureStore.ts`:

```typescript
import { create } from 'zustand';
import type { NewFeature } from '@/types';

interface FeatureStore {
  features: NewFeature[];
  selectedFeature: NewFeature | null;
  setFeatures: (features: NewFeature[]) => void;
  setSelectedFeature: (feature: NewFeature | null) => void;
  addFeature: (feature: NewFeature) => void;
  updateFeature: (id: string, data: Partial<NewFeature>) => void;
  removeFeature: (id: string) => void;
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  features: [],
  selectedFeature: null,

  setFeatures: (features) => set({ features }),
  
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
  
  addFeature: (feature) => 
    set((state) => ({ features: [...state.features, feature] })),
  
  updateFeature: (id, data) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id ? { ...f, ...data } : f
      ),
    })),
  
  removeFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    })),
}));
```

### Use in Component

```typescript
import { useFeatureStore } from '@/store/featureStore';

const MyComponent = () => {
  const { features, addFeature } = useFeatureStore();
  
  // Use features...
};
```

---

## 📋 Form Validation Pattern

### Using React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        error={errors.name?.message}
        {...register('name')}
      />
      {/* More fields... */}
    </form>
  );
};
```

---

## 🎯 Best Practices

### 1. Component Structure

```typescript
// Imports
import React, { useState, useEffect } from 'react';
import { ComponentProps } from '@/types';

// Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // State
  const [data, setData] = useState([]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Handlers
  const handleClick = () => {
    // Handle click
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 2. Error Handling

```typescript
const fetchData = async () => {
  try {
    setIsLoading(true);
    setError('');
    
    const response = await apiService.getData();
    
    if (response.success) {
      setData(response.data);
    } else {
      setError(response.message || 'An error occurred');
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Network error');
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Loading States

```typescript
{isLoading ? (
  <LoadingSpinner size="lg" />
) : data.length === 0 ? (
  <EmptyState message="No data found" />
) : (
  <DataTable data={data} />
)}
```

### 4. Conditional Rendering

```typescript
{user?.role === 'admin' && (
  <AdminPanel />
)}

{status === 'active' ? (
  <ActiveBadge />
) : (
  <InactiveBadge />
)}
```

---

## 🔍 Debugging Tips

### 1. React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Track re-renders

### 2. Network Debugging
- Open browser DevTools (F12)
- Go to Network tab
- Monitor API calls
- Check request/response data

### 3. Console Logging
```typescript
console.log('Data:', data);
console.error('Error:', error);
console.table(arrayData);
```

### 4. TypeScript Errors
- Check terminal for type errors
- Hover over errors in VS Code
- Use `// @ts-ignore` sparingly

---

## 🚀 Performance Optimization

### 1. Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### 2. Memoization

```typescript
import { useMemo, useCallback } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 3. Virtualization
For large lists, use react-window or react-virtual

---

## 📦 Building for Production

### 1. Build

```bash
npm run build
```

### 2. Preview

```bash
npm run preview
```

### 3. Deploy

```bash
# Example: Deploy to Vercel
vercel deploy

# Example: Deploy to Netlify
netlify deploy --prod
```

---

## 🧪 Testing (Future)

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
test('fetches and displays data', async () => {
  render(<DataComponent />);
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

---

## 📚 Additional Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### Tools
- [VS Code](https://code.visualstudio.com)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com) - API testing

---

## 💡 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

---

## 🎯 Common Patterns

### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);

<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
  {/* Modal content */}
</Modal>
```

### Confirmation Dialog
```typescript
const handleDelete = async () => {
  if (window.confirm('Are you sure?')) {
    await deleteItem(id);
  }
};
```

### Toast Notifications
```typescript
const { addNotification } = useNotificationStore();

addNotification({
  userId: user.id,
  title: 'Success',
  message: 'Item created successfully',
  type: 'success',
  isRead: false,
});
```

---

**Happy Coding! 🚀**

*Remember: The best way to learn is by doing. Start with small features and gradually build up!*
