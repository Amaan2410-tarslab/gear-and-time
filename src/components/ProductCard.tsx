import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
    <div className="perspective-1000">
      <Card className="card-3d group overflow-hidden hover:shadow-2xl transition-all duration-500 transform-gpu relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative aspect-square overflow-hidden">
          {product.image_url ? (
            <div className="relative w-full h-full">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground text-sm animate-pulse">No Image</span>
            </div>
          )}
          
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm animate-bounce-slow" variant="secondary">
              ✨ Featured
            </Badge>
          )}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <Link to={`/product/${product.id}`}>
              <Button variant="secondary" size="icon" className="bg-background/80 backdrop-blur-sm hover:bg-background">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <CardContent className="p-6 relative">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium tracking-wide">{product.brand}</p>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button 
            onClick={handleAddToCart} 
            className="flex-1 group/btn relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:animate-bounce" />
              Add to Cart
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};