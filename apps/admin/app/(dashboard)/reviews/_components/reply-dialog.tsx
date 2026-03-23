"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@nss/ui/components/dialog"
import { Button } from "@nss/ui/components/button"
import { Textarea } from "@nss/ui/components/textarea"
import { Label } from "@nss/ui/components/label"
import { submitReviewReplyAction } from "../_actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ReplyDialogProps {
  review: any
  onClose: () => void
  onSuccess: (reply: string) => void
}

export function ReplyDialog({ review, onClose, onSuccess }: ReplyDialogProps) {
  const [reply, setReply] = useState(review.admin_reply || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty")
      return
    }

    setIsSubmitting(true)
    const result = await submitReviewReplyAction(review.id, reply)
    setIsSubmitting(false)

    if (result.success) {
      toast.success("Reply saved")
      onSuccess(reply)
    } else {
      toast.error(result.error || "Failed to save reply")
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-nss-surface p-3 rounded-lg border border-nss-border space-y-2">
            <p className="text-xs font-bold text-nss-text-primary">Customer Review:</p>
            <p className="text-xs text-nss-text-secondary italic">"{review.body}"</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply">Official Response</Label>
            <Textarea 
              id="reply" 
              placeholder="Write your response here..." 
              className="min-h-[120px]"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <p className="text-[10px] text-nss-text-secondary">
              This response will be visible to all customers on the product page.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !reply.trim()}
            className="bg-nss-primary hover:bg-nss-primary/90"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {review.admin_reply ? "Update Reply" : "Post Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
