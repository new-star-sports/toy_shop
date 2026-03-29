'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'
import { uploadFile, type UploadResult } from '@/lib/upload'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileUploadProps {
  value?: string
  onChange: (url: string | null) => void
  bucket: 'categories' | 'brands' | 'products' | 'banners'
  disabled?: boolean
  className?: string
  showPreview?: boolean
  maxSize?: number
  allowedTypes?: string[]
  onUploadStart?: () => void
  onUploadComplete?: (result: UploadResult) => void
  onUploadError?: (error: string) => void
}

export function FileUpload({
  value,
  onChange,
  bucket,
  disabled = false,
  className,
  showPreview = true,
  maxSize,
  allowedTypes,
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    setIsUploading(true)
    setError(null)
    setProgress(0)
    onUploadStart?.()
    
    try {
      const result = await uploadFile({
        file,
        bucket,
        maxSize,
        allowedTypes
      })
      
      onChange(result.url)
      onUploadComplete?.(result)
      
      // Success toast
      toast.success(`File uploaded successfully! (${(result.size / 1024 / 1024).toFixed(2)}MB)`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      onUploadError?.(errorMessage)
      
      // Error toast
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }, [bucket, maxSize, allowedTypes, onChange, onUploadStart, onUploadComplete, onUploadError])
  
  const VIDEO_EXTS = new Set(['mp4', 'webm', 'mov', 'avi', 'mkv'])
  const isVideoExt = (ext: string) => VIDEO_EXTS.has(ext.toLowerCase())
  const isVideoUrl = (url: string) => /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes
      ? Object.fromEntries(allowedTypes.map(type => [
          isVideoExt(type) ? `video/${type === 'mov' ? 'quicktime' : type}` : `image/${type}`,
          [`.${type}`]
        ]))
      : { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: disabled || isUploading
  })
  
  const handleRemove = () => {
    onChange(null)
    setError(null)
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {showPreview && (
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border/40 overflow-hidden bg-muted/20 flex items-center justify-center shrink-0">
            {value ? (
              isVideoUrl(value) ? (
                <video
                  src={value}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onError={() => setError('Failed to load video preview')}
                />
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setError('Failed to load image preview')}
                />
              )
            ) : (
              allowedTypes?.some(isVideoExt)
                ? <Video className="w-8 h-8 text-muted-foreground/50" />
                : <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed border-border/40 rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/10",
                isDragActive && "border-primary bg-primary/5",
                (disabled || isUploading) && "cursor-not-allowed opacity-50"
              )}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <Loader2 className="w-8 h-8 mx-auto text-muted-foreground mb-2 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              )}
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : isDragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                {allowedTypes ? allowedTypes.join(', ') : 'JPEG, PNG, WebP'} up to {maxSize ? `${maxSize / 1024 / 1024}MB` : '5MB'}
              </p>
            </div>
            
            {value && !isUploading && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={disabled}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Remove File
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}
