import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileVideo, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
  uploadProgress: number;
  isUploading: boolean;
  uploadStatus: "idle" | "uploading" | "success" | "error";
}

const VideoUpload = ({ onFileSelect, uploadProgress, isUploading, uploadStatus }: VideoUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith("video/"));
    
    if (videoFile) {
      setSelectedFile(videoFile);
      onFileSelect(videoFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-primary" />
          Video Upload
        </CardTitle>
        <CardDescription>
          Upload your video file to generate transcription. Supported formats: MP4, MOV, AVI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200",
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            <Upload className={cn(
              "h-12 w-12 mx-auto mb-4 transition-colors",
              dragOver ? "text-primary" : "text-muted-foreground"
            )} />
            <h3 className="text-lg font-medium mb-2">
              {dragOver ? "Drop your video here" : "Drag & drop your video"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
              disabled={isUploading}
            />
            <label htmlFor="video-upload">
              <Button variant="hero" size="lg" className="cursor-pointer">
                Select Video File
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileVideo className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadStatus === "success" && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {uploadStatus === "error" && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                {!isUploading && uploadStatus === "idle" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUpload;