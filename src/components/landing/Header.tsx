import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { href: '#platform', label: 'Platform' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#security', label: 'Security' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="gradient-dark border-b border-gold sticky top-0 z-50 shadow-xl">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">B°</span>
            </div>
            <div className="text-2xl font-bold tracking-wide text-foreground">
              BidSmith <span className="text-primary">ASF</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="hover:bg-primary/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full border-primary/50 hover:bg-primary/10"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full hover:bg-primary/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
