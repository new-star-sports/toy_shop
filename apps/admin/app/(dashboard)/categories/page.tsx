import { getCategories } from "@nss/db/queries"
import { Button } from "@nss/ui/components/button"
import { Card } from "@nss/ui/components/card"
import { Plus, Pencil, Home, Layers } from "lucide-react"
import Link from "next/link"
import { Badge } from "@nss/ui/components/badge"

export default async function CategoriesPage() {
  const categories = await getCategories()

  // Build tree for display
  const roots = categories.filter(c => !c.parent_id)
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Categories</h1>
          <p className="text-sm text-nss-text-secondary">Manage product hierarchy and organization</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/categories/new">
            <Plus size={16} />
            Add Category
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 bg-nss-surface border-b border-nss-border">
          <div className="grid grid-cols-12 text-sm font-semibold text-nss-text-secondary px-4">
             <div className="col-span-5">Name</div>
             <div className="col-span-3">Slug</div>
             <div className="col-span-2">Status</div>
             <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-nss-border">
          {roots.length === 0 ? (
            <div className="p-10 text-center text-nss-text-secondary">
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
    </div>
  )
}

function CategoryRow({ category, children, allCategories, level = 0 }: any) {
  const getChildren = (parentId: string) => allCategories.filter((c: any) => c.parent_id === parentId)

  return (
    <>
      <div className="p-4 hover:bg-nss-surface/50 transition-colors">
        <div className="grid grid-cols-12 items-center px-4">
          <div className="col-span-5 flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
            <Layers size={14} className="text-nss-text-secondary shrink-0" />
            <span className="font-medium text-nss-text-primary">{category.name_en}</span>
            <span className="text-xs text-nss-text-secondary mr-2">{category.name_ar}</span>
            {category.is_homepage_pinned && (
              <Badge variant="outline" className="gap-1 text-[10px] bg-nss-accent/10 border-nss-accent/20 text-nss-accent">
                <Home size={10} />
                Home
              </Badge>
            )}
          </div>
          <div className="col-span-3 font-mono text-xs text-nss-text-secondary">
            /{category.slug}
          </div>
          <div className="col-span-2">
            <Badge variant={category.is_active ? "default" : "outline"}>
              {category.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="col-span-2 flex justify-end gap-2">
             <Button variant="ghost" size="icon" asChild>
                <Link href={`/categories/${category.id}`}>
                  <Pencil size={14} />
                </Link>
             </Button>
             {/* Delete button would go here */}
          </div>
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
