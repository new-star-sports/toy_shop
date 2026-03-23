import { getAdminReviews } from "@nss/db/queries"
import { ReviewList } from "./_components/review-list"
import { Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ReviewsPage() {
  const reviews = await getAdminReviews()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> Review Moderation
          </h1>
          <p className="text-nss-text-secondary">Approve, reject, and reply to customer feedback.</p>
        </div>
      </div>

      <ReviewList initialReviews={reviews} />
    </div>
  )
}
