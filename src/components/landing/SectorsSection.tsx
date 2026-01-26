import { Building, FileText, Heart, Shield, Check } from 'lucide-react';

const sectors = [
  { icon: Building, name: 'UK Government' },
  { icon: FileText, name: 'Enterprise' },
  { icon: Heart, name: 'NHS & Healthcare' },
  { icon: Shield, name: 'Defence' },
];

const securityFeatures = [
  'End-to-end encryption',
  'UK data residency',
  'Role-based access control',
  'Complete audit trails',
  'Regular penetration testing',
];

const SectorsSection = () => {
  return (
    <section id="security" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Trusted Across Critical Sectors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Purpose-built for organisations where compliance and security are non-negotiable.
          </p>
        </div>

        {/* Sector Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="bg-secondary border-2 border-border rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:border-primary group"
            >
              <sector.icon className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" size={56} />
              <h3 className="font-bold text-lg text-foreground">{sector.name}</h3>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="gradient-dark rounded-3xl p-12">
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">Security Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {securityFeatures.map((feature) => (
              <div key={feature}>
                <Check className="mx-auto mb-3 text-primary" size={32} />
                <p className="text-sm text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;
