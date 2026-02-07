import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { X, Trash2, AlertTriangle, Loader2, ShieldAlert, Check } from "lucide-react";

interface DocumentShredderProps {
  analysisId: string;
  documentId: string;
  onComplete: () => void;
  onClose: () => void;
}

const DocumentShredder = ({ analysisId, documentId, onComplete, onClose }: DocumentShredderProps) => {
  const [confirmation, setConfirmation] = useState("");
  const [shredding, setShredding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"confirm" | "shredding" | "complete">("confirm");

  const handleShred = async () => {
    if (confirmation !== "SHRED") return;

    setShredding(true);
    setStage("shredding");

    try {
      // Stage 1: Delete analysis
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { error: analysisError } = await supabase
        .from("document_analyses")
        .delete()
        .eq("id", analysisId);

      if (analysisError) throw analysisError;
      setProgress(50);

      // Stage 2: Get document info for storage deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: docData } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", documentId)
        .single();

      setProgress(70);

      // Stage 3: Delete from storage
      if (docData?.file_path) {
        await supabase.storage
          .from("documents")
          .remove([docData.file_path]);
      }
      setProgress(85);

      // Stage 4: Delete document record
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { error: docError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (docError) throw docError;
      setProgress(100);

      setStage("complete");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Document permanently shredded");
      onComplete();

    } catch (error) {
      console.error("Shred error:", error);
      toast.error("Failed to shred document");
      setShredding(false);
      setStage("confirm");
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-destructive bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                Digital Document Shredder
              </CardTitle>
              <CardDescription>
                Permanently delete all document data
              </CardDescription>
            </div>
            {stage === "confirm" && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "confirm" && (
            <>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive mb-1">Warning: This action is irreversible!</p>
                    <p className="text-muted-foreground">
                      This will permanently delete:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mt-1">
                      <li>The uploaded PDF file</li>
                      <li>All extracted text data</li>
                      <li>The AI analysis results</li>
                      <li>Digital signature (if any)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Type <span className="font-mono bg-muted px-1 rounded">SHRED</span> to confirm
                </label>
                <Input
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
                  placeholder="Type SHRED to confirm"
                  className="font-mono"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleShred}
                  disabled={confirmation !== "SHRED"}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Shred Permanently
                </Button>
              </div>
            </>
          )}

          {stage === "shredding" && (
            <div className="text-center py-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-t-destructive animate-spin"
                  style={{ animationDuration: "1s" }}
                />
                <Trash2 className="absolute inset-0 m-auto h-8 w-8 text-destructive" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">Shredding Document...</p>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                {progress < 50 ? "Removing analysis data..." :
                 progress < 70 ? "Locating stored files..." :
                 progress < 85 ? "Deleting from storage..." :
                 "Completing secure deletion..."}
              </p>
            </div>
          )}

          {stage === "complete" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-lg font-medium text-foreground">Document Shredded</p>
              <p className="text-sm text-muted-foreground">All data has been permanently deleted</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentShredder;
