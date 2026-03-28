import { createStorageClient } from '@nss/db/client'
import { v4 as uuidv4 } from 'uuid'
import imageCompression from 'browser-image-compression'

export interface UploadOptions {
  file: File
  bucket: 'categories' | 'brands' | 'products' | 'banners'
  maxSize?: number
  allowedTypes?: string[]
}

export interface UploadResult {
  url: string
  path: string
  size: number
  contentType: string
  bucket: string
}

interface BucketConfig {
  maxSize: number
  allowedTypes: string[]
  pathPrefix: string
}

const BUCKET_CONFIGS: Record<string, BucketConfig> = {
  categories: {
    maxSize: 5 * 1024 * 1024, // 5MB (after compression)
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    pathPrefix: 'categories'
  },
  brands: {
    maxSize: 5 * 1024 * 1024, // 5MB (after compression)
    allowedTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
    pathPrefix: 'brands'
  },
  products: {
    maxSize: 10 * 1024 * 1024, // 10MB (after compression)
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    pathPrefix: 'products'
  },
  banners: {
    maxSize: 15 * 1024 * 1024, // 15MB (after compression)
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    pathPrefix: 'banners'
  }
}

async function compressImageFile(
  file: File, 
  maxSizeMB: number = 2,
  quality: number = 0.8
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920, // Max dimensions
    useWebWorker: true,
    quality,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Compression failed:', error)
    return file // Fallback to original file
  }
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  try {
    const { file, bucket, maxSize, allowedTypes } = options
    
    // Get bucket configuration
    const config = BUCKET_CONFIGS[bucket]
    if (!config) {
      throw new Error(`Invalid bucket: ${bucket}`)
    }
    
    // Compress image if it's large
    let processedFile = file
    const fileSizeMB = file.size / 1024 / 1024
    
    if (fileSizeMB > 2) {
      processedFile = await compressImageFile(file, 2, 0.8)
    }
    
    // Validate processed file
    validateFile(processedFile, config, maxSize, allowedTypes)
    
    // Upload to Supabase
    const supabase = createStorageClient()
    const fileExt = processedFile.name.split('.').pop()?.toLowerCase()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${config.pathPrefix}/${fileName}`
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, processedFile, {
        contentType: processedFile.type,
        upsert: false,
      })
    
    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return {
      url: publicUrl,
      path: filePath,
      size: processedFile.size,
      contentType: processedFile.type,
      bucket
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

function validateFile(
  file: File, 
  config: BucketConfig, 
  maxSize?: number, 
  allowedTypes?: string[]
): void {
  const finalMaxSize = maxSize || config.maxSize
  const finalAllowedTypes = allowedTypes || config.allowedTypes
  
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  
  if (!fileExt || !finalAllowedTypes.includes(fileExt)) {
    throw new Error(`Invalid file type. Only ${finalAllowedTypes.join(', ')} are allowed.`)
  }
  
  if (file.size > finalMaxSize) {
    throw new Error(`File too large. Maximum size is ${finalMaxSize / 1024 / 1024}MB.`)
  }
}
