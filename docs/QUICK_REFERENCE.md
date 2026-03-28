# Quick Reference - NewStarSports Development

## 🚀 Daily Development Checklist

### Before Starting
- [ ] Read `DEVELOPMENT_RULES.md` for detailed standards
- [ ] Check if similar components already exist in `@nss/ui`
- [ ] Run `pnpm dev` to start development server

### While Coding
- [ ] Use shadcn/ui components: `import { Button } from "@nss/ui/components/button"`
- [ ] Use Tailwind classes, NOT inline styles
- [ ] Use toast for errors: `toast.error("message")`
- [ ] Use proper z-index utilities: `z-tooltip`, `z-popover`, `z-dropdown`
- [ ] Follow TypeScript best practices

### Before Committing
- [ ] Run `pnpm lint` - fix all errors
- [ ] Run `pnpm typecheck` - fix all errors
- [ ] Test your changes manually
- [ ] Check for console.error usage

---

## ⚡ Most Common Rules

### ✅ Component Imports
```tsx
// Use shadcn/ui components
import { Button } from "@nss/ui/components/button"
import { Input } from "@nss/ui/components/input"
import { toast } from "sonner"
```

### ✅ Styling
```tsx
// Use Tailwind classes
<div className="bg-primary text-foreground p-4 z-popover">

// For dynamic values, use CSS custom properties
<div 
  className="bg-dynamic"
  style={{ '--dynamic-bg': color || 'hsl(var(--primary))' } as React.CSSProperties}
>
```

### ✅ Error Handling
```tsx
try {
  const result = await someAction()
  toast.success("Success!")
} catch (err) {
  const message = err instanceof Error ? err.message : "Unexpected error"
  toast.error(message)
}
```

### ✅ Z-Index Utilities
- `z-dropdown` (1000) - Dropdowns, selects
- `z-popover` (1060) - Popovers, tooltips
- `z-tooltip` (1070) - Tooltips only
- `z-fixed` (1030) - Fixed headers
- `z-modal` (1050) - Modals

---

## ❌ NEVER DO This

### Inline Styles
```tsx
// ❌ WRONG
<div style={{ backgroundColor: 'red', zIndex: 9999 }}>

// ✅ RIGHT
<div className="bg-red-500 z-tooltip">
```

### Console Errors
```tsx
// ❌ WRONG
catch (err) {
  console.error(err)
  alert("Error")
}

// ✅ RIGHT
catch (err) {
  toast.error(err.message || "Error occurred")
}
```

### Hardcoded Dynamic Values
```tsx
// ❌ WRONG
<div style={{ paddingLeft: `${level * 24}px` }}>

// ✅ RIGHT
<div className={`pl-hierarchy-${Math.min(level, 4)}`}>
```

---

## 📁 File Structure Quick Guide

```
apps/admin/app/(dashboard)/_components/     # Admin components
apps/storefront/app/[locale]/_components/   # Storefront components
packages/ui/components/                     # shadcn/ui components
```

### Naming
- Files: kebab-case (`user-menu.tsx`)
- Components: PascalCase (`UserMenu`)
- Functions: camelCase (`handleSubmit`)

---

## 🎨 Common Patterns

### Dynamic Colors
```tsx
// Announcement bar example
<div 
  className="text-center py-2"
  style={{ 
    backgroundColor: bgColor || 'hsl(var(--primary))',
    color: textColor || '#FFFFFF'
  }}
>
```

### Dynamic Padding (Hierarchy)
```tsx
// Use utility classes for levels 0-4
<div className={`pl-hierarchy-${Math.min(level, 4)}`}>
```

### Form Handling
```tsx
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const { handleSubmit, formState } = useForm()

const onSubmit = async (data) => {
  try {
    const result = await saveData(data)
    toast.success("Saved successfully")
  } catch (err) {
    toast.error("Failed to save")
  }
}
```

---

## 🔧 Available Components

### Form Components
- Button, Input, Textarea, Select
- Checkbox, Radio, Switch
- Label, Form (with react-hook-form)

### Layout Components
- Card, Sheet, Dialog
- Separator, ScrollArea
- Breadcrumb, Navigation

### Display Components
- Badge, Avatar, Skeleton
- Table, Pagination
- Carousel, Calendar

### Feedback Components
- Toast, Alert, Progress
- Tooltip, Popover
- Dropdown Menu

---

## 🚨 Quick Troubleshooting

### CSS Warnings
- `@utility` and `@theme` warnings are normal (TailwindCSS v4)
- They will be handled by the build process

### TypeScript Errors
- Check imports are correct
- Ensure proper typing for props
- Run `pnpm typecheck` for full analysis

### Build Issues
- Run `pnpm clean` then `pnpm dev`
- Check all imports are from correct packages
- Verify no console.error usage

---

## 📞 Need Help?

1. Check `DEVELOPMENT_RULES.md` for detailed standards
2. Look at existing components in `packages/ui/components/`
3. Check similar implementations in the codebase
4. Ask for clarification if unsure

---

**Remember**: Consistency is key. When in doubt, follow existing patterns in the codebase!
