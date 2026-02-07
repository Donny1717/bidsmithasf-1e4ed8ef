import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Pen, Check, RotateCcw } from "lucide-react";

interface DigitalSignatureProps {
  onSign: (signatureData: string) => void;
  onClose: () => void;
}

const DigitalSignature = ({ onSign, onClose }: DigitalSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 150;

    // Style
    ctx.strokeStyle = "hsl(45, 93%, 47%)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature || !agreed || !name.trim()) return;

    const signatureData = JSON.stringify({
      signature: canvas.toDataURL(),
      name: name.trim(),
      timestamp: new Date().toISOString(),
    });

    onSign(signatureData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Pen className="h-5 w-5 text-primary" />
                Digital Signature
              </CardTitle>
              <CardDescription>
                Sign to confirm you accept the AI-generated analysis
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Signature Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Signature
              </label>
              <Button variant="ghost" size="sm" onClick={clearSignature}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="border-2 border-dashed border-muted rounded-lg bg-secondary/30">
              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Draw your signature above
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <label htmlFor="agree" className="text-sm text-muted-foreground cursor-pointer">
              I confirm that I have reviewed the AI-generated analysis and accept 
              responsibility for any decisions made based on this document. I understand 
              that BidSmith AI is a tool to assist decision-making, not a substitute 
              for professional judgment.
            </label>
          </div>

          {/* Sign Button */}
          <Button
            variant="hero"
            className="w-full"
            onClick={handleSign}
            disabled={!hasSignature || !agreed || !name.trim()}
          >
            <Check className="h-4 w-4 mr-2" />
            Sign & Accept Document
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalSignature;
