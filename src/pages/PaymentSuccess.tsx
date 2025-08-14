import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear cart on successful payment
    if (sessionId && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [sessionId, clearCart, cleared]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Thank you for your purchase! Your order has been confirmed and will be processed shortly.
              </p>
              {sessionId && (
                <p className="text-sm text-muted-foreground">
                  Order reference: {sessionId.slice(-8).toUpperCase()}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/products">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button>
                    View Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}