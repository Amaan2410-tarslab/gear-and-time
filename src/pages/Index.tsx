import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  brand: string;
  is_featured: boolean;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(3);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 animate-fade-in bg-primary/10 hover:bg-primary/20 transition-colors duration-300">
              ✨ Premium Timepieces
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 animate-scale-in">
              Discover Luxury{' '}
              <span className="text-shimmer bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                Watches
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
              From classic elegance to modern innovation, find the perfect timepiece that reflects your{' '}
              <span className="text-primary font-semibold">style and personality</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-500">
              <Link to="/products">
                <Button size="lg" className="px-10 py-4 text-lg group relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    Shop Collection
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              <Link to="/products?category=luxury">
                <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 hover:border-primary/50 transform hover:scale-105 transition-all duration-300">
                  Luxury Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Premium Quality", desc: "Handcrafted timepieces from the world's most prestigious brands.", delay: "0ms" },
              { icon: Shield, title: "Authenticity Guaranteed", desc: "Every watch comes with certification and manufacturer warranty.", delay: "200ms" },
              { icon: Truck, title: "Free Shipping", desc: "Complimentary shipping and handling on all orders worldwide.", delay: "400ms" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Featured <span className="text-gradient bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Watches</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in animation-delay-200">
              Discover our hand-picked selection of exceptional timepieces that embody{' '}
              <span className="text-primary font-semibold">craftsmanship and elegance</span>.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="perspective-1000">
                  <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 animate-pulse"></div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-6 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                        <div className="h-8 bg-muted rounded animate-pulse w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-16 animate-fade-in animation-delay-800">
            <Link to="/products">
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg group border-2 hover:border-primary/50 transform hover:scale-105 transition-all duration-300">
                View All Watches
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float animation-delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce-slow" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-scale-in">
            Find Your Perfect{' '}
            <span className="relative">
              Timepiece
              <div className="absolute inset-0 bg-white/20 blur-lg animate-glow" />
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
            Browse our extensive collection of luxury, sport, classic, and smart watches from{' '}
            <span className="font-bold">renowned brands</span>.
          </p>
          <div className="animate-fade-in animation-delay-500">
            <Link to="/products">
              <Button variant="secondary" size="lg" className="px-12 py-4 text-lg font-semibold transform hover:scale-110 transition-all duration-300 hover:shadow-2xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
