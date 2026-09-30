-- CampusFlow Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- 1. PROFILES (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('student', 'kitchen_staff', 'librarian', 'admin_staff', 'fees_staff', 'super_admin')),
  student_id text,
  department text,
  phone text,
  created_at timestamptz default now()
);

-- 2. FOOD COURTS
create table if not exists public.food_courts (
  id text primary key,
  name text not null,
  location text not null,
  opening_time text not null default '08:00 AM',
  closing_time text not null default '09:00 PM',
  total_seats int not null default 150,
  current_seats_occupied int not null default 65,
  status text not null default 'open' check (status in ('open', 'closed', 'busy')),
  avg_wait_minutes int not null default 12,
  crowd_level text not null default 'medium' check (crowd_level in ('low', 'medium', 'high')),
  updated_at timestamptz default now()
);

-- 3. MENU CATEGORIES
create table if not exists public.menu_categories (
  id text primary key,
  food_court_id text references public.food_courts(id) on delete cascade,
  name text not null,
  display_order int not null default 0
);

-- 4. MENU ITEMS
create table if not exists public.menu_items (
  id text primary key,
  food_court_id text references public.food_courts(id) on delete cascade,
  category_id text references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  prep_time_minutes int not null default 10,
  is_available boolean not null default true,
  is_veg boolean not null default true,
  image_url text,
  popularity_score numeric(3,2) default 4.5,
  quick_item boolean not null default false
);

-- 5. PICKUP SLOTS (Capacity load distributed, max 45 per slot)
create table if not exists public.pickup_slots (
  id text primary key,
  food_court_id text references public.food_courts(id) on delete cascade,
  slot_time text not null,
  max_capacity int not null default 45,
  current_orders_count int not null default 0,
  status text not null default 'available' check (status in ('available', 'almost_full', 'full'))
);

-- 6. CANTEEN OCCUPANCY LOGS (Realtime simulation & history)
create table if not exists public.canteen_occupancy (
  id uuid default gen_random_uuid() primary key,
  food_court_id text references public.food_courts(id) on delete cascade,
  total_seats int not null,
  occupied_seats int not null,
  crowd_level text not null check (crowd_level in ('low', 'medium', 'high')),
  avg_wait_minutes int not null,
  recorded_at timestamptz default now()
);

-- 7. ORDERS
create table if not exists public.orders (
  id text primary key,
  order_number text not null unique,
  user_id uuid references public.profiles(id),
  user_name text not null,
  food_court_id text references public.food_courts(id),
  pickup_slot_id text references public.pickup_slots(id),
  pickup_slot_time text not null,
  status text not null default 'placed' check (status in ('placed', 'preparing', 'ready', 'picked_up', 'cancelled')),
  total_amount numeric(10,2) not null,
  estimated_ready_time timestamptz,
  actual_ready_time timestamptz,
  qr_code_data text not null,
  counter_number text default 'Counter 1',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. ORDER ITEMS
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id text references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id),
  item_name text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

-- 9. LIBRARY ZONES
create table if not exists public.library_zones (
  id text primary key,
  name text not null,
  description text,
  total_seats int not null default 50,
  occupied_seats int not null default 20,
  noise_level text not null default 'quiet' check (noise_level in ('silent', 'quiet', 'discussion')),
  crowd_level text not null default 'low' check (crowd_level in ('low', 'medium', 'high')),
  floor text not null default 'Ground Floor'
);

-- 10. LIBRARY SEATS
create table if not exists public.library_seats (
  id text primary key,
  zone_id text references public.library_zones(id) on delete cascade,
  seat_number text not null,
  has_power_outlet boolean not null default true,
  is_occupied boolean not null default false,
  reserved_by uuid references public.profiles(id),
  reservation_until timestamptz
);

-- 11. SEAT RESERVATIONS
create table if not exists public.seat_reservations (
  id text primary key,
  user_id uuid references public.profiles(id),
  seat_id text references public.library_seats(id),
  zone_id text references public.library_zones(id),
  slot_date date not null,
  start_time text not null,
  end_time text not null,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled', 'no_show')),
  created_at timestamptz default now()
);

-- 12. EXAM SCHEDULE
create table if not exists public.exam_schedule (
  id text primary key,
  department text not null,
  subject text not null,
  exam_date date not null,
  start_time text not null,
  end_time text not null,
  student_count int not null default 120,
  expected_crowd_multiplier numeric(3,2) default 2.0
);

