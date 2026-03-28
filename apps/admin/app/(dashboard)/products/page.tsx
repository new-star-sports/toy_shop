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
  AvatarImage,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconEdit,
  IconPackage,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { DeleteProductButton } from "../_components/products/delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; stock?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const status = (params.status as any) || "all";
  const stock = params.stock as "low" | "out" | undefined;
  const page = parseInt(params.page || "1");

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <Suspense fallback={<p className="text-sm text-muted-foreground mt-1 underline decoration-dotted">Loading catalogue info...</p>}>
            <ProductCountSummary query={query} status={status} stock={stock} />
          </Suspense>
        </div>
        <Button
          asChild
          className="flex items-center gap-2"
        >
          <Link href="/products/new">
            <IconPlus size={18} stroke={2.5} />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters & Actions Bar */}

      {/* Filters & Actions Bar */}
      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
          {/* Search */}
          <div className="relative w-full">
            <IconSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70"
              stroke={2}
            />
            <Input
              placeholder="Search by name, SKU..."
              defaultValue={query}
              className="pl-11 rounded-xl h-11 border-border/40 bg-background/50 focus:bg-background transition-all w-full"
            />
          </div>
          {/* Status filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex bg-muted/20 p-1 rounded-xl border border-border/40 min-w-max items-center h-10">
              {["all", "published", "draft", "archived"].map((s) => (
                <Button
                  key={s}
                  variant={status === s ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-lg px-3 sm:px-4 h-8 text-[11px] font-bold capitalize transition-all shrink-0",
                    status === s
                      ? "bg-background text-primary shadow-sm ring-1 ring-border/30"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  asChild
                >
                  <Link href={`/products?status=${s === "all" ? "" : s}&q=${query}`}>
                    {s}
                  </Link>
                </Button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-10 px-4 gap-2 border-border/40 hover:bg-muted/50 transition-all min-w-max font-bold text-[11px]"
                >
                  <IconFilter size={16} stroke={2.5} />
                  <span className="hidden sm:inline">More Filters</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Stock Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { value: "", label: "All Stock" },
                  { value: "low", label: "Low Stock (≤5)" },
                  { value: "out", label: "Out of Stock" },
                ].map((s) => (
                  <DropdownMenuItem key={s.value} asChild>
                    <Link
                      href={`/products?${new URLSearchParams({
                        ...(status !== "all" ? { status } : {}),
                        ...(query ? { q: query } : {}),
                        ...(s.value ? { stock: s.value } : {}),
                      }).toString()}`}
                      className={cn(
                        "w-full",
                        (stock === s.value || (!stock && !s.value)) && "font-bold"
                      )}
                    >
                      {s.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table / Mobile Cards */}
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTable query={query} status={status} stock={stock} page={page} />
      </Suspense>
    </div>
  );
}

