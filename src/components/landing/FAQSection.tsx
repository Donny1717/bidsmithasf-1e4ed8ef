import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "How does BidSmith ASF's AI improve bid quality?",
      answer: "Our AI analyses thousands of successful government and enterprise bids to identify winning patterns. It synthesises your company's capabilities with tender requirements, ensuring comprehensive, compliant responses that address every evaluation criterion. The result is consistently higher-scoring submissions with 70% faster drafting times."
    },
    {
      question: "Is my data secure with BidSmith ASF?",
      answer: "Absolutely. We maintain SOC 2 Type II, ISO 27001, and Cyber Essentials Plus certifications. All data is encrypted at rest and in transit, stored exclusively in UK data centres, and protected by role-based access controls. We conduct regular penetration testing and security audits to ensure enterprise-grade protection."
    },
    {
      question: "Can BidSmith ASF handle complex government frameworks?",
      answer: "Yes. Our platform is purpose-built for UK public sector procurement, including Crown Commercial Service frameworks, NHS procurement, MOD contracts, and local authority tenders. We maintain an up-to-date regulatory database covering all major compliance requirements and scoring methodologies."
    },
    {
      question: "How does the digital signature workflow work?",
      answer: "Our audit-ready approval system provides cryptographic signatures with immutable audit trails. Documents progress through Draft, Pending Review, Signed, and Locked stages. Each stage captures timestamps, user identities, and document hashes for complete compliance attestation—essential for government submissions."
    },
    {
      question: "What integrations does BidSmith ASF support?",
      answer: "Enterprise plans include API access and SSO integration (SAML 2.0, OAuth). We integrate with major document management systems, CRMs, and procurement platforms. Custom integrations are available for Government tier clients, with dedicated technical support for implementation."
    },
    {
      question: "Can I try BidSmith ASF before committing?",
      answer: "Yes, all plans include a 14-day free trial with full platform access—no credit card required. Enterprise and Government clients can also request a personalised demo with our solutions team to explore specific use cases and compliance requirements."
    },
    {
      question: "How is pricing structured for high-volume users?",
      answer: "Professional plans support up to 25 bids monthly. Enterprise plans offer unlimited bids with advanced AI models and full compliance features. Government tier pricing is customised based on organisation size, volume requirements, and specific integration needs. Contact our sales team for a tailored quote."
    },
    {
      question: "What support is available?",
      answer: "Professional plans include email support with 24-hour response times. Enterprise clients receive priority support with dedicated account managers. Government tier includes on-site training, custom onboarding programmes, and SLA-backed response guarantees."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">FAQ</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about BidSmith ASF and how it can transform your procurement process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 shadow-sm hover:shadow-gold/20 transition-all duration-300 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center text-primary font-semibold hover:underline"
          >
            Contact our team →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