-- 13. ADMIN SERVICES
create table if not exists public.admin_services (
  id text primary key,
  name text not null,
  description text not null,
  category text not null,
  required_documents jsonb not null default '[]'::jsonb,
  base_processing_minutes int not null default 10,
  is_active boolean not null default true
);

-- 14. SERVICE TOKENS
create table if not exists public.service_tokens (
  id text primary key,
  token_number text not null,
  user_id uuid references public.profiles(id),
  user_name text not null,
  service_id text references public.admin_services(id),
  status text not null default 'waiting' check (status in ('waiting', 'serving', 'completed', 'cancelled')),
  counter_number text,
  estimated_wait_minutes int not null default 15,
  uploaded_documents jsonb default '[]'::jsonb,
  precheck_status text not null default 'pending' check (precheck_status in ('pending', 'complete', 'missing_docs')),
  precheck_notes text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 15. FEE RECORDS
create table if not exists public.fee_records (
  id text primary key,
  user_id uuid references public.profiles(id),
  user_name text not null,
  semester text not null,
  academic_year text not null,
  tuition_fee numeric(10,2) not null default 0,
  library_fee numeric(10,2) not null default 0,
  exam_fee numeric(10,2) not null default 0,
  lab_fee numeric(10,2) not null default 0,
  total_due numeric(10,2) not null default 0,
  due_date date not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'partially_paid', 'paid')),
  paid_at timestamptz,
  receipt_number text,
  payment_method text
);

-- 16. FEE TOKENS (Physical counter digital token)
create table if not exists public.fee_tokens (
  id text primary key,
  token_number text not null,
  user_id uuid references public.profiles(id),
  user_name text not null,
  status text not null default 'waiting' check (status in ('waiting', 'serving', 'completed', 'cancelled')),
  counter_number text,
  estimated_wait_minutes int not null default 10,
  purpose text not null default 'Fee Payment Verification & Challan',
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 17. NOTIFICATIONS
create table if not exists public.notifications (
  id text primary key,
  user_id uuid references public.profiles(id),
  title text not null,
  message text not null,
  type text not null check (type in ('order', 'library', 'admin', 'fee', 'system')),
  read boolean not null default false,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.food_courts enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.pickup_slots enable row level security;
alter table public.canteen_occupancy enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.library_zones enable row level security;
alter table public.library_seats enable row level security;
alter table public.seat_reservations enable row level security;
alter table public.exam_schedule enable row level security;
alter table public.admin_services enable row level security;
alter table public.service_tokens enable row level security;
alter table public.fee_records enable row level security;
alter table public.fee_tokens enable row level security;
alter table public.notifications enable row level security;

-- Public read policies for shared campus catalog
create policy "Anyone can read food courts" on public.food_courts for select using (true);
create policy "Anyone can read menu categories" on public.menu_categories for select using (true);
create policy "Anyone can read menu items" on public.menu_items for select using (true);
create policy "Anyone can read pickup slots" on public.pickup_slots for select using (true);
create policy "Anyone can read canteen occupancy" on public.canteen_occupancy for select using (true);
create policy "Anyone can read library zones" on public.library_zones for select using (true);
create policy "Anyone can read library seats" on public.library_seats for select using (true);
create policy "Anyone can read exam schedule" on public.exam_schedule for select using (true);
create policy "Anyone can read admin services" on public.admin_services for select using (true);

-- User specific & staff policies
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);

create policy "Users can read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where public.orders.id = public.order_items.order_id and public.orders.user_id = auth.uid())
);

create policy "Users can manage own seat reservations" on public.seat_reservations for all using (auth.uid() = user_id);
create policy "Users can manage own service tokens" on public.service_tokens for all using (auth.uid() = user_id);
create policy "Users can read own fee records" on public.fee_records for select using (auth.uid() = user_id);
create policy "Users can manage own fee tokens" on public.fee_tokens for all using (auth.uid() = user_id);
create policy "Users can read own notifications" on public.notifications for select using (auth.uid() = user_id);

-- Staff overrides (Staff can view and update relevant queues)
create policy "Staff full access to orders" on public.orders for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('kitchen_staff', 'super_admin'))
);

create policy "Staff full access to order items" on public.order_items for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('kitchen_staff', 'super_admin'))
);

create policy "Staff full access to library" on public.library_seats for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('librarian', 'super_admin'))
);

create policy "Staff full access to service tokens" on public.service_tokens for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin_staff', 'super_admin'))
);

create policy "Staff full access to fee tokens" on public.fee_tokens for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('fees_staff', 'super_admin'))
);
