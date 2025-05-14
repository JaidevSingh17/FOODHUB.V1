"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, updateUserProfile } = useAuth()

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setUploadedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false,
  })

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (!isAuthenticated || !user) {
    // Optionally, redirect to login if not authenticated
    // router.push("/login") 
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your profile.</p>
        <Button onClick={() => router.push("/login")} className="mt-4">
          Go to Login
        </Button>
      </div>
    )
  }

  const handleLogout = async () => {
    if (logout) {
      try {
        await logout() // Call the logout function from context
        router.push("/") // Redirect to homepage after logout
      } catch (error) {
        console.error("Logout failed:", error)
        // Handle logout error (e.g., show a notification)
      }
    }
  }

  const handleEditProfile = () => {
    // Navigate to an edit profile page or open a modal
    // For now, let's just log to console
    console.log("Edit profile clicked")
    // router.push("/profile/edit") // Example route
  }

  const handleSaveProfilePicture = async () => {
    if (!uploadedFile || !updateUserProfile) return

    setIsUploading(true)
    // In a real app, you would upload the file to a server here
    // and get back a URL.
    // For this demo, we'll use the local previewUrl as the "uploaded" URL.
    // You might want to implement a more robust solution for a real application.
    try {
      // Simulate upload and get a URL (using preview for demo)
      const newProfileImageUrl = previewUrl 
      
      if (newProfileImageUrl) {
        await updateUserProfile({ profileImageUrl: newProfileImageUrl })
        setUploadedFile(null) // Clear the uploaded file
        // The previewUrl will be revoked by the useEffect cleanup when it changes or component unmounts
        // We keep the previewUrl as is so the image displays the new user.profileImageUrl from context
        // If user.profileImageUrl is immediately updated, the image src will change
      } else {
        console.error("Preview URL is not available.")
      }
    } catch (error) {
      console.error("Failed to save profile picture:", error)
      // Handle error (e.g., show a notification)
    } finally {
      setIsUploading(false)
    }
  }

  // Determine the image source: preview, user's current, or placeholder
  let imageSrc = "/placeholder-avatar.png"; // Default placeholder
  if (previewUrl) {
    imageSrc = previewUrl; // Show preview if a new file is selected
  } else if (user.profileImageUrl) {
    imageSrc = user.profileImageUrl; // Otherwise, show user's current profile image
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-card-foreground">
          My Profile
        </h1>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary">
            <Image
              src={imageSrc}
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
          </div>

          <div
            {...getRootProps()}
            className={`mt-4 p-6 border-2 border-dashed rounded-md cursor-pointer w-full max-w-md text-center hover:border-primary transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50"}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-primary">Drop the image here ...</p>
            ) : (
              <p className="text-muted-foreground">
                Drag & drop a profile picture here, or click to select one.
              </p>
            )}
          </div>
          
          {previewUrl && uploadedFile && (
            <Button 
              onClick={handleSaveProfilePicture} 
              className="mt-4"
              disabled={isUploading}
            >
              {isUploading ? "Saving..." : "Save Profile Picture"}
            </Button>
          )}

          <h2 className="text-2xl font-semibold text-card-foreground mt-6">
            {user.name || "User Name"}
          </h2>
          <p className="text-muted-foreground">{user.email || "user@example.com"}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-1">
              Bio
            </h3>
            <p className="text-muted-foreground bg-background p-4 rounded-md">
              {user.bio ||
                "This is a placeholder bio. You can update this in your profile settings."}
            </p>
          </div>

          {/* Add more profile details here as needed */}
          {/* Example:
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-1">
              Location
            </h3>
            <p className="text-muted-foreground bg-background p-4 rounded-md">
              {user.location || "Not specified"}
            </p>
          </div>
          */}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={handleEditProfile}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
} 