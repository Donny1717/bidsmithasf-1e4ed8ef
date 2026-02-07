import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Loader2, TrendingUp, AlertTriangle, Lightbulb, Leaf, 
  CheckCircle2, FileText, Printer, Pen, Trash2, ShieldCheck
} from "lucide-react";
import DigitalSignature from "./DigitalSignature";
import PrintExport from "./PrintExport";
import DocumentShredder from "./DocumentShredder";

interface Analysis {
  id: string;
  document_id: string;
  opportunities: unknown;
  risks: unknown;
  recommendations: unknown;
  carbon_impact: unknown;
  compliance_score: number | null;
  ai_summary: string | null;
  signed_at: string | null;
  signature_data: string | null;
  created_at: string;
  documents?: {
    file_name: string;
  } | null;
}

interface AnalysisResultsProps {
  userId: string;
}

const AnalysisResults = ({ userId }: AnalysisResultsProps) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showShredder, setShowShredder] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, [userId]);

  const fetchAnalyses = async () => {
    const { data, error } = await supabase
      .from("document_analyses")
      .select(`
        *,
        documents:document_id (file_name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching analyses:", error);
    } else {
      setAnalyses(data || []);
      if (data && data.length > 0) {
        setSelectedAnalysis(data[0]);
      }
    }
    setLoading(false);
  };

  const handleSignatureComplete = async (signatureData: string) => {
    if (!selectedAnalysis) return;

    const { error } = await supabase
      .from("document_analyses")
      .update({
        signed_at: new Date().toISOString(),
        signature_data: signatureData,
      })
      .eq("id", selectedAnalysis.id);

    if (error) {
      toast.error("Failed to save signature");
    } else {
      toast.success("Document signed successfully!");
      fetchAnalyses();
      setShowSignature(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Loading analyses...</p>
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No analyses yet</h3>
          <p className="text-muted-foreground">Upload and analyze a document to see results here</p>
        </CardContent>
      </Card>
    );
  }

  const analysis = selectedAnalysis;
  if (!analysis) return null;

  const opportunities = Array.isArray(analysis.opportunities) ? analysis.opportunities : [];
  const risks = Array.isArray(analysis.risks) ? analysis.risks : [];
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
  const carbonImpact = (analysis.carbon_impact || {}) as Record<string, any>;

  return (
    <div className="space-y-6">
      {/* Analysis Selector */}
      {analyses.length > 1 && (
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {analyses.map((a) => (
                <Button
                  key={a.id}
                  variant={selectedAnalysis?.id === a.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAnalysis(a)}
                  className="whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {a.documents?.file_name || "Document"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Score */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Compliance Score
              </CardTitle>
              <CardDescription>{analysis.documents?.file_name}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {analysis.signed_at && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Signed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeDasharray={`${(analysis.compliance_score || 0) * 3.52} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{analysis.compliance_score || 0}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground mb-4">{analysis.ai_summary}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-400">{opportunities.length}</p>
                  <p className="text-xs text-muted-foreground">Opportunities</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-amber-400">{risks.length}</p>
                  <p className="text-xs text-muted-foreground">Risks</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-500/10">
                  <Lightbulb className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-400">{recommendations.length}</p>
                  <p className="text-xs text-muted-foreground">Recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Card className="border-border bg-card">
        <Tabs defaultValue="opportunities">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="opportunities" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Opportunities</span>
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Risks</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Actions</span>
              </TabsTrigger>
              <TabsTrigger value="carbon" className="flex items-center gap-1">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Carbon</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="opportunities" className="space-y-3 mt-0">
              {opportunities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No opportunities identified</p>
              ) : (
                opportunities.map((opp: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">{opp.title}</h4>
                      <Badge variant={opp.impact === "high" ? "default" : "secondary"}>
                        {opp.impact || "medium"} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{opp.description}</p>
                    {opp.reference && (
                      <p className="text-xs text-primary mt-2">📋 {opp.reference}</p>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="risks" className="space-y-3 mt-0">
              {risks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No risks identified</p>
              ) : (
                risks.map((risk: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">{risk.title}</h4>
                      <Badge variant={risk.severity === "high" ? "destructive" : "secondary"}>
                        {risk.severity || "medium"} severity
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{risk.description}</p>
                    {risk.mitigation && (
                      <p className="text-xs text-green-400 mt-2">✅ Mitigation: {risk.mitigation}</p>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-3 mt-0">
              {recommendations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recommendations available</p>
              ) : (
                recommendations.map((rec: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">{rec.title}</h4>
                      <Badge variant="outline">Priority {rec.priority || i + 1}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{rec.action}</p>
                    {rec.regulation && (
                      <p className="text-xs text-primary mt-2">📜 {rec.regulation}</p>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="carbon" className="mt-0">
              <div className="grid md:grid-cols-3 gap-4">
                {["scope1", "scope2", "scope3"].map((scope) => {
                  const scopeData = carbonImpact[scope] || {};
                  return (
                    <div key={scope} className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-400" />
                        {scope.replace("scope", "Scope ")}
                      </h4>
                      <p className="text-sm text-muted-foreground">{scopeData.assessment || "Not assessed"}</p>
                      {scopeData.suggestions?.length > 0 && (
                        <ul className="mt-2 text-xs text-green-400">
                          {scopeData.suggestions.map((s: string, i: number) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
              {carbonImpact.overallRating && (
                <div className="mt-4 text-center">
                  <Badge 
                    className={`
                      ${carbonImpact.overallRating === "excellent" ? "bg-green-500" :
                        carbonImpact.overallRating === "good" ? "bg-blue-500" :
                        carbonImpact.overallRating === "fair" ? "bg-amber-500" : "bg-red-500"}
                    `}
                  >
                    Overall Carbon Rating: {carbonImpact.overallRating}
                  </Badge>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Action Buttons */}
      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="hero"
              onClick={() => setShowSignature(true)}
              disabled={!!analysis.signed_at}
            >
              <Pen className="h-4 w-4 mr-2" />
              {analysis.signed_at ? "Already Signed" : "Sign Document"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPrint(true)}
              disabled={!analysis.signed_at}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print / Export
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowShredder(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Shred Document
            </Button>
          </div>
          {!analysis.signed_at && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              ⚠️ Please review the analysis carefully and sign before printing
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showSignature && (
        <DigitalSignature
          onSign={handleSignatureComplete}
          onClose={() => setShowSignature(false)}
        />
      )}
      {showPrint && analysis && (
        <PrintExport
          analysis={analysis}
          onClose={() => setShowPrint(false)}
        />
      )}
      {showShredder && analysis && (
        <DocumentShredder
          analysisId={analysis.id}
          documentId={analysis.document_id}
          onComplete={() => {
            setShowShredder(false);
            fetchAnalyses();
          }}
          onClose={() => setShowShredder(false)}
        />
      )}
    </div>
  );
};

export default AnalysisResults;
