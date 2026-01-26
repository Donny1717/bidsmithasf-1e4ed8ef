import { Shield, Lock, FileCheck, ShieldCheck } from 'lucide-react';

const certifications = [
  { icon: Shield, name: 'SOC 2 Type II' },
  { icon: Lock, name: 'ISO 27001' },
  { icon: FileCheck, name: 'GDPR Compliant' },
  { icon: ShieldCheck, name: 'Cyber Essentials Plus' },
];

const ComplianceSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="bg-card border-2 border-border rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group"
            >
              <cert.icon className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" size={56} />
              <h3 className="font-bold text-xl text-foreground">{cert.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
