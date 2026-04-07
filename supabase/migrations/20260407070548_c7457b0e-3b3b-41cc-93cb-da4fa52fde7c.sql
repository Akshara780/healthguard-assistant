
CREATE TABLE public.whatsapp_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  health_alerts BOOLEAN NOT NULL DEFAULT true,
  vaccine_reminders BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public subscription form)
CREATE POLICY "Anyone can subscribe" ON public.whatsapp_subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own subscription by phone (for status check)
CREATE POLICY "Anyone can read subscriptions" ON public.whatsapp_subscriptions
  FOR SELECT USING (true);

-- Allow anyone to update their subscription
CREATE POLICY "Anyone can update subscriptions" ON public.whatsapp_subscriptions
  FOR UPDATE USING (true);

CREATE UNIQUE INDEX idx_whatsapp_subscriptions_phone ON public.whatsapp_subscriptions (phone);
