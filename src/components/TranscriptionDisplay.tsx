import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Edit3, 
  Clock, 
  Languages,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranscriptionResult {
  id: string;
  text: string;
  language: string;
  filename: string;
  duration: number;
  createdAt: Date;
  confidence?: number;
}

interface TranscriptionDisplayProps {
  transcription: TranscriptionResult | null;
  isProcessing: boolean;
  processingStatus: string;
}

const TranscriptionDisplay = ({ transcription, isProcessing, processingStatus }: TranscriptionDisplayProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState("");
  const { toast } = useToast();

  const handleCopyText = async () => {
    if (!transcription) return;
    
    try {
      await navigator.clipboard.writeText(transcription.text);
      toast({
        title: "Copied to clipboard",
        description: "Transcription text has been copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    if (!transcription) return;
    
    const text = editMode ? editedText : transcription.text;
    const filename = `${transcription.filename}_transcription.${format}`;
    
    if (format === 'txt') {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // PDF download would be handled by backend
      toast({
        title: "PDF Export",
        description: "PDF export requires backend integration with Supabase.",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share Feature",
      description: "Share functionality requires backend integration with Supabase.",
    });
  };

  const handleEdit = () => {
    if (editMode) {
      // Save changes
      setEditMode(false);
    } else {
      setEditedText(transcription?.text || "");
      setEditMode(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Transcription Result
        </CardTitle>
        <CardDescription>
          Your video has been processed and converted to text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Processing Video...</h3>
              <p className="text-muted-foreground">{processingStatus}</p>
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        ) : transcription ? (
          <>
            {/* Metadata */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                {transcription.language}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(transcription.duration)}
              </Badge>
              {transcription.confidence && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {Math.round(transcription.confidence * 100)}% confidence
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyText}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('txt')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('pdf')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {editMode ? "Save" : "Edit"}
              </Button>
            </div>

            {/* Transcription Text */}
            <div className="space-y-3">
              <h3 className="font-medium">Transcription:</h3>
              {editMode ? (
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-32 resize-none"
                  placeholder="Edit your transcription text..."
                />
              ) : (
                <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {transcription.text}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium mb-2">No Transcription Yet</h3>
              <p className="text-muted-foreground">
                Upload a video file to generate transcription
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionDisplay;