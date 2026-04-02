import { createStorageClient } from "@nss/db/client"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string

    if (!file || !bucket) {
      return NextResponse.json(
        { error: "Missing file or bucket" },
        { status: 400 }
      )
    }

    // Validate bucket
    const allowedBuckets = ["categories", "brands", "products", "banners", "blogs"]
    if (!allowedBuckets.includes(bucket)) {
      return NextResponse.json(
        { error: "Invalid bucket" },
        { status: 400 }
      )
    }

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = bucket === "blogs" ? `images/${fileName}` : `${bucket}/${fileName}`

    // Upload using service role key (server-side only)
    const supabase = createStorageClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Storage upload error:", error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
      size: file.size,
      contentType: file.type,
      bucket,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
