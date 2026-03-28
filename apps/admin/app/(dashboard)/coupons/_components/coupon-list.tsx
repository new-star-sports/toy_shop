"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconEdit, IconTrash, IconTicket, IconUsers, IconCalendar, IconDotsVertical } from "@tabler/icons-react"
import Link from "next/link"
import { toggleCouponStatus, removeCoupon } from "../_actions"
import { toast } from "sonner"
import { format } from "date-fns"

interface CouponListProps {
  initialCoupons: any[]
}

export function CouponList({ initialCoupons }: CouponListProps) {
  const [coupons, setCoupons] = useState(initialCoupons)

  const handleToggleStatus = async (id: string, active: boolean) => {
    const result = await toggleCouponStatus(id, active)
    if (result.success) {
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !active } : c))
      toast.success("Coupon status updated")
    } else {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return
    
    const result = await removeCoupon(id)
    if (result.success) {
      setCoupons(prev => prev.filter(c => c.id !== id))
      toast.success("Coupon deleted")
    } else {
      toast.error("Failed to delete coupon")
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="w-[200px]">Code</TableHead>
            <TableHead>Type & Value</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Restrictions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No coupons found. Create your first one to start promoting!
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-bold">
                  <div className="flex items-center gap-2">
                    <IconTicket className="h-4 w-4 text-primary" />
                    {coupon.code}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {coupon.coupon_type === "percentage" ? `${coupon.value}% OFF` : `${coupon.value} KWD OFF`}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono ltr-nums">
                      Min order: {coupon.min_order_value_kwd ? `${coupon.min_order_value_kwd} KWD` : 'None'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IconUsers className="h-3 w-3" />
                      {coupon.used_count} / {coupon.max_uses_total || '∞'}
                    </div>
                    {coupon.expires_at && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconCalendar className="h-3 w-3" />
                        Expires: {format(new Date(coupon.expires_at), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    Target: {coupon.applies_to}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={coupon.is_active} 
                    onCheckedChange={() => handleToggleStatus(coupon.id, coupon.is_active)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link href={`/coupons/${coupon.id}`}>
                          <IconEdit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(coupon.id)} className="text-red-500">
                        <IconTrash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
