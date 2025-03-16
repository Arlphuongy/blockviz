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
  const [nodesUploadStatus, setNodesUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0
  });
  const [relationshipsUploadStatus, setRelationshipsUploadStatus] = useState<UploadStatus>({
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

  const handleNodesUpload = async () => {
    if (!nodesFile) {
      setNodesUploadStatus({
        isUploading: false,
        progress: 0,
        error: "Please select nodes file"
      });
      return;
    }

    setNodesUploadStatus({ isUploading: true, progress: 0 });

    try {
      const formData = new FormData();
      formData.append('nodes', nodesFile);

      const response = await fetch('/api/addresses', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setNodesUploadStatus({
        isUploading: false,
        progress: 100,
        success: "Nodes file uploaded and processed successfully"
      });
    } catch (error) {
      setNodesUploadStatus({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed"
      });
    }
  };

  const handleRelationshipsUpload = async () => {
    if (!relationshipsFile) {
      setRelationshipsUploadStatus({
        isUploading: false,
        progress: 0,
        error: "Please select relationships file"
      });
      return;
    }

    setRelationshipsUploadStatus({ isUploading: true, progress: 0 });

    try {
      const formData = new FormData();
      formData.append('relationships', relationshipsFile);

      const response = await fetch('/api/transactions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setRelationshipsUploadStatus({
        isUploading: false,
        progress: 100,
        success: "Relationships file uploaded and processed successfully"
      });
    } catch (error) {
      setRelationshipsUploadStatus({
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
                {nodesUploadStatus.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{nodesUploadStatus.error}</AlertDescription>
                  </Alert>
                )}
                {nodesUploadStatus.success && (
                  <Alert variant="default">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{nodesUploadStatus.success}</AlertDescription>
                  </Alert>
                )}
                {nodesUploadStatus.isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${nodesUploadStatus.progress}%` }}
                    ></div>
                  </div>
                )}
                <Button
                  onClick={handleNodesUpload}
                  disabled={nodesUploadStatus.isUploading || !nodesFile}
                  className="w-full"
                >
                  {nodesUploadStatus.isUploading ? "Uploading Nodes..." : "Upload Nodes"}
                </Button>
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
                {relationshipsUploadStatus.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{relationshipsUploadStatus.error}</AlertDescription>
                  </Alert>
                )}
                {relationshipsUploadStatus.success && (
                  <Alert variant="default">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{relationshipsUploadStatus.success}</AlertDescription>
                  </Alert>
                )}
                {relationshipsUploadStatus.isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${relationshipsUploadStatus.progress}%` }}
                    ></div>
                  </div>
                )}
                <Button
                  onClick={handleRelationshipsUpload}
                  disabled={relationshipsUploadStatus.isUploading || !relationshipsFile}
                  className="w-full"
                >
                  {relationshipsUploadStatus.isUploading ? "Uploading Relationships..." : "Upload Relationships"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}