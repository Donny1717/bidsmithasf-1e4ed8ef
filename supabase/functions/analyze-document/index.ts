import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { documentId, extractedText } = await req.json();

    if (!documentId || !extractedText) {
      return new Response(JSON.stringify({ error: "Document ID and extracted text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch KB items for context
    const { data: kbItems } = await supabase
      .from("kb_items")
      .select("title, content, category:kb_categories(name)")
      .limit(20);

    const kbContext = kbItems?.map(item => `[${item.category?.name || 'General'}] ${item.title}: ${item.content}`).join("\n\n") || "";

    // Call Lovable AI Gateway with Gemini 3 Pro
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are BidSmith AI, an expert tender strategy consultant specializing in UK construction industry bids. You have deep knowledge of:
- The London Plan 2021 and Net Zero policies for all 32 London Boroughs + City of London
- BREEAM standards and UK construction regulations
- Carbon emissions calculation (Scope 1, 2, 3)
- Tender document analysis and bid optimization

Your task is to analyze tender/TOR documents and provide:
1. OPPORTUNITIES: Areas where the bid can be strengthened to increase win probability
2. RISKS: Potential issues or red flags that could hurt the bid
3. RECOMMENDATIONS: Specific actionable improvements with reference to regulations
4. CARBON IMPACT: Assessment of carbon/sustainability requirements and how to address them
5. COMPLIANCE SCORE: A score from 0-100 based on how well the document meets UK construction standards

Knowledge Base Context:
${kbContext}

IMPORTANT: Always reference specific policies, standards, or regulations when making recommendations. Focus on Net Zero compliance and carbon reduction strategies as key differentiators.`;

    const userPrompt = `Analyze this tender document and provide a structured assessment:

DOCUMENT TEXT:
${extractedText.substring(0, 15000)}

Respond in JSON format:
{
  "opportunities": [{"title": "...", "description": "...", "impact": "high|medium|low", "reference": "..."}],
  "risks": [{"title": "...", "description": "...", "severity": "high|medium|low", "mitigation": "..."}],
  "recommendations": [{"title": "...", "action": "...", "regulation": "...", "priority": 1-5}],
  "carbonImpact": {
    "scope1": {"assessment": "...", "suggestions": []},
    "scope2": {"assessment": "...", "suggestions": []},
    "scope3": {"assessment": "...", "suggestions": []},
    "overallRating": "excellent|good|fair|poor"
  },
  "complianceScore": 75,
  "summary": "Brief executive summary of the analysis"
}`;

    console.log("Calling Lovable AI Gateway with Gemini 3 Pro...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI Gateway error");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    console.log("AI Response received, parsing...");

    // Parse JSON from response
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      analysis = {
        opportunities: [],
        risks: [],
        recommendations: [],
        carbonImpact: { scope1: {}, scope2: {}, scope3: {}, overallRating: "fair" },
        complianceScore: 50,
        summary: content.substring(0, 500),
      };
    }

    // Update document status
    await supabase
      .from("documents")
      .update({ status: "analyzed" })
      .eq("id", documentId);

    // Save analysis
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("document_analyses")
      .insert({
        document_id: documentId,
        user_id: user.id,
        opportunities: analysis.opportunities || [],
        risks: analysis.risks || [],
        recommendations: analysis.recommendations || [],
        carbon_impact: analysis.carbonImpact || {},
        compliance_score: analysis.complianceScore || 0,
        ai_summary: analysis.summary || "",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save analysis:", saveError);
      throw saveError;
    }

    console.log("Analysis saved successfully:", savedAnalysis.id);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: savedAnalysis 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-document:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
