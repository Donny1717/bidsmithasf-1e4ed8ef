import { FileText, ShieldCheck, BarChart3, Zap } from 'lucide-react';

const capabilities = [
  {
    icon: FileText,
    title: 'AI Bid Drafting',
    description: 'Generate comprehensive bid responses with intelligent content synthesis. Our AI analyses requirements, maps your capabilities, and produces compliant, persuasive documentation.',
    tags: ['Automated section generation', 'Tone & style consistency', 'Multi-format export'],
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Mapping',
    description: 'Automatically verify alignment with procurement requirements, regulatory frameworks, and scoring criteria. Never miss a mandatory clause or disclosure.',
    tags: ['Real-time validation', 'Gap analysis reports', 'Regulatory database'],
  },
  {
    icon: BarChart3,
    title: 'Scoring & Risk Analysis',
    description: 'Predictive scoring engine evaluates bid strength against historical outcomes. Identify weaknesses before submission and optimise for evaluation criteria.',
    tags: ['Win probability scoring', 'Risk assessment', 'Competitive analysis'],
  },
  {
    icon: Zap,
    title: 'Document Automation',
    description: 'Streamline document assembly with intelligent templates, version control, and collaborative workflows. Maintain audit trails and approval chains.',
    tags: ['Template library', 'Version management', 'Approval workflows'],
  },
];

const CapabilitiesSection = () => {
  return (
    <section id="capabilities" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
            CORE CAPABILITIES
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Enterprise-Grade Bid Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Purpose-built for UK government, NHS, defence, and enterprise procurement workflows.
          </p>
        </div>

        {/* Capability Cards */}
        <div className="space-y-8">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-secondary border-2 border-border rounded-3xl p-10 hover:shadow-xl transition-all duration-300 hover:border-primary/50"
            >
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                <div className="w-20 h-20 gradient-gold rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <cap.icon size={40} className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 text-foreground">{cap.title}</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {cap.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-background text-foreground px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
