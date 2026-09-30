-- CampusFlow Initial Seed Data

-- 1. FOOD COURTS
insert into public.food_courts (id, name, location, opening_time, closing_time, total_seats, current_seats_occupied, status, avg_wait_minutes, crowd_level)
values
  ('fc-1', 'Central Dining Commons', 'Building A, Ground Floor', '08:00 AM', '09:30 PM', 180, 115, 'open', 14, 'medium'),
  ('fc-2', 'South Campus Food Hub', 'Student Union, 1st Floor', '08:30 AM', '08:00 PM', 120, 42, 'open', 6, 'low')
on conflict (id) do nothing;

-- 2. MENU CATEGORIES
insert into public.menu_categories (id, food_court_id, name, display_order)
values
  ('cat-1', 'fc-1', 'Meals & Thalis', 1),
  ('cat-2', 'fc-1', 'Fast Food & Snacks', 2),
  ('cat-3', 'fc-1', 'Beverages & Shakes', 3),
  ('cat-4', 'fc-1', 'Desserts & Ice Cream', 4),
  ('cat-5', 'fc-2', 'Quick Bites & Wraps', 1),
  ('cat-6', 'fc-2', 'Coffee & Drinks', 2),
  ('cat-7', 'fc-2', 'Bowls & Salads', 3)
on conflict (id) do nothing;

