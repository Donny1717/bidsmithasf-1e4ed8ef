import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2, X } from "lucide-react";

interface DocumentUploaderProps {
  userId: string;
  onUploadComplete: () => void;
}

const DocumentUploader = ({ userId, onUploadComplete }: DocumentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload to storage
      const filePath = `${userId}/${Date.now()}_${selectedFile.name}`;
      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;
      setUploadProgress(50);

      // Create document record
      const { data: docRecord, error: dbError } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          file_name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          status: "pending",
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setUploadProgress(70);

      // Call extract-pdf-text function
      const { data: extractResult, error: extractError } = await supabase.functions.invoke(
        "extract-pdf-text",
        {
          body: { filePath, documentId: docRecord.id },
        }
      );

      if (extractError) throw extractError;
      setUploadProgress(90);

      // Call analyze-document function
      if (extractResult?.extractedText) {
        const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
          "analyze-document",
          {
            body: { 
              documentId: docRecord.id, 
              extractedText: extractResult.extractedText 
            },
          }
        );

        if (analysisError) throw analysisError;
      }

      setUploadProgress(100);
      toast.success("Document uploaded and analyzed successfully!");
      setSelectedFile(null);
      onUploadComplete();

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload document");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Upload className="h-5 w-5 text-primary" />
          Upload TOR/PDF Document
        </CardTitle>
        <CardDescription>
          Upload your tender document for AI-powered analysis with Net Zero compliance check
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${isDragging 
              ? "border-primary bg-primary/10" 
              : "border-muted hover:border-primary/50 hover:bg-muted/50"
            }
          `}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  className="ml-2"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploading ? (
                <div className="w-full max-w-xs space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 50 ? "Uploading..." : 
                     uploadProgress < 70 ? "Extracting text..." :
                     uploadProgress < 90 ? "Analyzing with AI..." :
                     "Finalizing..."}
                  </p>
                </div>
              ) : (
                <Button onClick={uploadDocument} variant="hero" size="lg">
                  <Loader2 className={`h-4 w-4 mr-2 ${uploading ? "animate-spin" : "hidden"}`} />
                  Analyze Document
                </Button>
              )}
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Drag & drop your PDF here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[
            { icon: FileText, label: "PDF Extract", desc: "Full text extraction" },
            { icon: CheckCircle2, label: "Compliance", desc: "London Plan 2021" },
            { icon: Loader2, label: "Carbon Audit", desc: "Scope 1, 2, 3" },
            { icon: Upload, label: "AI Analysis", desc: "Gemini 3 Pro" },
          ].map((feature, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-muted/30">
              <feature.icon className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium text-foreground">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
