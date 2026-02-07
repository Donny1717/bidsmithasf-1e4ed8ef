import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ArrowLeft, Upload, FileText, Loader2, CheckCircle2, 
  AlertTriangle, Lightbulb, Leaf, TrendingUp, ShieldCheck,
  Trash2, Eye, Sparkles
} from "lucide-react";
import DocumentUploader from "@/components/document/DocumentUploader";
import AnalysisResults from "@/components/document/AnalysisResults";
import DocumentList from "@/components/document/DocumentList";

const DocumentAnalysis = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">BidSmith AI</span>
              <Badge variant="secondary" className="text-xs">Gemini 3 Pro</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Document Analysis
            </h1>
            <p className="text-muted-foreground">
              Upload TOR/PDF documents for AI-powered tender strategy analysis
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <DocumentUploader 
                userId={user.id} 
                onUploadComplete={() => setActiveTab("documents")} 
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentList 
                userId={user.id} 
                onAnalyze={() => setActiveTab("analysis")} 
              />
            </TabsContent>

            <TabsContent value="analysis">
              <AnalysisResults userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DocumentAnalysis;
