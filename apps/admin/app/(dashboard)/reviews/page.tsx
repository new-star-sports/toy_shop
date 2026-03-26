import { getAdminReviews } from "@nss/db/queries"
import { ReviewList } from "./_components/review-list"
import { IconStar } from "@tabler/icons-react"

export const dynamic = "force-dynamic"

export default async function ReviewsPage() {
  const reviews = await getAdminReviews()

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <IconStar className="h-6 w-6 text-yellow-500 fill-yellow-500" /> Review Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Approve, reject, and reply to customer feedback.</p>
        </div>
      </div>

      <ReviewList initialReviews={reviews} />
    </div>
  )
}