-- 3. MENU ITEMS
insert into public.menu_items (id, food_court_id, category_id, name, description, price, prep_time_minutes, is_available, is_veg, image_url, popularity_score, quick_item)
values
  ('item-1', 'fc-1', 'cat-1', 'Executive North Indian Thali', '2 rotis, paneer butter masala, dal makhani, jeera rice, salad & gulab jamun', 120.00, 15, true, true, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 4.8, false),
  ('item-2', 'fc-1', 'cat-1', 'South Indian Mini Meal', 'Sambar rice, curd rice, poriyal, papad & pickle', 85.00, 8, true, true, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', 4.6, true),
  ('item-3', 'fc-1', 'cat-2', 'Crispy Paneer Burger', 'Spiced cottage cheese patty, cheddar slice, crunchy lettuce with peri-peri mayo', 95.00, 10, true, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 4.9, false),
  ('item-4', 'fc-1', 'cat-2', 'Schezwan Fried Rice & Manchurian', 'Wok-tossed spicy rice served with 4 vegetable manchurian balls', 110.00, 12, true, true, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', 4.7, false),
  ('item-5', 'fc-1', 'cat-3', 'Cold Brew Coffee', 'Steeped for 18 hours, served chilled over ice with creamy milk float', 65.00, 3, true, true, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 4.9, true),
  ('item-6', 'fc-1', 'cat-3', 'Fresh Mango Smoothie', 'Blended Alphonso pulp with greek yogurt and chia seeds', 75.00, 4, true, true, 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80', 4.5, true),
  ('item-7', 'fc-1', 'cat-4', 'Belgian Waffle with Chocolate', 'Crispy warm waffle topped with molten dark chocolate and vanilla scoop', 90.00, 8, true, true, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80', 4.8, false),
  ('item-8', 'fc-2', 'cat-5', 'Grilled Veggie & Cheese Panini', 'Focaccia bread with zucchini, bell peppers, mozzarella and basil pesto', 85.00, 6, true, true, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 4.7, true),
  ('item-9', 'fc-2', 'cat-5', 'Chipotle Paneer Wrap', 'Whole wheat tortilla stuffed with smokey tandoori paneer and pickled onions', 90.00, 7, true, true, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80', 4.6, true),
  ('item-10', 'fc-2', 'cat-6', 'Iced Matcha Latte', 'Ceremonial grade matcha whisked with oat milk and honey', 80.00, 3, true, true, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', 4.8, true),
  ('item-11', 'fc-2', 'cat-7', 'Mediterranean Quinoa Salad Bowl', 'Fluffy quinoa, kalamata olives, cherry tomatoes, cucumbers, feta and lemon dressing', 105.00, 5, true, true, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', 4.5, true)
on conflict (id) do nothing;

-- 4. PICKUP SLOTS
insert into public.pickup_slots (id, food_court_id, slot_time, max_capacity, current_orders_count, status)
values
  ('slot-1', 'fc-1', '12:00 PM - 12:10 PM', 45, 12, 'available'),
  ('slot-2', 'fc-1', '12:10 PM - 12:20 PM', 45, 28, 'available'),
  ('slot-3', 'fc-1', '12:20 PM - 12:30 PM', 45, 41, 'almost_full'),
  ('slot-4', 'fc-1', '12:30 PM - 12:40 PM', 45, 44, 'almost_full'),
  ('slot-5', 'fc-1', '12:40 PM - 12:50 PM', 45, 19, 'available'),
  ('slot-6', 'fc-1', '12:50 PM - 01:00 PM', 45, 14, 'available'),
  ('slot-7', 'fc-1', '01:00 PM - 01:10 PM', 45, 22, 'available'),
  ('slot-8', 'fc-2', '12:15 PM - 12:25 PM', 45, 8, 'available'),
  ('slot-9', 'fc-2', '12:25 PM - 12:35 PM', 45, 15, 'available'),
  ('slot-10', 'fc-2', '12:35 PM - 12:45 PM', 45, 20, 'available')
on conflict (id) do nothing;

-- 5. LIBRARY ZONES
insert into public.library_zones (id, name, description, total_seats, occupied_seats, noise_level, crowd_level, floor)
values
  ('zone-a', 'Zone A: Silent Deep Work Sanctuary', 'Strictly silent individual study pods with noise isolation and acoustic dividers', 60, 48, 'silent', 'high', '2nd Floor'),
  ('zone-b', 'Zone B: Collaborative & Discussion Hub', 'Group work tables, whiteboards, dual-monitor desks and peer discussion area', 50, 22, 'discussion', 'low', '1st Floor'),
  ('zone-c', 'Zone C: Digital Media & Reading Lounge', 'Ergonomic armchairs, magazine racks, kindle docks and laptop power hubs', 40, 26, 'quiet', 'medium', 'Ground Floor')
on conflict (id) do nothing;

-- 6. EXAM SCHEDULE
insert into public.exam_schedule (id, department, subject, exam_date, start_time, end_time, student_count, expected_crowd_multiplier)
values
  ('exam-1', 'Computer Science & Engineering', 'Distributed Systems & Cloud Computing', current_date + interval '2 day', '09:30 AM', '12:30 PM', 140, 2.1),
  ('exam-2', 'Electronics & Communication', 'Digital Signal Processing', current_date + interval '3 day', '02:00 PM', '05:00 PM', 110, 1.8),
  ('exam-3', 'Mechanical Engineering', 'Thermodynamics & Heat Transfer', current_date + interval '5 day', '09:30 AM', '12:30 PM', 95, 1.6),
  ('exam-4', 'Business Administration', 'Corporate Financial Modeling', current_date + interval '6 day', '10:00 AM', '01:00 PM', 160, 2.3)
on conflict (id) do nothing;

-- 7. ADMIN SERVICES
insert into public.admin_services (id, name, description, category, required_documents, base_processing_minutes, is_active)
values
  ('serv-1', 'Bonafide Certificate', 'Official certificate confirming active student enrollment for passport, visa or bank accounts', 'Certificates', '["Student ID Card", "Fee Paid Challan / Receipt", "Application Form"]'::jsonb, 8, true),
  ('serv-2', 'Transfer Certificate (TC)', 'Formal transfer document and character conduct certificate upon course completion or migration', 'Certificates', '["No Dues Clearance Form", "Library Clearance Slip", "Original ID Card"]'::jsonb, 15, true),
  ('serv-3', 'Application Form Attestation', 'Academic verification and seal on scholarship forms, competitive exam applications', 'Attestation', '["Original Marksheets", "Government Photo ID", "Attestation Request Letter"]'::jsonb, 10, true),
  ('serv-4', 'General Student Query / Grievance', 'Assistance with name corrections, ID re-issuance, timetable clashes or portal access', 'Grievance', '["Student ID Card", "Brief Written Explanation"]'::jsonb, 12, true)
on conflict (id) do nothing;

-- 8. FEE RECORDS
insert into public.fee_records (id, user_id, user_name, semester, academic_year, tuition_fee, library_fee, exam_fee, lab_fee, total_due, due_date, status, receipt_number)
values
  ('fee-1', '11111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'Semester VI (Spring 2026)', '2025-2026', 45000.00, 2500.00, 3000.00, 4500.00, 55000.00, current_date + interval '12 day', 'unpaid', null)
on conflict (id) do nothing;
