// app/bundle-upload/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, CheckCircle, FileText, X, Database, CloudUpload } from 'lucide-react';

const validateAndProcessBundle = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const content = await file.text();
    const bundle = JSON.parse(content);
    
    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      throw new Error('Not a valid FHIR Bundle (missing resourceType)');
    }
    
    if (!bundle.type || !['document', 'message', 'transaction', 'batch', 'collection'].includes(bundle.type)) {
      throw new Error('Invalid or missing bundle type');
    }
    
    if (!bundle.entry || !Array.isArray(bundle.entry) || bundle.entry.length === 0) {
      throw new Error('Bundle missing entries array');
    }
    
    const resourceCounts: Record<string, number> = {};
    bundle.entry.forEach((entry: any) => {
      if (entry.resource && entry.resource.resourceType) {
        const resourceType = entry.resource.resourceType;
        resourceCounts[resourceType] = (resourceCounts[resourceType] || 0) + 1;
      }
    });
    
    const conditions = bundle.entry
      .filter((entry: any) => entry.resource && entry.resource.resourceType === 'Condition')
      .map((entry: any) => entry.resource);
    
    let dualCodingValid = true;
    let dualCodingErrors: string[] = [];
    
    conditions.forEach((condition: any, index: number) => {
      if (!condition.code || !condition.code.coding) {
        dualCodingValid = false;
        dualCodingErrors.push(`Condition ${index + 1}: Missing coding information`);
        return;
      }
      
      const hasNamaste = condition.code.coding.some((coding: any) => 
        coding.system && coding.system.includes('namaste')
      );
      
      const hasIcd11 = condition.code.coding.some((coding: any) => 
        coding.system && (coding.system.includes('icd-11') || coding.system === 'http://hl7.org/fhir/sid/icd-11')
      );
      
      if (!hasNamaste || !hasIcd11) {
        dualCodingValid = false;
        dualCodingErrors.push(`Condition ${index + 1}: Missing ${!hasNamaste ? 'NAMASTE' : 'ICD-11'} coding`);
      }
    });
    
    return {
      success: true,
      bundleId: `bundle-${Date.now()}`,
      resourceCounts,
      totalResources: bundle.entry.length,
      patientCount: resourceCounts['Patient'] || 0,
      conditionCount: resourceCounts['Condition'] || 0,
      encounterCount: resourceCounts['Encounter'] || 0,
      observationCount: resourceCounts['Observation'] || 0,
      dualCodingValid,
      dualCodingErrors,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to process bundle');
  }
};

export default function BundleUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ 
    success: boolean; 
    message: string;
    details?: any;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/json' || droppedFile.name.endsWith('.json')) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        setUploadResult({
          success: false,
          message: 'Only JSON files are accepted'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await validateAndProcessBundle(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadResult({
        success: true,
        message: 'Bundle uploaded and processed successfully!',
        details: result
      });
      
      setFile(null);
      // Clear file input
      const fileInput = document.getElementById('bundle-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadResult({
        success: false,
        message: error.message || 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">FHIR Bundle Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload FHIR R4 compliant bundles containing patient data, encounters, conditions, and observations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Upload Bundle</CardTitle>
              <CardDescription>
                Select a FHIR Bundle JSON file to upload. The system will validate and process the bundle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('bundle-file')?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <CloudUpload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      Drag and drop your FHIR bundle here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only JSON files with FHIR R4 Bundle structure are accepted.
                  </p>
                </div>
              </div>

              <input
                id="bundle-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {file && (
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing bundle...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full gap-2"
                size="lg"
              >
                {isUploading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Bundle
                  </>
                )}
              </Button>

              {uploadResult && (
                <Alert variant={uploadResult.success ? "default" : "destructive"}>
                  {uploadResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{uploadResult.success ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>{uploadResult.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {uploadResult?.success && uploadResult.details && (
            <Card className="glass-effect mt-6">
              <CardHeader>
                <CardTitle>Upload Details</CardTitle>
                <CardDescription>
                  Bundle processed successfully with the following resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Resource Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Resources:</span>
                        <span className="font-medium">{uploadResult.details.totalResources}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Patients:</span>
                        <span className="font-medium">{uploadResult.details.patientCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conditions:</span>
                        <span className="font-medium">{uploadResult.details.conditionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Encounters:</span>
                        <span className="font-medium">{uploadResult.details.encounterCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Observations:</span>
                        <span className="font-medium">{uploadResult.details.observationCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Dual Coding Validation</h4>
                    <div className="flex items-center">
                      {uploadResult.details.dualCodingValid ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invalid
                        </Badge>
                      )}
                    </div>
                    
                    {!uploadResult.details.dualCodingValid && (
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Issues found:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {uploadResult.details.dualCodingErrors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setUploadResult(null)}
                  >
                    Upload Another Bundle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Recent bundle uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">patient_bundle_1.json</p>
                      <p className="text-xs text-muted-foreground">15 resources</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">encounter_bundle_2.json</p>
                      <p className="text-xs text-muted-foreground">8 resources</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <div>
                      <p className="text-sm font-medium">lab_results.json</p>
                      <p className="text-xs text-muted-foreground">Partial upload</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View Full History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}