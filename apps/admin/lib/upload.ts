import imageCompression from 'browser-image-compression'

export interface UploadOptions {
  file: File
  bucket: 'categories' | 'brands' | 'products' | 'banners' | 'blogs'
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
    maxSize: 50 * 1024 * 1024, // 50MB (videos)
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp', 'mp4', 'webm'],
    pathPrefix: 'banners'
  },
  blogs: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    pathPrefix: 'images'
  }
}

async function compressImageFile(
  file: File, 
  maxSizeMB: number = 2,
  quality: number = 0.8
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Image compression failed:', error)
    return file
  }
}

const VIDEO_MAX_SIZE_MB = 50

async function processVideoFile(file: File): Promise<File> {
  const sizeMB = file.size / 1024 / 1024
  if (sizeMB > VIDEO_MAX_SIZE_MB) {
    throw new Error(`Video too large. Maximum size is ${VIDEO_MAX_SIZE_MB}MB.`)
  }
  // Browser-side video re-encoding is not supported without heavy dependencies.
  // The file passes through as-is; size is validated above.
  return file
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  try {
    const { file, bucket, maxSize, allowedTypes } = options
    
    // Get bucket configuration
    const config = BUCKET_CONFIGS[bucket]
    if (!config) {
      throw new Error(`Invalid bucket: ${bucket}`)
    }
    
    // Process file: compress images, validate videos
    const isVideo = file.type.startsWith('video/')
    let processedFile: File

    if (isVideo) {
      processedFile = await processVideoFile(file)
    } else {
      const fileSizeMB = file.size / 1024 / 1024
      processedFile = fileSizeMB > 2
        ? await compressImageFile(file, 2, 0.8)
        : file
    }
    
    // Validate processed file
    validateFile(processedFile, config, maxSize, allowedTypes)
    
    // Upload via API route (server-side with service role key)
    const formData = new FormData()
    formData.append('file', processedFile)
    formData.append('bucket', bucket)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Upload failed: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    return {
      url: result.url,
      path: result.path,
      size: result.size,
      contentType: result.contentType,
      bucket: result.bucket
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
