import Link from "next/link";
import { getAdminProducts } from "@nss/db/queries";
import { 
  Button, 
  Input, 
  Badge, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@nss/ui";
import { cn } from "@nss/ui/lib/utils";
import { 
  IconPlus, 
  IconSearch, 
  IconFilter, 
  IconDotsVertical,
  IconEdit,
} from "@tabler/icons-react";
import { DeleteProductButton } from "../_components/products/delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nss/ui";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const status = params.status as any;
  const page = parseInt(params.page || "1");

  const { data: products, count } = await getAdminProducts({
    search: query,
    status,
    page,
    perPage: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your store's product catalogue ({count} total)
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/products/new">
            <IconPlus size={16} stroke={2} />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters & Actions Bar */}
      <Card className="rounded-2xl border-border/50 shadow-card">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input
              placeholder="Search by name, SKU..."
              defaultValue={query}
              className="pl-10 rounded-full h-10 border-border/40 focus:bg-background/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex bg-muted/30 p-1 rounded-full border border-border/50">
              {["all", "published", "draft", "archived"].map((s) => (
                <Button
                  key={s}
                  variant={status === s || (!status && s === "all") ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full px-4 h-8 text-xs capitalize",
                    (status === s || (!status && s === "all")) && "bg-background shadow-sm"
                  )}
                  asChild
                >
                  <Link href={`/products?status=${s === "all" ? "" : s}&q=${query}`}>
                    {s}
                  </Link>
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="rounded-full h-10 px-4 gap-2 border-border/50">
              <IconFilter size={16} stroke={1.5} />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Product</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">SKU</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Price</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Stock</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Status</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground italic">
                  No products found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-border/30 hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 h-10 w-10 rounded-lg border border-border/40">
                        <AvatarImage src={product.images?.[0]?.url || ""} className="object-cover" />
                        <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">IMG</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground leading-none mb-1">
                          {product.name_en}
                        </span>
                        <span className="text-xs text-muted-foreground leading-none">
                          {product.category?.name_en || "No category"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <code className="text-[10px] font-mono font-bold bg-muted/60 px-2 py-0.5 rounded-md text-muted-foreground">
                      {product.sku}
                    </code>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold">
                    {product.price_kwd.toFixed(3)} KD
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                        "h-2 w-2 rounded-full",
                        product.stock_quantity < (product.low_stock_threshold || 5) ? "bg-destructive animate-pulse" : "bg-success"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        product.stock_quantity < (product.low_stock_threshold || 5) ? "text-destructive font-bold" : "text-foreground"
                      )}>
                        {product.stock_quantity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={
                        product.status === "published"
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full px-3 py-0.5 font-normal text-xs capitalize"
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <IconDotsVertical size={18} stroke={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                        <DropdownMenuItem asChild className="rounded-lg gap-2 cursor-pointer">
                          <Link href={`/products/${product.id}`}>
                            <IconEdit size={16} stroke={1.5} /> Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DeleteProductButton productId={product.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
