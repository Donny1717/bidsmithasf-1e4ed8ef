import { Shield, FileCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: FileCheck, value: '70%', label: 'Faster Drafting' },
  { icon: Shield, value: '99.2%', label: 'Compliance Rate' },
  { icon: TrendingUp, value: '3.2x', label: 'Higher Win Rate' },
];

const HeroSection = () => {
  return (
    <section id="hero" className="gradient-dark py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <Shield className="text-primary" size={20} />
            <span className="text-primary font-semibold">Institution-Grade AI for Winning Bids</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Transform Procurement with{' '}
            <span className="text-primary">Intelligent Bid Automation</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Reduce drafting time by 70%. Ensure complete regulatory compliance. 
            Improve win rates with AI-powered bid intelligence trusted by UK government and enterprise.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl">
              Generate Bid with AI →
            </Button>
            <Button variant="heroOutline" size="xl">
              Platform Overview
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="gradient-surface border border-gold rounded-2xl p-8 text-center hover:shadow-gold transition-all duration-300"
              >
                <stat.icon className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="text-4xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
