import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Professional',
    description: 'For growing teams managing multiple bids',
    price: '£499',
    period: '/month',
    features: [
      'Up to 25 bids per month',
      'AI-powered drafting',
      'Compliance verification',
      'Standard templates',
      'Email support',
    ],
    buttonVariant: 'dark' as const,
    buttonText: 'Start Professional',
    popular: false,
  },
  {
    name: 'Enterprise',
    description: 'For organisations with high-volume procurement',
    price: '£1,499',
    period: '/month',
    features: [
      'Unlimited bids',
      'Advanced AI models',
      'Full compliance suite',
      'Custom templates',
      'Priority support',
      'Advanced analytics',
      'API access',
      'SSO integration',
    ],
    buttonVariant: 'hero' as const,
    buttonText: 'Start Enterprise',
    popular: true,
  },
  {
    name: 'Government',
    description: 'Tailored for public sector requirements',
    price: 'Custom',
    period: '',
    features: [
      'All Enterprise features',
      'UK data residency',
      'Dedicated account team',
      'Custom integrations',
      'On-premise option',
      'Annual security audits',
      'SLA guarantees',
      'Training & onboarding',
    ],
    buttonVariant: 'government' as const,
    buttonText: 'Contact Sales',
    popular: false,
    isGovernment: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
            PRICING
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transparent, Scalable Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that matches your procurement volume and compliance requirements.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 transition-all duration-300 ${
                plan.popular
                  ? 'gradient-dark border-2 border-primary transform md:scale-105 shadow-gold relative'
                  : 'bg-card border-2 border-border hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              {plan.isGovernment && (
                <div className="mb-6 bg-secondary rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              )}

              {!plan.isGovernment && (
                <>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                </>
              )}
              
              <div className="text-5xl font-bold mb-6 text-foreground">
                {plan.price}
                <span className="text-lg text-muted-foreground">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-foreground">
                    <Check className={`mr-3 flex-shrink-0 mt-1 ${plan.popular ? 'text-primary' : 'text-primary'}`} size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant={plan.buttonVariant} size="lg" className="w-full">
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Free Trial Note */}
        <p className="text-center text-muted-foreground mt-12 text-lg">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
