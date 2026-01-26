import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "BidSmith ASF has transformed how we approach procurement. Our bid success rate increased by 40% in the first quarter alone.",
    author: "Sarah Mitchell",
    role: "Head of Procurement",
    company: "Ministry of Defence",
    logo: "MoD",
  },
  {
    quote: "The compliance mapping feature alone has saved us countless hours. We've never missed a regulatory requirement since implementation.",
    author: "James Richardson",
    role: "Director of Operations",
    company: "NHS England",
    logo: "NHS",
  },
  {
    quote: "An essential tool for any enterprise serious about winning government contracts. The AI drafting is remarkably accurate.",
    author: "Dr. Emily Chen",
    role: "Chief Strategy Officer",
    company: "BAE Systems",
    logo: "BAE",
  },
  {
    quote: "We reduced our bid preparation time from weeks to days. The ROI was evident within the first month of deployment.",
    author: "Michael O'Brien",
    role: "VP of Business Development",
    company: "Capita Group",
    logo: "CGP",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 gradient-dark">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
            TESTIMONIALS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See why leading UK government departments and enterprises choose BidSmith ASF.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="gradient-surface border border-gold rounded-2xl p-8 hover:shadow-gold transition-all duration-300 group"
            >
              {/* Quote Icon */}
              <Quote className="text-primary mb-6 opacity-50" size={40} />
              
              {/* Quote Text */}
              <blockquote className="text-lg text-foreground mb-8 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                </div>
                
                {/* Company Logo Placeholder */}
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                  <span className="text-lg font-bold text-primary">{testimonial.logo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-card/50 border border-border rounded-2xl px-10 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">150+</p>
              <p className="text-sm text-muted-foreground">Government Clients</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">£2.4B</p>
              <p className="text-sm text-muted-foreground">Contracts Won</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Client Retention</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
