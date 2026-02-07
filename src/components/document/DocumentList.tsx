import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Trash2, Eye, Loader2, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface Document {
  id: string;
  file_name: string;
  file_size: number | null;
  status: string | null;
  created_at: string;
}

interface DocumentListProps {
  userId: string;
  onAnalyze: () => void;
}

const DocumentList = ({ userId, onAnalyze }: DocumentListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("id, file_name, file_size, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const deleteDocument = async (doc: Document) => {
    setDeleting(doc.id);
    try {
      // Delete from database (cascade will handle analyses)
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);

      if (error) throw error;

      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "analyzed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Analyzed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Loading documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No documents yet</h3>
          <p className="text-muted-foreground">Upload your first TOR/PDF document to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          Your Documents
        </CardTitle>
        <CardDescription>
          {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{doc.file_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : "—"}</span>
                  <span>•</span>
                  <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(doc.status)}
              {doc.status === "analyzed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAnalyze}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  View Analysis
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteDocument(doc)}
                disabled={deleting === doc.id}
                className="text-muted-foreground hover:text-destructive"
              >
                {deleting === doc.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
