import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X, Printer, FileText, FileJson, Download } from "lucide-react";

interface PrintExportProps {
  analysis: any;
  onClose: () => void;
}

const PrintExport = ({ analysis, onClose }: PrintExportProps) => {
  const [format, setFormat] = useState("pdf");
  const [exporting, setExporting] = useState(false);

  const generateContent = () => {
    const opportunities = Array.isArray(analysis.opportunities) ? analysis.opportunities : [];
    const risks = Array.isArray(analysis.risks) ? analysis.risks : [];
    const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
    const carbonImpact = analysis.carbon_impact || {};

    return {
      title: "BidSmith AI - Tender Analysis Report",
      generated: new Date().toISOString(),
      document: analysis.documents?.file_name || "Unknown Document",
      complianceScore: analysis.compliance_score,
      summary: analysis.ai_summary,
      opportunities,
      risks,
      recommendations,
      carbonImpact,
      signature: analysis.signature_data ? JSON.parse(analysis.signature_data) : null,
    };
  };

  const exportAsPDF = () => {
    const content = generateContent();
    
    // Create printable HTML
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${content.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { color: #d4a017; border-bottom: 2px solid #d4a017; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 30px; }
          .score { font-size: 48px; font-weight: bold; color: #d4a017; }
          .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .section { margin: 20px 0; }
          .item { background: #fafafa; padding: 12px; margin: 8px 0; border-left: 3px solid #d4a017; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          .high { background: #fee2e2; color: #dc2626; }
          .medium { background: #fef3c7; color: #d97706; }
          .low { background: #dcfce7; color: #16a34a; }
          .signature { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; }
          .carbon { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .carbon-box { background: #ecfdf5; padding: 15px; border-radius: 8px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>${content.title}</h1>
        <p><strong>Document:</strong> ${content.document}</p>
        <p><strong>Generated:</strong> ${new Date(content.generated).toLocaleString()}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div class="score">${content.complianceScore}/100</div>
          <p>Compliance Score</p>
        </div>

        <div class="summary">
          <strong>Executive Summary:</strong><br/>
          ${content.summary || "No summary available"}
        </div>

        <h2>🚀 Opportunities (${content.opportunities.length})</h2>
        <div class="section">
          ${content.opportunities.map((o: any) => `
            <div class="item">
              <strong>${o.title}</strong>
              <span class="badge ${o.impact}">${o.impact || "medium"} impact</span>
              <p>${o.description}</p>
              ${o.reference ? `<small>📋 ${o.reference}</small>` : ""}
            </div>
          `).join("")}
        </div>

        <h2>⚠️ Risks (${content.risks.length})</h2>
        <div class="section">
          ${content.risks.map((r: any) => `
            <div class="item">
              <strong>${r.title}</strong>
              <span class="badge ${r.severity}">${r.severity || "medium"} severity</span>
              <p>${r.description}</p>
              ${r.mitigation ? `<small>✅ Mitigation: ${r.mitigation}</small>` : ""}
            </div>
          `).join("")}
        </div>

        <h2>💡 Recommendations (${content.recommendations.length})</h2>
        <div class="section">
          ${content.recommendations.map((r: any, i: number) => `
            <div class="item">
              <strong>#${r.priority || i + 1}: ${r.title}</strong>
              <p>${r.action}</p>
              ${r.regulation ? `<small>📜 ${r.regulation}</small>` : ""}
            </div>
          `).join("")}
        </div>

        <h2>🌿 Carbon Impact Assessment</h2>
        <div class="carbon">
          ${["scope1", "scope2", "scope3"].map(scope => `
            <div class="carbon-box">
              <strong>${scope.replace("scope", "Scope ")}</strong>
              <p>${content.carbonImpact[scope]?.assessment || "Not assessed"}</p>
            </div>
          `).join("")}
        </div>
        ${content.carbonImpact.overallRating ? `
          <p style="text-align: center; margin-top: 15px;">
            <strong>Overall Rating:</strong> ${content.carbonImpact.overallRating}
          </p>
        ` : ""}

        ${content.signature ? `
          <div class="signature">
            <h2>Digital Signature</h2>
            <p><strong>Signed by:</strong> ${content.signature.name}</p>
            <p><strong>Date:</strong> ${new Date(content.signature.timestamp).toLocaleString()}</p>
            <img src="${content.signature.signature}" alt="Signature" style="max-width: 300px;" />
          </div>
        ` : ""}

        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportAsJSON = () => {
    const content = generateContent();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bidsmith-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported!");
  };

  const exportAsText = () => {
    const content = generateContent();
    let text = `${content.title}\n${"=".repeat(50)}\n\n`;
    text += `Document: ${content.document}\n`;
    text += `Generated: ${new Date(content.generated).toLocaleString()}\n`;
    text += `Compliance Score: ${content.complianceScore}/100\n\n`;
    text += `Summary:\n${content.summary}\n\n`;

    text += `OPPORTUNITIES (${content.opportunities.length})\n${"-".repeat(30)}\n`;
    content.opportunities.forEach((o: any, i: number) => {
      text += `${i + 1}. ${o.title} [${o.impact}]\n   ${o.description}\n\n`;
    });

    text += `RISKS (${content.risks.length})\n${"-".repeat(30)}\n`;
    content.risks.forEach((r: any, i: number) => {
      text += `${i + 1}. ${r.title} [${r.severity}]\n   ${r.description}\n`;
      if (r.mitigation) text += `   Mitigation: ${r.mitigation}\n`;
      text += "\n";
    });

    text += `RECOMMENDATIONS (${content.recommendations.length})\n${"-".repeat(30)}\n`;
    content.recommendations.forEach((r: any, i: number) => {
      text += `${i + 1}. ${r.title}\n   ${r.action}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bidsmith-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Text file exported!");
  };

  const handleExport = () => {
    setExporting(true);
    try {
      switch (format) {
        case "pdf":
          exportAsPDF();
          break;
        case "json":
          exportAsJSON();
          break;
        case "txt":
          exportAsText();
          break;
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Printer className="h-5 w-5 text-primary" />
                Print / Export
              </CardTitle>
              <CardDescription>
                Choose your export format
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="h-4 w-4 text-red-400" />
                <div>
                  <p className="font-medium text-foreground">PDF (Print)</p>
                  <p className="text-xs text-muted-foreground">Opens print dialog</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileJson className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="font-medium text-foreground">JSON</p>
                  <p className="text-xs text-muted-foreground">Structured data export</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <RadioGroupItem value="txt" id="txt" />
              <Label htmlFor="txt" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-foreground">Plain Text</p>
                  <p className="text-xs text-muted-foreground">Simple text format</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            variant="hero"
            className="w-full"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export as {format.toUpperCase()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintExport;
