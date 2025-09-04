import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Sparkles, Upload, FileText, Users, Zap } from "lucide-react";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import LanguageSelector from "@/components/LanguageSelector";
import TranscriptionDisplay from "@/components/TranscriptionDisplay";
import Dashboard from "@/components/Dashboard";

interface TranscriptionResult {
  id: string;
  text: string;
  language: string;
  filename: string;
  duration: number;
  createdAt: Date;
  confidence?: number;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadStatus("idle");
    setTranscriptionResult(null);
    
    // Mock upload process
    setIsUploading(true);
    setUploadStatus("uploading");
    
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          setUploadStatus("success");
          
          // Start processing
          setTimeout(() => {
            handleProcessing(file);
          }, 1000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleProcessing = (file: File) => {
    setIsProcessing(true);
    const processingSteps = [
      "Analyzing video format...",
      "Extracting audio track...",
      "Processing with AI speech recognition...",
      "Applying language detection...",
      "Generating final transcription...",
    ];

    let stepIndex = 0;
    setProcessingStatus(processingSteps[0]);

    const processingInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < processingSteps.length) {
        setProcessingStatus(processingSteps[stepIndex]);
      } else {
        clearInterval(processingInterval);
        
        // Mock transcription result
        setTimeout(() => {
          setTranscriptionResult({
            id: "mock-1",
            text: "Welcome to VideoScript AI demonstration. This is a sample transcription showing how your video content would be converted to text using advanced AI speech recognition technology. The system supports multiple languages including English, French, and Arabic, with high accuracy rates and real-time processing capabilities.",
            language: selectedLanguage === "auto" ? "English" : selectedLanguage,
            filename: file.name,
            duration: 45, // mock duration
            createdAt: new Date(),
            confidence: 0.94,
          });
          setIsProcessing(false);
          setProcessingStatus("");
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 py-16 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              Powered by Advanced AI Technology
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient-x">
              Convert Video to Text
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your videos into accurate text transcriptions using state-of-the-art AI speech recognition. 
              Support for multiple languages and formats.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4 text-primary" />
                <span>Multiple formats supported</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span>99% accuracy rate</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>Multi-language support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>Real-time processing</span>
              </div>
            </div>

            <Alert className="max-w-2xl mx-auto mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Backend Required:</strong> To use video upload, transcription processing, and data storage features, 
                you need to connect this app to Supabase for backend functionality.
              </AlertDescription>
            </Alert>
            
            <Button variant="hero" size="lg" className="animate-float">
              Try Demo Version
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="transcribe" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="transcribe" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              New Transcription
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcribe" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Upload & Settings */}
              <div className="space-y-6">
                <VideoUpload
                  onFileSelect={handleFileSelect}
                  uploadProgress={uploadProgress}
                  isUploading={isUploading}
                  uploadStatus={uploadStatus}
                />
                
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  disabled={isUploading || isProcessing}
                />
              </div>

              {/* Right Column - Results */}
              <div>
                <TranscriptionDisplay
                  transcription={transcriptionResult}
                  isProcessing={isProcessing}
                  processingStatus={processingStatus}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;