async function ProductTable({
  query,
  status,
  stock,
  page,
}: {
  query: string;
  status: string;
  stock?: "low" | "out";
  page: number;
}) {
  const { data: products, count } = await getAdminProducts({
    search: query,
    status: (status === "all" ? undefined : status) as any,
    stockFilter: stock,
    page,
    perPage: 10,
  });

  if (products.length === 0) {
    return (
      <Card className="rounded-2xl border-border/40 shadow-sm bg-card">
        <div className="h-60 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <IconPackage size={48} stroke={1} className="opacity-20" />
          <p className="italic font-medium text-sm">No products found matching your criteria.</p>
          <Button variant="link" asChild>
            <Link href="/products">Clear all filters</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <Card className="hidden md:block rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                  Product ({count})
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                  SKU
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                  Stock
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="group border-border/20 hover:bg-muted/5 transition-all"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-xl border border-border/40 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                        <AvatarImage
                          src={product.images?.[0]?.url || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-muted/50 text-muted-foreground/50">
                          <IconPackage size={20} stroke={1.5} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-foreground leading-tight">
                          {product.name_en}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md w-fit">
                          {product.category?.name_en || "General"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <code className="text-[10px] font-mono font-black tracking-tighter bg-muted/40 px-2 py-1 rounded-md text-foreground/70 border border-border/20">
                      {product.sku}
                    </code>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-foreground">
                    {product.price_kwd.toFixed(3)}{" "}
                    <span className="text-[10px] text-muted-foreground">KD</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full ring-2 ring-background",
                          product.stock_quantity < (product.low_stock_threshold || 5)
                            ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"
                            : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-bold",
                          product.stock_quantity < (product.low_stock_threshold || 5)
                            ? "text-destructive"
                            : "text-foreground"
                        )}
                      >
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity < (product.low_stock_threshold || 5) && (
                        <IconAlertTriangle size={14} className="text-destructive" stroke={2.5} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-lg px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider border-none shadow-sm",
                        product.status === "published" &&
                          "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50",
                        product.status === "draft" &&
                          "bg-amber-50 text-amber-600 ring-1 ring-amber-200/50",
                        product.status === "archived" &&
                          "bg-slate-100 text-slate-500 ring-1 ring-slate-200/50"
                      )}
                    >
                      {product.status === "published" && (
                        <IconCheck size={10} className="mr-1" stroke={3} />
                      )}
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-muted transition-colors"
                        >
                          <IconDotsVertical
                            size={20}
                            className="text-muted-foreground"
                            stroke={1.5}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl p-1.5 shadow-xl min-w-[160px]"
                      >
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg gap-2.5 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Link href={`/products/${product.id}`}>
                            <IconEdit size={16} stroke={2} />
                            <span className="font-semibold">Edit Product</span>
                          </Link>
                        </DropdownMenuItem>
                        <div className="h-px bg-gray-200 my-1 mx-1" />
                        <DeleteProductButton productId={product.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card"
          >
            <div className="p-4 flex items-start gap-3">
              <Avatar className="h-14 w-14 rounded-xl border border-border/40 shadow-sm overflow-hidden shrink-0">
                <AvatarImage
                  src={product.images?.[0]?.url || ""}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted/50 text-muted-foreground/50">
                  <IconPackage size={22} stroke={1.5} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm leading-tight truncate">
                      {product.name_en}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {product.category?.name_en || "General"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full shrink-0"
                      >
                        <IconDotsVertical size={18} className="text-muted-foreground" stroke={1.5} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-1.5 shadow-xl min-w-[160px]">
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg gap-2.5 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Link href={`/products/${product.id}`}>
                          <IconEdit size={16} stroke={2} />
                          <span className="font-semibold">Edit Product</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="h-px bg-gray-200 my-1 mx-1" />
                      <DeleteProductButton productId={product.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                  <code className="text-[10px] font-mono font-bold bg-muted/40 px-2 py-0.5 rounded-md text-foreground/60 border border-border/20">
                    {product.sku}
                  </code>
                  <span className="text-sm font-bold text-foreground">
                    {product.price_kwd.toFixed(3)}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">KD</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        product.stock_quantity < (product.low_stock_threshold || 5)
                          ? "bg-destructive animate-pulse"
                          : "bg-emerald-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-bold",
                        product.stock_quantity < (product.low_stock_threshold || 5)
                          ? "text-destructive"
                          : "text-foreground"
                      )}
                    >
                      {product.stock_quantity} in stock
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-lg px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider border-none shadow-sm",
                      product.status === "published" &&
                        "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50",
                      product.status === "draft" &&
                        "bg-amber-50 text-amber-600 ring-1 ring-amber-200/50",
                      product.status === "archived" &&
                        "bg-slate-100 text-slate-500 ring-1 ring-slate-200/50"
                    )}
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function ProductTableSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <Card className="hidden md:block rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                Product
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                SKU
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                Price
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                Stock
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="animate-pulse border-border/20">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted/50" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted/50 rounded" />
                      <div className="h-3 w-20 bg-muted/30 rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 w-16 bg-muted/30 rounded" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 w-12 bg-muted/30 rounded" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 w-8 bg-muted/30 rounded" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-6 w-20 bg-muted/30 rounded-full" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="h-8 w-8 bg-muted/30 rounded-full ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl border-border/40 overflow-hidden animate-pulse">
            <div className="p-4 flex items-start gap-3">
              <div className="h-14 w-14 rounded-xl bg-muted/50 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted/50 rounded" />
                <div className="h-3 w-24 bg-muted/30 rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 bg-muted/30 rounded" />
                  <div className="h-5 w-14 bg-muted/30 rounded" />
                  <div className="h-5 w-20 bg-muted/30 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

async function ProductCountSummary({
  query,
  status,
  stock,
}: {
  query: string;
  status: string;
  stock?: "low" | "out";
}) {
  const { count } = await getAdminProducts({
    search: query,
    status: (status === "all" ? undefined : status) as any,
    stockFilter: stock,
    page: 1,
    perPage: 1,
  });

  return (
    <p className="text-sm text-muted-foreground mt-1">
      Manage your store&apos;s product catalogue ({count} total)
    </p>
  );
}
