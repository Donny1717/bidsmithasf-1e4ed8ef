import { Shield, Lock, Check } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="gradient-dark border-t border-gold py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">B°</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                BidSmith <span className="text-primary">ASF</span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Institution-grade AI platform for UK government and enterprise bid writing, compliance, and procurement intelligence.
            </p>
            <div className="flex space-x-2 mb-4">
              <div className="flex items-center space-x-1 text-xs bg-secondary px-3 py-1 rounded text-foreground">
                <Shield size={14} className="text-primary" />
                <span>SOC 2</span>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-secondary px-3 py-1 rounded text-foreground">
                <Lock size={14} className="text-primary" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-secondary px-3 py-1 rounded text-foreground">
                <Check size={14} className="text-primary" />
                <span>GDPR</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>info@bidsmith.co.uk</p>
              <p>hello@bidsmith.co.uk</p>
              <p>+44 7468 393510</p>
            </div>
          </div>
          
          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">AI Bid Drafting</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Compliance Mapping</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Scoring & Analysis</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Document Automation</a></li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Data Processing</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-muted pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2026 BidSmith ASF. All rights reserved.</p>
            <p>By <span className="text-primary font-semibold">Honey-B2024 Ltd</span> (UK)</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
