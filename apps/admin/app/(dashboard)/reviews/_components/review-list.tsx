"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Check, X, MessageSquare, Trash2, Star, Home, Pin, MoreHorizontal } from "lucide-react"
import { 
  approveReviewAction, 
  rejectReviewAction, 
  toggleReviewPinAction, 
  deleteReviewAction 
} from "../_actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { ReplyDialog } from "./reply-dialog"

interface ReviewListProps {
  initialReviews: any[]
}

export function ReviewList({ initialReviews }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [replyReview, setReplyReview] = useState<any>(null)

  const handleApprove = async (id: string) => {
    const result = await approveReviewAction(id)
    if (result.success) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: true } : r))
      toast.success("Review approved")
    } else {
      toast.error("Failed to approve review")
    }
  }

  const handleReject = async (id: string) => {
    const result = await rejectReviewAction(id)
    if (result.success) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: false } : r))
      toast.success("Review rejected (marked as unapproved)")
    } else {
      toast.error("Failed to reject review")
    }
  }

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    const result = await toggleReviewPinAction(id, isPinned)
    if (result.success) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_pinned_home: isPinned } : r))
      toast.success(isPinned ? "Pinned to homepage" : "Unpinned from homepage")
    } else {
      toast.error("Failed to update pin status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    const result = await deleteReviewAction(id)
    if (result.success) {
      setReviews(prev => prev.filter(r => r.id !== id))
      toast.success("Review deleted")
    } else {
      toast.error("Failed to delete review")
    }
  }

  return (
    <div className="rounded-xl border border-nss-border bg-nss-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-nss-border">
            <TableHead>Customer & Product</TableHead>
            <TableHead>Rating & Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Reply</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-nss-text-secondary">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id} className="border-nss-border hover:bg-nss-surface/50">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-nss-text-primary text-sm">User {review.user_id.slice(0, 8)}...</span>
                    <span className="text-xs text-nss-text-secondary truncate max-w-[150px]">
                      P: {review.products?.name_en}
                    </span>
                    <span className="text-[10px] text-nss-text-secondary">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 max-w-[400px]">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-3 w-3 ${s <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    {review.title && <span className="font-semibold text-sm">{review.title}</span>}
                    <p className="text-xs text-nss-text-secondary line-clamp-2 italic">"{review.body}"</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Badge 
                      variant={review.is_approved ? "default" : "secondary"} 
                      className={`w-fit text-[10px] ${review.is_approved ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}`}
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                    <div className="flex items-center gap-2">
                       <Pin className={`h-3 w-3 ${review.is_pinned_home ? "text-nss-primary" : "text-gray-300"}`} />
                       <span className="text-[10px] text-nss-text-secondary">Pinned: {review.is_pinned_home ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {review.admin_reply ? (
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <span className="text-[10px] font-bold text-nss-primary">Official Reply:</span>
                      <p className="text-[10px] text-nss-text-secondary italic line-clamp-2">"{review.admin_reply}"</p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-nss-text-secondary italic">No reply yet</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {!review.is_approved ? (
                        <DropdownMenuItem onClick={() => handleApprove(review.id)} className="text-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleReject(review.id)} className="text-amber-600">
                          <X className="h-4 w-4 mr-2" />
                          Unapprove
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleTogglePin(review.id, !review.is_pinned_home)}>
                        <Home className="h-4 w-4 mr-2" />
                        {review.is_pinned_home ? "Unpin from Home" : "Pin to Home"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setReplyReview(review)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
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

      {replyReview && (
        <ReplyDialog 
          review={replyReview} 
          onClose={() => setReplyReview(null)} 
          onSuccess={(reply) => {
            setReviews(prev => prev.map(r => r.id === replyReview.id ? { ...r, admin_reply: reply } : r))
            setReplyReview(null)
          }}
        />
      )}
    </div>
  )
}
