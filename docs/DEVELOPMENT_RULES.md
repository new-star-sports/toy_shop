# NewStarSports Development Rules & Standards

## 🎯 Purpose
This document defines coding standards, best practices, and rules to ensure consistent, maintainable code across the NewStarSports application. Follow these rules to prevent common issues and maintain code quality.

## 📋 Table of Contents
1. [Component Standards](#component-standards)
2. [Styling Rules](#styling-rules)
3. [Error Handling](#error-handling)
4. [File Organization](#file-organization)
5. [Code Quality](#code-quality)
6. [Performance](#performance)
7. [TypeScript Standards](#typescript-standards)
8. [Database & API](#database--api)
9. [Testing](#testing)

---

## 🧩 Component Standards

### ✅ DO
- Use shadcn/ui components when available
- Import from `@nss/ui` package: `import { Button } from "@nss/ui/components/button"`
- Create reusable components in `@nss/ui` for shared functionality
- Use proper TypeScript interfaces for props
- Follow React naming conventions (PascalCase for components)

### ❌ DON'T
- Create custom components when shadcn/ui alternatives exist
- Use inline styles for component styling
- Hardcode values that should be configurable
- Mix presentation and business logic in components

### 📝 Component Template
```tsx
"use client"

import { useState } from "react"
import { Button } from "@nss/ui/components/button"
import { toast } from "sonner"

interface ComponentProps {
  // Define props with proper TypeScript types
}

export function ComponentName({ prop }: ComponentProps) {
  // Component logic
  
  return (
    <div className="proper-tailwind-classes">
      {/* Component JSX */}
    </div>
  )
}
```

---

## 🎨 Styling Rules

### ✅ DO
- Use TailwindCSS classes for all styling
- Use utility classes from `@nss/ui` (z-tooltip, z-popover, etc.)
- Use CSS custom properties for dynamic values
- Create utility classes for repeated patterns
- Follow the existing design system colors and spacing

### ❌ DON'T
- Use inline `style={{}}` attributes (EXCEPT for CSS custom properties)
- Hardcode colors, spacing, or z-index values
- Use !important unless absolutely necessary
- Mix different styling approaches in the same component

### 🎨 Dynamic Styling Pattern
```tsx
// ✅ GOOD - CSS custom properties for dynamic values
<div 
  className="bg-dynamic"
  style={{ 
    '--dynamic-bg': dynamicColor || 'hsl(var(--primary))',
    '--dynamic-padding': `${padding}px`
  } as React.CSSProperties}
>

// ❌ BAD - Inline styles for static properties
<div style={{ 
  backgroundColor: dynamicColor,
  paddingLeft: `${padding}px`,
  zIndex: 9999
}}>
```

### 🎨 Z-Index Management
Use the systematic z-index utilities:
- `z-dropdown` (1000) - Dropdown menus, selects
- `z-sticky` (1020) - Sticky headers
- `z-fixed` (1030) - Fixed positioned elements
- `z-modal` (1050) - Modal dialogs
- `z-popover` (1060) - Popovers, tooltips
- `z-tooltip` (1070) - Tooltips
- `z-toast` (1080) - Toast notifications
- `z-max` (9999) - Maximum z-index (use sparingly)

---

## ⚠️ Error Handling

### ✅ DO
- Use toast notifications for user-facing errors
- Implement proper try-catch blocks
- Extract meaningful error messages
- Log errors appropriately (not console.error in production)
- Handle both validation errors and network errors

### ❌ DON'T
- Use `console.error()` for user-facing errors
- Show generic "An error occurred" messages
- Use `alert()` for error notifications
- Let errors crash the application without handling

### 🚨 Error Handling Pattern
```tsx
import { toast } from "sonner"

const handleSubmit = async (data: FormData) => {
  try {
    const result = await someAction(data)
    if (result.success) {
      toast.success("Operation completed successfully")
      // Handle success
    } else {
      toast.error("Error: " + result.error)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
    toast.error(errorMessage)
    // Optional: Log to error tracking service
  }
}
```

---

## 📁 File Organization

### ✅ Structure
```
apps/
├── admin/                 # Admin dashboard
│   └── app/(dashboard)/   # Admin routes
│       ├── _components/   # Reusable admin components
│       ├── products/      # Product management
│       └── settings/      # Settings pages
├── storefront/           # Customer-facing app
│   └── app/[locale]/     # Localized routes
│       ├── _components/   # Reusable storefront components
│       └── (auth)/       # Authentication routes
└── api/                  # Backend API

packages/
├── ui/                   # Shared UI components
│   ├── components/       # shadcn/ui components
│   └── globals.css       # Global styles
├── db/                   # Database types and client
├── auth/                 # Authentication utilities
└── validators/           # Zod schemas
```

### ✅ Naming Conventions
- **Files**: kebab-case (`product-form.tsx`, `user-menu.tsx`)
- **Components**: PascalCase (`ProductForm`, `UserMenu`)
- **Functions**: camelCase (`handleSubmit`, `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Types**: PascalCase (`Product`, `User`, `ApiResponse`)

---

## 💻 Code Quality

### ✅ General Rules
- Use TypeScript for all new code
- Import only what you need (avoid `import *`)
- Use descriptive variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use proper ESLint and Prettier configuration

### ✅ Import Order
```tsx
// 1. React/Next.js imports
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. External packages
import { toast } from "sonner"
import { z } from "zod"

// 3. Internal packages (@nss/*)
import { Button } from "@nss/ui/components/button"
import { createProduct } from "@nss/db/queries"

// 4. Relative imports
import { ComponentName } from "./_components/component-name"
```

### ✅ TypeScript Rules
- Use interfaces for object shapes
- Use proper typing for all function parameters
- Prefer `type` over `interface` for simple types
- Use generic types when appropriate
- Enable strict mode in tsconfig.json

---

## 🚀 Performance

### ✅ DO
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use code splitting for large components
- Implement proper caching strategies

### ❌ DON'T
- Render large lists without virtualization
- Make unnecessary API calls
- Use useEffect without proper dependencies
- Create functions inside render loops

---

## 🗄️ Database & API

### ✅ API Patterns
```tsx
// Server actions
export async function createProduct(data: ProductData) {
  try {
    const result = await supabase
      .from('products')
      .insert(data)
      .select()
      .single()
    
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Client-side usage
const result = await createProduct(productData)
if (!result.success) {
  toast.error(result.error)
}
```

### ✅ Database Rules
- Use Supabase RLS policies for security
- Validate all data with Zod schemas
- Use proper TypeScript types from `@nss/db`
- Implement proper error handling
- Use transactions for multi-table operations

---

## 🧪 Testing

### ✅ Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Visual regression tests for UI components

### ✅ Test Organization
```
__tests__/
├── unit/           # Unit tests
├── integration/    # API tests
├── e2e/           # End-to-end tests
└── visual/        # Visual regression tests
```

---

## 🔧 Development Workflow

### ✅ Before Committing
1. Run `pnpm lint` - Fix all linting errors
2. Run `pnpm typecheck` - Fix all TypeScript errors
3. Test your changes manually
4. Update documentation if needed

### ✅ Git Commit Format
```
feat: add new feature
fix: resolve bug in component
docs: update documentation
refactor: improve code structure
test: add tests for utility
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ Inline Styles
```tsx
// ❌ BAD
<div style={{ backgroundColor: 'red', zIndex: 9999 }}>

// ✅ GOOD
<div className="bg-red-500 z-tooltip">
```

### ❌ Console Errors
```tsx
// ❌ BAD
catch (err) {
  console.error(err)
  alert("Error occurred")
}

// ✅ GOOD
catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Unexpected error"
  toast.error(errorMessage)
}
```

### ❌ Hardcoded Values
```tsx
// ❌ BAD
<div style={{ paddingLeft: `${level * 24}px` }}>

// ✅ GOOD
<div className={`pl-hierarchy-${Math.min(level, 4)}`}>
```

---

## 📚 Resources & References

### Internal Documentation
- [Application Analysis](./APPLICATION_ANALYSIS.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Database Schema](./supabase/migrations/)

### External Resources
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🔄 Review Process

All code changes should be reviewed against these rules:
1. ✅ Follows component standards
2. ✅ Uses proper styling approach
3. ✅ Implements correct error handling
4. ✅ Maintains file organization
5. ✅ Meets code quality standards
6. ✅ Considers performance implications
7. ✅ Includes proper TypeScript types

---

## 📝 Notes

- This document should be updated as the application evolves
- Team members should suggest improvements to these rules
- Use these rules as a checklist during code reviews
- When in doubt, prioritize maintainability and user experience

**Last Updated**: March 27, 2026
**Version**: 1.0
