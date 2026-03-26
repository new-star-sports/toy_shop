import { Suspense } from "react"
import { getCategories } from "@nss/db/queries"
import {
  Button,
  Card,
  Badge,
} from "@nss/ui"
import {
  IconPencil,
  IconFolder,
  IconCornerDownRight,
} from "@tabler/icons-react"
import { CategorySheetForm } from "../_components/categories/category-sheet-form"
import { cn } from "@nss/ui/lib/utils"

export default async function CategoriesPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage product hierarchy and organization</p>
        </div>
      </div>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  )
}

async function CategoryList() {
  const categories = await getCategories()
  const roots = categories.filter(c => !c.parent_id)
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId)

  return (
    <>
      <div className="flex justify-end mb-4">
        <CategorySheetForm mode="create" categories={categories} />
      </div>
      <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
        {/* Column headers — hidden on mobile */}
        <div className="hidden sm:block p-4 bg-muted/20 border-b border-border/50">
          <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4">
            <div className="col-span-6">Category Name</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {roots.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground italic text-sm">
              No categories found. Start by adding one.
            </div>
          ) : (
            roots.map(root => (
              <CategoryRow
                key={root.id}
                category={root}
                children={getChildren(root.id)}
                allCategories={categories}
              />
            ))
          )}
        </div>
      </Card>
    </>
  )
}

function CategoriesSkeleton() {
  return (
    <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
      <div className="hidden sm:block p-4 bg-muted/20 border-b border-border/50">
        <div className="grid grid-cols-12 h-4 w-full" />
      </div>
      <div className="divide-y divide-border/30 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-8 flex gap-4">
            <div className="h-4 w-1/2 bg-muted/30 rounded" />
            <div className="h-4 w-1/4 bg-muted/20 rounded" />
            <div className="h-4 w-1/4 bg-muted/20 rounded ml-auto" />
          </div>
        ))}
      </div>
    </Card>
  )
}

function CategoryRow({ category, children, allCategories, level = 0 }: any) {
  const getChildren = (parentId: string) => allCategories.filter((c: any) => c.parent_id === parentId)

  return (
    <>
      <div className="p-3 sm:p-4 hover:bg-muted/10 transition-colors group">
        {/* Desktop row */}
        <div className="hidden sm:grid grid-cols-12 items-center px-4">
          <div className="col-span-6 flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
            {level > 0 ? (
              <IconCornerDownRight size={14} className="text-muted-foreground/60 shrink-0" stroke={1.5} />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <IconFolder size={16} className="text-primary" stroke={1.5} />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground leading-tight truncate">{category.name_en}</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase">{category.name_ar}</span>
            </div>
            {category.is_homepage_pinned && level === 0 && (
              <Badge variant="secondary" className="rounded-full text-[9px] px-2 py-0 h-4 bg-accent/10 border-accent/20 text-accent font-semibold ml-2 shrink-0">
                Pinned
              </Badge>
            )}
          </div>
          <div className="col-span-3">
            <code className="text-[10px] font-mono font-bold bg-muted/60 px-2 py-0.5 rounded-md text-muted-foreground">
              /{category.slug}
            </code>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className={cn("h-1.5 w-1.5 rounded-full", category.is_active ? "bg-success" : "bg-muted-foreground/40")} />
              <span className={cn("text-xs font-medium", category.is_active ? "text-foreground" : "text-muted-foreground")}>
                {category.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="col-span-1 flex justify-end">
            <CategorySheetForm
              mode="edit"
              category={category}
              categories={allCategories}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconPencil size={14} stroke={1.5} />
                </Button>
              }
            />
          </div>
        </div>

        {/* Mobile row */}
        <div className="sm:hidden flex items-center gap-3" style={{ paddingLeft: `${level * 16}px` }}>
          {level > 0 ? (
            <IconCornerDownRight size={13} className="text-muted-foreground/60 shrink-0" stroke={1.5} />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconFolder size={16} className="text-primary" stroke={1.5} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-sm leading-tight">{category.name_en}</span>
              {category.is_homepage_pinned && level === 0 && (
                <Badge variant="secondary" className="rounded-full text-[9px] px-2 py-0 h-4 bg-accent/10 text-accent font-semibold">Pinned</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <code className="text-[10px] font-mono bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground">/{category.slug}</code>
              <div className="flex items-center gap-1">
                <div className={cn("h-1.5 w-1.5 rounded-full", category.is_active ? "bg-success" : "bg-muted-foreground/40")} />
                <span className={cn("text-[10px] font-medium", category.is_active ? "text-foreground" : "text-muted-foreground")}>
                  {category.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <CategorySheetForm
            mode="edit"
            category={category}
            categories={allCategories}
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                <IconPencil size={14} stroke={1.5} />
              </Button>
            }
          />
        </div>
      </div>

      {children.map((child: any) => (
        <CategoryRow
          key={child.id}
          category={child}
          children={getChildren(child.id)}
          allCategories={allCategories}
          level={level + 1}
        />
      ))}
    </>
  )
}
