import { FileText, Clock, CheckCircle, Lock, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stages = [
  { icon: FileText, label: 'Draft', active: true },
  { icon: Clock, label: 'Pending', active: false },
  { icon: CheckCircle, label: 'Signed', active: false },
  { icon: Lock, label: 'Locked', active: false },
];

const SignatureSection = () => {
  return (
    <section className="py-20 gradient-dark">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
            DIGITAL SIGNATURE
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Audit-Ready Approval System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Formalise bid submissions with cryptographic signatures, immutable audit trails, and compliance attestation.
          </p>
        </div>

        {/* Signature Workflow Card */}
        <div className="max-w-4xl mx-auto gradient-surface rounded-3xl p-10 border-2 border-gold/30">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Signature Workflow</h3>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {stages.map((stage, index) => (
              <div key={stage.label} className="flex items-center flex-1">
                <div className="text-center flex-1">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                      stage.active
                        ? 'bg-primary'
                        : 'bg-secondary'
                    }`}
                  >
                    <stage.icon
                      size={36}
                      className={stage.active ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                  </div>
                  <p className={`font-semibold ${stage.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {stage.label}
                  </p>
                </div>
                {index < stages.length - 1 && (
                  <div className="w-16 h-1 bg-muted mx-2 hidden sm:block"></div>
                )}
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button variant="hero" size="xl" className="w-full mb-10">
            Advance to Next Stage →
          </Button>

          {/* Signature Record */}
          <div className="pt-10 border-t border-muted">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-foreground">Signature Record</h4>
              <span className="bg-secondary px-4 py-1 rounded-full text-sm text-foreground">Draft</span>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-muted">
              <div className="flex items-start space-x-4 mb-6">
                <Pen className="text-primary mt-1" size={24} />
                <div className="flex-1">
                  <p className="font-semibold mb-2 text-foreground">Digital Signature Required</p>
                  <p className="text-sm text-muted-foreground">Sign this document to proceed with submission</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center bg-primary/5">
                <Pen className="mx-auto mb-4 text-primary" size={48} />
                <p className="text-muted-foreground mb-4">Click to add your signature</p>
                <Button variant="gold" size="default">
                  Sign Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureSection;
