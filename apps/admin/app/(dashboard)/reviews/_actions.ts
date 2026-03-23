"use server"

import { revalidatePath } from "next/cache"
import { 
  updateReviewStatus, 
  toggleReviewPin, 
  saveReviewReply, 
  deleteReview 
} from "@nss/db/queries"

export async function approveReviewAction(id: string) {
  try {
    await updateReviewStatus(id, true)
    revalidatePath("/reviews")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function rejectReviewAction(id: string) {
  try {
    await updateReviewStatus(id, false)
    revalidatePath("/reviews")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function toggleReviewPinAction(id: string, isPinned: boolean) {
  try {
    await toggleReviewPin(id, isPinned)
    revalidatePath("/reviews")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function submitReviewReplyAction(id: string, reply: string) {
  try {
    await saveReviewReply(id, reply)
    revalidatePath("/reviews")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteReviewAction(id: string) {
  try {
    await deleteReview(id)
    revalidatePath("/reviews")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
