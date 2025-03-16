"use client";
import { useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error?: string;
  success?: string;
}

// interface FileValidation {
//   isValid: boolean;
//   errors: string[];
// }

export default function AdminUploadPage() {
  const [nodesFile, setNodesFile] = useState<File | null>(null);
  const [relationshipsFile, setRelationshipsFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'nodes' | 'relationships') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'nodes') setNodesFile(file);
      else setRelationshipsFile(file);
    }
  };

  const handleUpload = async () => {
    if (!nodesFile || !relationshipsFile) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: "Please select both files"
      });
      return;
    }

    setUploadStatus({ isUploading: true, progress: 0 });

    try {
      const formData = new FormData();
      formData.append('nodes', nodesFile);
      formData.append('relationships', relationshipsFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setUploadStatus({
        isUploading: false,
        progress: 100,
        success: "Files uploaded and processed successfully"
      });
    } catch (error) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed"
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Upload Management</h1>

      <div className="grid gap-6">
        {/* File Upload Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Nodes Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileSelect(e, 'nodes')}
                  className="hidden"
                  id="nodes-upload"
                />
                <label
                  htmlFor="nodes-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Upload nodes.csv</p>
                  </div>
                </label>
                {nodesFile && (
                  <p className="text-sm text-gray-500">
                    Selected: {nodesFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationships Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileSelect(e, 'relationships')}
                  className="hidden"
                  id="relationships-upload"
                />
                <label
                  htmlFor="relationships-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Upload relationships.csv</p>
                  </div>
                </label>
                {relationshipsFile && (
                  <p className="text-sm text-gray-500">
                    Selected: {relationshipsFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status and Actions */}
        <div className="space-y-4">
          {uploadStatus.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{uploadStatus.error}</AlertDescription>
            </Alert>
          )}

          {uploadStatus.success && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{uploadStatus.success}</AlertDescription>
            </Alert>
          )}

          {uploadStatus.isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadStatus.progress}%` }}
              ></div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploadStatus.isUploading || !nodesFile || !relationshipsFile}
            className="w-full"
          >
            {uploadStatus.isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>
    </div>
  );
}