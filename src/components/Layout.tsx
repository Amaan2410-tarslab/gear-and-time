import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Watch } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const { state: cartState } = useCart();

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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Watch className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">TimeKeeper</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                Watches
              </Link>
              <Link to="/categories" className="text-foreground hover:text-primary transition-colors">
                Categories
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4" />
                  {cartState.items.length > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
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

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">TimeKeeper</h3>
              <p className="text-muted-foreground text-sm">
                Premium timepieces for every occasion. Discover luxury, sport, and classic watches.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/products?category=luxury" className="hover:text-foreground">Luxury</Link></li>
                <li><Link to="/products?category=sport" className="hover:text-foreground">Sport</Link></li>
                <li><Link to="/products?category=classic" className="hover:text-foreground">Classic</Link></li>
                <li><Link to="/products?category=smart" className="hover:text-foreground">Smart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground">Returns</a></li>
                <li><a href="#" className="hover:text-foreground">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Newsletter</a></li>
                <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground">Facebook</a></li>
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 mt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TimeKeeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};