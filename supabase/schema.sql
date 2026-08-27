-- J Tech Solar, Starlink & CCTV Hub Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  email text not null default '',
  phone text default '',
  whatsapp text default '',
  address text default '',
  state text default '',
  city text default '',
  avatar_url text default '',
  role text not null default 'customer' check (role in ('customer', 'admin', 'super_admin', 'technician')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================
-- SETTINGS
-- ============================================
create table public.settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null default '{}',
  category text not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "Settings are viewable by everyone"
  on public.settings for select using (true);

create policy "Only admins can update settings"
  on public.settings for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Only admins can insert settings"
  on public.settings for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- SERVICE CATEGORIES
-- ============================================
create table public.service_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text default '',
  image_url text default '',
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_categories enable row level security;

create policy "Service categories are viewable by everyone"
  on public.service_categories for select using (is_active = true);

create policy "Admins can manage service categories"
  on public.service_categories for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- SERVICES
-- ============================================
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.service_categories(id) on delete set null,
  title text not null,
  slug text unique not null,
  description text not null default '',
  short_description text default '',
  image_url text default '',
  hero_image_url text default '',
  benefits jsonb default '[]',
  includes jsonb default '[]',
  equipment jsonb default '[]',
  process_steps jsonb default '[]',
  estimated_duration text default '',
  pricing_type text default 'request_quote' check (pricing_type in ('fixed', 'starting', 'range', 'request_quote')),
  starting_price integer default 0,
  price_range_min integer default 0,
  price_range_max integer default 0,
  meta_title text default '',
  meta_description text default '',
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Services are viewable by everyone"
  on public.services for select using (is_active = true);

create policy "Admins can manage services"
  on public.services for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- SERVICE FAQs
-- ============================================
create table public.service_faqs (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.service_faqs enable row level security;

create policy "Service FAQs are viewable by everyone"
  on public.service_faqs for select using (is_active = true);

create policy "Admins can manage service FAQs"
  on public.service_faqs for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- SERVICE GALLERY
-- ============================================
create table public.service_gallery (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) on delete cascade,
  image_url text not null,
  caption text default '',
  display_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.service_gallery enable row level security;

create policy "Service gallery is viewable by everyone"
  on public.service_gallery for select using (true);

create policy "Admins can manage service gallery"
  on public.service_gallery for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- TECHNICIANS
-- ============================================
create table public.technicians (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  phone text not null default '',
  email text default '',
  specialization text default '',
  profile_photo text default '',
  availability text default 'available' check (availability in ('available', 'busy', 'unavailable')),
  status text default 'active' check (status in ('active', 'inactive')),
  bio text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.technicians enable row level security;

create policy "Technicians are viewable by everyone"
  on public.technicians for select using (status = 'active');

create policy "Admins can manage technicians"
  on public.technicians for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- BOOKINGS
-- ============================================
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  booking_number text unique not null,
  customer_id uuid references public.profiles(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  service_name text not null,
  service_type text default '',
  full_name text not null,
  email text default '',
  phone text not null,
  whatsapp text default '',
  state text default '',
  city text default '',
  address text default '',
  description text not null default '',
  project_details jsonb default '{}',
  preferred_date date,
  preferred_time text default '',
  appointment_date date,
  appointment_time text default '',
  assigned_technician_id uuid references public.technicians(id) on delete set null,
  admin_notes text default '',
  internal_notes text default '',
  estimated_cost integer default 0,
  final_cost integer default 0,
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'partial', 'paid', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Customers can view own bookings"
  on public.bookings for select using (
    auth.uid() = customer_id
  );

create policy "Customers can create bookings"
  on public.bookings for insert with check (true);

create policy "Admins can manage all bookings"
  on public.bookings for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- BOOKING UPLOADS
-- ============================================
create table public.booking_uploads (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text not null default '',
  file_size integer default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.booking_uploads enable row level security;

create policy "Booking uploads viewable by booking owner and admin"
  on public.booking_uploads for select using (
    exists (
      select 1 from public.bookings
      where id = booking_id and (
        customer_id = auth.uid()
        or exists (
          select 1 from public.profiles
          where id = auth.uid() and role in ('admin', 'super_admin')
        )
      )
    )
  );

create policy "Users can upload for their bookings"
  on public.booking_uploads for insert with check (
    exists (
      select 1 from public.bookings
      where id = booking_id and customer_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- PROJECTS (Portfolio)
-- ============================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text not null default '',
  location text default '',
  service_id uuid references public.services(id) on delete set null,
  service_type text default '',
  client_name text default '',
  is_published boolean default true,
  is_featured boolean default false,
  meta_title text default '',
  meta_description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Published projects are viewable by everyone"
  on public.projects for select using (is_published = true);

create policy "Admins can manage projects"
  on public.projects for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- PROJECT IMAGES
-- ============================================
create table public.project_images (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  image_url text not null,
  caption text default '',
  image_type text default 'standard' check (image_type in ('standard', 'before', 'after')),
  display_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.project_images enable row level security;

create policy "Project images are viewable by everyone"
  on public.project_images for select using (true);

create policy "Admins can manage project images"
  on public.project_images for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- REVIEWS
-- ============================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text not null,
  image_url text default '',
  service_used text default '',
  is_approved boolean default false,
  is_featured boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Approved reviews are viewable by everyone"
  on public.reviews for select using (is_approved = true);

create policy "Users can create reviews"
  on public.reviews for insert with check (true);

create policy "Admins can manage reviews"
  on public.reviews for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- QUOTES
-- ============================================
create table public.quotes (
  id uuid default uuid_generate_v4() primary key,
  quote_number text unique not null,
  customer_id uuid references public.profiles(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  full_name text not null,
  email text default '',
  phone text not null,
  state text default '',
  city text default '',
  address text default '',
  description text not null default '',
  budget text default '',
  preferred_date date,
  status text default 'pending' check (status in ('pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired')),
  quote_amount integer default 0,
  quote_description text default '',
  quote_items jsonb default '[]',
  estimated_duration text default '',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

create policy "Customers can view own quotes"
  on public.quotes for select using (
    auth.uid() = customer_id
  );

create policy "Anyone can submit quotes"
  on public.quotes for insert with check (true);

create policy "Admins can manage quotes"
  on public.quotes for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- QUOTE UPLOADS
-- ============================================
create table public.quote_uploads (
  id uuid default uuid_generate_v4() primary key,
  quote_id uuid references public.quotes(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text default '',
  file_size integer default 0,
  created_at timestamptz not null default now()
);

alter table public.quote_uploads enable row level security;

create policy "Quote uploads viewable by quote owner and admin"
  on public.quote_uploads for select using (
    exists (
      select 1 from public.quotes
      where id = quote_id and (
        customer_id = auth.uid()
        or exists (
          select 1 from public.profiles
          where id = auth.uid() and role in ('admin', 'super_admin')
        )
      )
    )
  );

create policy "Users can upload for their quotes"
  on public.quote_uploads for insert with check (true);

-- ============================================
-- PAYMENTS
-- ============================================
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  invoice_id uuid,
  customer_id uuid references public.profiles(id) on delete set null,
  amount integer not null,
  currency text default 'NGN',
  status text default 'pending' check (status in ('pending', 'success', 'failed', 'refunded')),
  payment_method text default 'paystack',
  transaction_reference text default '',
  paystack_reference text default '',
  metadata jsonb default '{}',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Customers can view own payments"
  on public.payments for select using (
    auth.uid() = customer_id
  );

create policy "Admins can manage payments"
  on public.payments for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- INVOICES
-- ============================================
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  invoice_number text unique not null,
  booking_id uuid references public.bookings(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null,
  items jsonb default '[]',
  subtotal integer default 0,
  tax integer default 0,
  total integer not null default 0,
  status text default 'unpaid' check (status in ('unpaid', 'paid', 'overdue', 'cancelled')),
  due_date date,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "Customers can view own invoices"
  on public.invoices for select using (
    auth.uid() = customer_id
  );

create policy "Admins can manage invoices"
  on public.invoices for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- BLOG CATEGORIES
-- ============================================
create table public.blog_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text default '',
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.blog_categories enable row level security;

create policy "Blog categories are viewable by everyone"
  on public.blog_categories for select using (is_active = true);

create policy "Admins can manage blog categories"
  on public.blog_categories for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- BLOG POSTS
-- ============================================
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null default '',
  excerpt text default '',
  featured_image text default '',
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.blog_categories(id) on delete set null,
  tags jsonb default '[]',
  meta_title text default '',
  meta_description text default '',
  seo_keywords text default '',
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Published blog posts are viewable by everyone"
  on public.blog_posts for select using (status = 'published');

create policy "Admins can manage blog posts"
  on public.blog_posts for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- FAQs
-- ============================================
create table public.faqs (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  category text default 'general',
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "FAQs are viewable by everyone"
  on public.faqs for select using (is_active = true);

create policy "Admins can manage FAQs"
  on public.faqs for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- CONTACT MESSAGES
-- ============================================
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text default '',
  subject text not null default '',
  message text not null,
  service_type text default '',
  status text default 'unread' check (status in ('unread', 'read', 'replied', 'archived')),
  admin_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact messages"
  on public.contact_messages for insert with check (true);

create policy "Admins can manage contact messages"
  on public.contact_messages for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'info' check (type in ('info', 'success', 'warning', 'error')),
  link text default '',
  is_read boolean default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

create policy "System can create notifications"
  on public.notifications for insert with check (true);

-- ============================================
-- INDEXES
-- ============================================
create index idx_bookings_customer_id on public.bookings(customer_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_created_at on public.bookings(created_at desc);
create index idx_bookings_booking_number on public.bookings(booking_number);
create index idx_services_slug on public.services(slug);
create index idx_services_category on public.services(category_id);
create index idx_projects_slug on public.projects(slug);
create index idx_projects_service on public.projects(service_id);
create index idx_reviews_service on public.reviews(service_id);
create index idx_reviews_approved on public.reviews(is_approved);
create index idx_blog_posts_slug on public.blog_posts(slug);
create index idx_blog_posts_status on public.blog_posts(status);
create index idx_blog_posts_category on public.blog_posts(category_id);
create index idx_faqs_category on public.faqs(category);
create index idx_quotes_customer on public.quotes(customer_id);
create index idx_payments_customer on public.payments(customer_id);
create index idx_payments_status on public.payments(status);
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_read on public.notifications(is_read);
create index idx_settings_key on public.settings(key);
create index idx_service_faqs_service on public.service_faqs(service_id);
create index idx_project_images_project on public.project_images(project_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.services
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.reviews
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.bookings
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.quotes
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.payments
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.invoices
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.technicians
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.contact_messages
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.blog_posts
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.faqs
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.settings
  for each row execute procedure public.handle_updated_at();

-- Generate booking number
create or replace function generate_booking_number()
returns trigger as $$
begin
  new.booking_number := 'JT-' || to_char(now(), 'YYMM') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_booking_number before insert on public.bookings
  for each row execute procedure generate_booking_number();

-- Generate quote number
create or replace function generate_quote_number()
returns trigger as $$
begin
  new.quote_number := 'JTQ-' || to_char(now(), 'YYMM') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_quote_number before insert on public.quotes
  for each row execute procedure generate_quote_number();

-- Generate invoice number
create or replace function generate_invoice_number_trigger()
returns trigger as $$
begin
  new.invoice_number := 'JTI-' || to_char(now(), 'YYMM') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_invoice_number before insert on public.invoices
  for each row execute procedure generate_invoice_number_trigger();
