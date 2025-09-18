"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileText, Trash2, CheckCircle, AlertCircle } from "lucide-react"

// Mock API functions - replace with your actual API calls
const api = {
  uploadBundle: async (formData: FormData) => {
    // Simulate API call
    console.log('Uploading bundle:', formData.get('bundle'))
    return Promise.resolve({ 
      ok: true,
      json: async () => ({ 
        id: 'bundle-123', 
        name: 'uploaded-bundle.json',
        status: 'valid'
      })
    })
  },
  exportBundle: async (bundleId: string) => {
    // Simulate API call
    const blob = new Blob([JSON.stringify({ bundleId, data: "sample" })], { 
      type: 'application/json' 
    })
    return Promise.resolve(blob)
  },
  deleteBundle: async (bundleId: string) => {
    // Simulate API call
    console.log('Deleting bundle:', bundleId)
    return Promise.resolve({ ok: true })
  }
}

interface Bundle {
  id: string
  name: string
  status: 'valid' | 'invalid' | 'processing'
  createdAt: string
}

export function BundleManager() {
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: 'bundle-1',
      name: 'patient-data-1.json',
      status: 'valid',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'bundle-2',
      name: 'patient-data-2.json',
      status: 'invalid',
      createdAt: '2024-01-14T15:45:00Z'
    }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Upload handler
  const handleBundleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    setUploadError(null)
    
    const formData = new FormData()
    formData.append('bundle', file)
    
    try {
      const response = await api.uploadBundle(formData)
      const result = await response.json()
      
      if (response.ok) {
        setBundles(prev => [{
          id: result.id,
          name: file.name,
          status: result.status,
          createdAt: new Date().toISOString()
        }, ...prev])
      } else {
        setUploadError('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('An error occurred during upload.')
    } finally {
      setIsUploading(false)
      // Reset the file input
      event.target.value = ''
    }
  }

  // Export handler
  const handleExportBundle = async (bundleId: string, bundleName: string) => {
    try {
      const blob = await api.exportBundle(bundleId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${bundleName}-export.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export bundle. Please try again.')
    }
  }

  // Delete handler
  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return
    
    try {
      const response = await api.deleteBundle(bundleId)
      
      if (response.ok) {
        setBundles(prev => prev.filter(bundle => bundle.id !== bundleId))
      } else {
        alert('Failed to delete bundle. Please try again.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the bundle.')
    }
  }

  const getStatusVariant = (status: Bundle['status']) => {
    switch (status) {
      case 'valid': return 'success'
      case 'invalid': return 'destructive'
      case 'processing': return 'secondary'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Bundle Management</h2>
        <p className="text-muted-foreground mt-2">
          Upload, validate, and export FHIR bundles
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload FHIR Bundle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drag and drop your FHIR bundle JSON file here, or click to browse
              </p>
              <input
                type="file"
                id="bundle-upload"
                accept=".json"
                onChange={handleBundleUpload}
                className="hidden"
                disabled={isUploading}
              />
              <label htmlFor="bundle-upload">
                <Button asChild variant="outline" disabled={isUploading}>
                  <span>
                    {isUploading ? 'Uploading...' : 'Select File'}
                  </span>
                </Button>
              </label>
              {uploadError && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {uploadError}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bundle List */}
      <Card>
        <CardHeader>
          <CardTitle>Managed Bundles</CardTitle>
        </CardHeader>
        <CardContent>
          {bundles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bundles uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{bundle.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {formatDate(bundle.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(bundle.status)}>
                      {bundle.status.toUpperCase()}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportBundle(bundle.id, bundle.name)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBundle(bundle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}