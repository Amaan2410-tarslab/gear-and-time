import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Watch } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const { state: cartState } = useCart();
  const { isAdmin } = useRole();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Watch className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                TimeKeeper
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/products" 
                className="text-foreground hover:text-primary transition-all duration-300 relative group"
              >
                <span>Watches</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                to="/categories" 
                className="text-foreground hover:text-primary transition-all duration-300 relative group"
              >
                <span>Categories</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative group">
                <Button variant="outline" size="sm" className="relative overflow-hidden transition-all duration-300 hover:scale-105">
                  <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
                  {cartState.items.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-slow"
                    >
                      {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="group hover:scale-105 transition-all duration-300 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <User className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="group hover:scale-105 transition-all duration-300">
                      <User className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline" 
                    size="sm"
                    className="hover:scale-105 transition-all duration-300"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="group relative overflow-hidden hover:scale-105 transition-all duration-300">
                    <span className="relative z-10 flex items-center">
                      <User className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                      Sign In
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Watch className="h-6 w-6 text-primary" />
                <h3 className="font-bold text-foreground text-lg">TimeKeeper</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Premium timepieces for every occasion. Discover luxury, sport, and classic watches 
                crafted with <span className="text-primary font-semibold">exceptional precision</span>.
              </p>
            </div>
            
            {[
              {
                title: "Categories",
                links: [
                  { name: "Luxury", href: "/products?category=luxury" },
                  { name: "Sport", href: "/products?category=sport" },
                  { name: "Classic", href: "/products?category=classic" },
                  { name: "Smart", href: "/products?category=smart" }
                ]
              },
              {
                title: "Support",
                links: [
                  { name: "Contact Us", href: "#" },
                  { name: "Shipping Info", href: "#" },
                  { name: "Returns", href: "#" },
                  { name: "Size Guide", href: "#" }
                ]
              },
              {
                title: "Connect",
                links: [
                  { name: "Newsletter", href: "#" },
                  { name: "Instagram", href: "#" },
                  { name: "Facebook", href: "#" },
                  { name: "Twitter", href: "#" }
                ]
              }
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-foreground">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href} 
                        className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm relative group"
                      >
                        {link.name}
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-8 mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 <span className="text-primary font-semibold">TimeKeeper</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};