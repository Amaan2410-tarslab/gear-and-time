-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table for watches
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  brand TEXT,
  model TEXT,
  case_material TEXT,
  band_material TEXT,
  movement_type TEXT,
  water_resistance TEXT,
  case_diameter TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL, -- Total in cents
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time INTEGER NOT NULL, -- Price when ordered (in cents)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories and products are publicly readable
CREATE POLICY "Categories are publicly readable" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Products are publicly readable" 
ON public.products FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES 
('Luxury', 'Premium luxury timepieces'),
('Sport', 'Athletic and sport watches'),
('Classic', 'Timeless classic designs'),
('Smart', 'Modern smartwatches');

-- Insert sample watch products
INSERT INTO public.products (name, description, price, category_id, brand, model, case_material, band_material, movement_type, water_resistance, case_diameter, stock_quantity, is_featured) VALUES 
('Rolex Submariner', 'Iconic diving watch with exceptional craftsmanship', 1299500, (SELECT id FROM public.categories WHERE name = 'Luxury' LIMIT 1), 'Rolex', 'Submariner', 'Stainless Steel', 'Stainless Steel', 'Automatic', '300m', '40mm', 5, true),
('Omega Speedmaster', 'Professional chronograph worn on moon missions', 599500, (SELECT id FROM public.categories WHERE name = 'Sport' LIMIT 1), 'Omega', 'Speedmaster', 'Stainless Steel', 'Stainless Steel', 'Manual', '50m', '42mm', 8, true),
('Cartier Tank', 'Elegant rectangular dress watch', 549900, (SELECT id FROM public.categories WHERE name = 'Classic' LIMIT 1), 'Cartier', 'Tank', 'Gold', 'Leather', 'Quartz', '30m', '31mm', 3, false),
('Tag Heuer Formula 1', 'Racing-inspired sports chronograph', 129500, (SELECT id FROM public.categories WHERE name = 'Sport' LIMIT 1), 'Tag Heuer', 'Formula 1', 'Steel', 'Steel', 'Quartz', '200m', '43mm', 12, false),
('Patek Philippe Calatrava', 'Ultimate in horological elegance', 2999500, (SELECT id FROM public.categories WHERE name = 'Luxury' LIMIT 1), 'Patek Philippe', 'Calatrava', 'Gold', 'Leather', 'Automatic', '30m', '39mm', 2, true),
('Apple Watch Series 9', 'Advanced health and fitness tracking', 39900, (SELECT id FROM public.categories WHERE name = 'Smart' LIMIT 1), 'Apple', 'Series 9', 'Aluminum', 'Sport Band', 'Digital', '50m', '45mm', 25, false);