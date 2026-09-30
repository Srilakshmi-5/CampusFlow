import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FoodCourt,
  MenuItem,
  PickupSlot,
  Order,
  LibraryZone,
  LibrarySeat,
  SeatReservation,
  AdminService,
  ServiceToken,
  FeeRecord,
  FeeToken,
  Notification,
  ExamSchedule,
  CrowdLevel,
} from '@/types';
import { generateOrderNumber } from '../intelligence/queue-engine';

// Initial Mock Datasets
const INITIAL_FOOD_COURTS: FoodCourt[] = [
  {
    id: 'fc-1',
    name: 'Central Dining Commons',
    location: 'Building A, Ground Floor',
    opening_time: '08:00 AM',
    closing_time: '09:30 PM',
    total_seats: 180,
    current_seats_occupied: 115,
    status: 'open',
    avg_wait_minutes: 14,
    crowd_level: 'medium',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fc-2',
    name: 'South Campus Food Hub',
    location: 'Student Union, 1st Floor',
    opening_time: '08:30 AM',
    closing_time: '08:00 PM',
    total_seats: 120,
    current_seats_occupied: 42,
    status: 'open',
    avg_wait_minutes: 6,
    crowd_level: 'low',
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    food_court_id: 'fc-1',
    category_id: 'cat-1',
    name: 'Executive North Indian Thali',
    description: '2 rotis, paneer butter masala, dal makhani, jeera rice, salad & gulab jamun',
    price: 120,
    prep_time_minutes: 15,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.8,
    quick_item: false,
  },
  {
    id: 'item-2',
    food_court_id: 'fc-1',
    category_id: 'cat-1',
    name: 'South Indian Mini Meal',
    description: 'Sambar rice, curd rice, poriyal, papad & lemon pickle',
    price: 85,
    prep_time_minutes: 7,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.6,
    quick_item: true,
  },
  {
    id: 'item-3',
    food_court_id: 'fc-1',
    category_id: 'cat-2',
    name: 'Crispy Paneer Burger',
    description: 'Spiced cottage cheese patty, cheddar slice, crunchy lettuce with peri-peri mayo',
    price: 95,
    prep_time_minutes: 10,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.9,
    quick_item: false,
  },
  {
    id: 'item-4',
    food_court_id: 'fc-1',
    category_id: 'cat-2',
    name: 'Schezwan Fried Rice & Manchurian',
    description: 'Wok-tossed spicy rice served with 4 vegetable manchurian balls',
    price: 110,
    prep_time_minutes: 12,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.7,
    quick_item: false,
  },
  {
    id: 'item-5',
    food_court_id: 'fc-1',
    category_id: 'cat-3',
    name: 'Cold Brew Coffee',
    description: 'Steeped for 18 hours, served chilled over ice with creamy milk float',
    price: 65,
    prep_time_minutes: 3,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.9,
    quick_item: true,
  },
  {
    id: 'item-6',
    food_court_id: 'fc-1',
    category_id: 'cat-3',
    name: 'Fresh Mango Smoothie',
    description: 'Blended Alphonso pulp with greek yogurt and chia seeds',
    price: 75,
    prep_time_minutes: 4,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.5,
    quick_item: true,
  },
  {
    id: 'item-7',
    food_court_id: 'fc-1',
    category_id: 'cat-4',
    name: 'Belgian Waffle with Molten Chocolate',
    description: 'Crispy warm waffle topped with molten dark chocolate and vanilla scoop',
    price: 90,
    prep_time_minutes: 8,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.8,
    quick_item: false,
  },
  {
    id: 'item-8',
    food_court_id: 'fc-2',
    category_id: 'cat-5',
    name: 'Grilled Veggie & Cheese Panini',
    description: 'Herb focaccia with zucchini, bell peppers, mozzarella and basil pesto',
    price: 85,
    prep_time_minutes: 5,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.7,
    quick_item: true,
  },
  {
    id: 'item-9',
    food_court_id: 'fc-2',
    category_id: 'cat-5',
    name: 'Chipotle Paneer Wrap',
    description: 'Whole wheat tortilla stuffed with smokey tandoori paneer and pickled onions',
    price: 90,
    prep_time_minutes: 6,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.6,
    quick_item: true,
  },
  {
    id: 'item-10',
    food_court_id: 'fc-2',
    category_id: 'cat-6',
    name: 'Iced Matcha Latte',
    description: 'Ceremonial grade matcha whisked with oat milk and honey drizzle',
    price: 80,
    prep_time_minutes: 3,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.8,
    quick_item: true,
  },
  {
    id: 'item-11',
    food_court_id: 'fc-2',
    category_id: 'cat-7',
    name: 'Mediterranean Quinoa Salad Bowl',
    description: 'Fluffy quinoa, kalamata olives, cherry tomatoes, cucumbers, feta and lemon dressing',
    price: 105,
    prep_time_minutes: 5,
    is_available: true,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    popularity_score: 4.5,
    quick_item: true,
  },
];

const INITIAL_PICKUP_SLOTS: PickupSlot[] = [
  { id: 'slot-1', food_court_id: 'fc-1', slot_time: '12:00 PM - 12:10 PM', max_capacity: 45, current_orders_count: 14, status: 'available' },
  { id: 'slot-2', food_court_id: 'fc-1', slot_time: '12:10 PM - 12:20 PM', max_capacity: 45, current_orders_count: 28, status: 'available' },
  { id: 'slot-3', food_court_id: 'fc-1', slot_time: '12:20 PM - 12:30 PM', max_capacity: 45, current_orders_count: 42, status: 'almost_full' },
  { id: 'slot-4', food_court_id: 'fc-1', slot_time: '12:30 PM - 12:40 PM', max_capacity: 45, current_orders_count: 44, status: 'almost_full' },
  { id: 'slot-5', food_court_id: 'fc-1', slot_time: '12:40 PM - 12:50 PM', max_capacity: 45, current_orders_count: 19, status: 'available' },
  { id: 'slot-6', food_court_id: 'fc-1', slot_time: '12:50 PM - 01:00 PM', max_capacity: 45, current_orders_count: 12, status: 'available' },
  { id: 'slot-7', food_court_id: 'fc-1', slot_time: '01:00 PM - 01:10 PM', max_capacity: 45, current_orders_count: 20, status: 'available' },
  { id: 'slot-8', food_court_id: 'fc-2', slot_time: '12:15 PM - 12:25 PM', max_capacity: 45, current_orders_count: 8, status: 'available' },
  { id: 'slot-9', food_court_id: 'fc-2', slot_time: '12:25 PM - 12:35 PM', max_capacity: 45, current_orders_count: 15, status: 'available' },
  { id: 'slot-10', food_court_id: 'fc-2', slot_time: '12:35 PM - 12:45 PM', max_capacity: 45, current_orders_count: 18, status: 'available' },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'CF-4081',
    user_id: '11111111-1111-1111-1111-111111111111',
    user_name: 'Aarav Sharma',
    food_court_id: 'fc-1',
    food_court_name: 'Central Dining Commons',
    pickup_slot_id: 'slot-2',
    pickup_slot_time: '12:10 PM - 12:20 PM',
    status: 'preparing',
    total_amount: 185,
    estimated_ready_time: new Date(Date.now() + 8 * 60000).toISOString(),
    qr_code_data: 'CF-4081-SECURE-PICKUP-VERIFY',
    counter_number: 'Counter 2',
    items: [
      { id: 'oi-1', order_id: 'ord-101', menu_item_id: 'item-3', item_name: 'Crispy Paneer Burger', quantity: 1, unit_price: 95, subtotal: 95 },
      { id: 'oi-2', order_id: 'ord-101', menu_item_id: 'item-7', item_name: 'Belgian Waffle with Molten Chocolate', quantity: 1, unit_price: 90, subtotal: 90 },
    ],
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'ord-102',
    order_number: 'CF-4082',
    user_id: 'user-demo-priya',
    user_name: 'Priya Iyer',
    food_court_id: 'fc-1',
    food_court_name: 'Central Dining Commons',
    pickup_slot_id: 'slot-2',
    pickup_slot_time: '12:10 PM - 12:20 PM',
    status: 'ready',
    total_amount: 85,
    estimated_ready_time: new Date(Date.now() - 2 * 60000).toISOString(),
    actual_ready_time: new Date(Date.now() - 2 * 60000).toISOString(),
    qr_code_data: 'CF-4082-SECURE-PICKUP-VERIFY',
    counter_number: 'Counter 1',
    items: [
      { id: 'oi-3', order_id: 'ord-102', menu_item_id: 'item-2', item_name: 'South Indian Mini Meal', quantity: 1, unit_price: 85, subtotal: 85 },
    ],
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'ord-103',
    order_number: 'CF-4083',
    user_id: 'user-demo-rohan',
    user_name: 'Rohan Deshmukh',
    food_court_id: 'fc-1',
    food_court_name: 'Central Dining Commons',
    pickup_slot_id: 'slot-3',
    pickup_slot_time: '12:20 PM - 12:30 PM',
    status: 'placed',
    total_amount: 175,
    estimated_ready_time: new Date(Date.now() + 15 * 60000).toISOString(),
    qr_code_data: 'CF-4083-SECURE-PICKUP-VERIFY',
    counter_number: 'Counter 3',
    items: [
      { id: 'oi-4', order_id: 'ord-103', menu_item_id: 'item-5', item_name: 'Cold Brew Coffee', quantity: 1, unit_price: 65, subtotal: 65 },
      { id: 'oi-5', order_id: 'ord-103', menu_item_id: 'item-4', item_name: 'Schezwan Fried Rice & Manchurian', quantity: 1, unit_price: 110, subtotal: 110 },
    ],
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
];

const INITIAL_LIBRARY_ZONES: LibraryZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A: Silent Deep Work Sanctuary',
    description: 'Strictly silent individual study pods with noise isolation and acoustic dividers',
    total_seats: 60,
    occupied_seats: 48,
    noise_level: 'silent',
    crowd_level: 'high',
    floor: '2nd Floor',
  },
  {
    id: 'zone-b',
    name: 'Zone B: Collaborative & Discussion Hub',
    description: 'Group work tables, whiteboards, dual-monitor desks and peer discussion area',
    total_seats: 50,
    occupied_seats: 22,
    noise_level: 'discussion',
    crowd_level: 'low',
    floor: '1st Floor',
  },
  {
    id: 'zone-c',
    name: 'Zone C: Digital Media & Reading Lounge',
    description: 'Ergonomic armchairs, magazine racks, kindle docks and laptop power hubs',
    total_seats: 40,
    occupied_seats: 26,
    noise_level: 'quiet',
    crowd_level: 'medium',
    floor: 'Ground Floor',
  },
];

const generateInitialSeats = (): LibrarySeat[] => {
  const seats: LibrarySeat[] = [];
  // Zone A seats 1 to 24
  for (let i = 1; i <= 24; i++) {
    const isOccupied = i % 4 !== 0; // 75% occupied
    seats.push({
      id: `seat-a-${i}`,
      zone_id: 'zone-a',
      seat_number: `A-${i < 10 ? '0' + i : i}`,
      has_power_outlet: i % 2 === 1,
      is_occupied: isOccupied,
      reserved_by: isOccupied ? 'demo-student' : undefined,
    });
  }
  // Zone B seats 1 to 20
  for (let i = 1; i <= 20; i++) {
    const isOccupied = i % 3 === 0; // ~33% occupied
    seats.push({
      id: `seat-b-${i}`,
      zone_id: 'zone-b',
      seat_number: `B-${i < 10 ? '0' + i : i}`,
      has_power_outlet: true,
      is_occupied: isOccupied,
      reserved_by: isOccupied ? 'demo-student' : undefined,
    });
  }
  // Zone C seats 1 to 16
  for (let i = 1; i <= 16; i++) {
    const isOccupied = i % 2 === 0; // 50% occupied
    seats.push({
      id: `seat-c-${i}`,
      zone_id: 'zone-c',
      seat_number: `C-${i < 10 ? '0' + i : i}`,
      has_power_outlet: i % 3 !== 0,
      is_occupied: isOccupied,
      reserved_by: isOccupied ? 'demo-student' : undefined,
    });
  }
  return seats;
};

const INITIAL_RESERVATIONS: SeatReservation[] = [
  {
    id: 'res-1',
    user_id: '11111111-1111-1111-1111-111111111111',
    user_name: 'Aarav Sharma',
    seat_id: 'seat-a-04',
    seat_number: 'A-04',
    zone_id: 'zone-a',
    zone_name: 'Zone A: Silent Sanctuary',
    slot_date: new Date().toISOString().split('T')[0],
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_EXAM_SCHEDULE: ExamSchedule[] = [
  {
    id: 'exam-1',
    department: 'Computer Science & Engineering',
    subject: 'Distributed Systems & Cloud Computing',
    exam_date: '2026-10-03',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    student_count: 140,
    expected_crowd_multiplier: 2.1,
  },
  {
    id: 'exam-2',
    department: 'Electronics & Communication',
    subject: 'Digital Signal Processing',
    exam_date: '2026-10-04',
    start_time: '02:00 PM',
    end_time: '05:00 PM',
    student_count: 110,
    expected_crowd_multiplier: 1.8,
  },
  {
    id: 'exam-3',
    department: 'Mechanical Engineering',
    subject: 'Thermodynamics & Heat Transfer',
    exam_date: '2026-10-06',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    student_count: 95,
    expected_crowd_multiplier: 1.6,
  },
  {
    id: 'exam-4',
    department: 'Business Administration',
    subject: 'Corporate Financial Modeling',
    exam_date: '2026-10-07',
    start_time: '10:00 AM',
    end_time: '01:00 PM',
    student_count: 160,
    expected_crowd_multiplier: 2.3,
  },
];

const INITIAL_ADMIN_SERVICES: AdminService[] = [
  {
    id: 'serv-1',
    name: 'Bonafide Certificate',
    description: 'Official certificate confirming active student enrollment for passport, visa or bank accounts',
    category: 'Certificates',
    required_documents: ['Student ID Card', 'Fee Paid Challan / Receipt', 'Application Form'],
    base_processing_minutes: 8,
    is_active: true,
  },
  {
    id: 'serv-2',
    name: 'Transfer Certificate (TC)',
    description: 'Formal transfer document and character conduct certificate upon course completion or migration',
    category: 'Certificates',
    required_documents: ['No Dues Clearance Form', 'Library Clearance Slip', 'Original ID Card'],
    base_processing_minutes: 15,
    is_active: true,
  },
  {
    id: 'serv-3',
    name: 'Application Form Attestation',
    description: 'Academic verification and seal on scholarship forms, competitive exam applications',
    category: 'Attestation',
    required_documents: ['Original Marksheets', 'Government Photo ID', 'Attestation Request Letter'],
    base_processing_minutes: 10,
    is_active: true,
  },
  {
    id: 'serv-4',
    name: 'General Student Query / Grievance',
    description: 'Assistance with name corrections, ID re-issuance, timetable clashes or portal access',
    category: 'Grievance',
    required_documents: ['Student ID Card', 'Brief Written Explanation'],
    base_processing_minutes: 12,
    is_active: true,
  },
];

const INITIAL_SERVICE_TOKENS: ServiceToken[] = [
  {
    id: 'tok-101',
    token_number: 'A-101',
    user_id: 'user-demo-tanvi',
    user_name: 'Tanvi Roy',
    service_id: 'serv-1',
    service_name: 'Bonafide Certificate',
    status: 'serving',
    counter_number: 'Counter 1',
    estimated_wait_minutes: 0,
    uploaded_documents: [
      { name: 'Student ID Card', fileName: 'id_card.pdf', sizeBytes: 102400, uploadedAt: new Date().toISOString(), status: 'valid' },
      { name: 'Fee Paid Challan / Receipt', fileName: 'challan.pdf', sizeBytes: 154000, uploadedAt: new Date().toISOString(), status: 'valid' },
      { name: 'Application Form', fileName: 'form.pdf', sizeBytes: 88000, uploadedAt: new Date().toISOString(), status: 'valid' },
    ],
    precheck_status: 'complete',
    precheck_notes: 'All documents verified by rule-checker',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'tok-102',
    token_number: 'A-102',
    user_id: '11111111-1111-1111-1111-111111111111',
    user_name: 'Aarav Sharma',
    service_id: 'serv-1',
    service_name: 'Bonafide Certificate',
    status: 'waiting',
    counter_number: 'Counter 1',
    estimated_wait_minutes: 6,
    uploaded_documents: [
      { name: 'Student ID Card', fileName: 'aarav_id.pdf', sizeBytes: 120000, uploadedAt: new Date().toISOString(), status: 'valid' },
      { name: 'Fee Paid Challan / Receipt', fileName: 'receipt_fee.pdf', sizeBytes: 98000, uploadedAt: new Date().toISOString(), status: 'valid' },
      { name: 'Application Form', fileName: 'application.pdf', sizeBytes: 110000, uploadedAt: new Date().toISOString(), status: 'valid' },
    ],
    precheck_status: 'complete',
    precheck_notes: 'Documents verified and validated',
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'tok-103',
    token_number: 'A-103',
    user_id: 'user-demo-vikas',
    user_name: 'Vikas Nambiar',
    service_id: 'serv-3',
    service_name: 'Application Form Attestation',
    status: 'waiting',
    counter_number: 'Counter 2',
    estimated_wait_minutes: 14,
    uploaded_documents: [
      { name: 'Original Marksheets', fileName: 'marksheet.pdf', sizeBytes: 145000, uploadedAt: new Date().toISOString(), status: 'valid' },
    ],
    precheck_status: 'missing_docs',
    precheck_notes: 'Missing Government Photo ID and Attestation Letter',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
];

const INITIAL_FEE_RECORDS: FeeRecord[] = [
  {
    id: 'fee-1',
    user_id: '11111111-1111-1111-1111-111111111111',
    user_name: 'Aarav Sharma',
    semester: 'Semester VI (Spring 2026)',
    academic_year: '2025-2026',
    tuition_fee: 45000,
    library_fee: 2500,
    exam_fee: 3000,
    lab_fee: 4500,
    total_due: 55000,
    due_date: '2026-10-15',
    status: 'unpaid',
  },
];

const INITIAL_FEE_TOKENS: FeeToken[] = [
  {
    id: 'ft-201',
    token_number: 'F-201',
    user_id: 'user-demo-sneha',
    user_name: 'Sneha Patil',
    status: 'serving',
    counter_number: 'Fee Desk 1',
    estimated_wait_minutes: 0,
    purpose: 'Scholarship Fee Adjustment',
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: 'ft-202',
    token_number: 'F-202',
    user_id: '11111111-1111-1111-1111-111111111111',
    user_name: 'Aarav Sharma',
    status: 'waiting',
    counter_number: 'Fee Desk 1',
    estimated_wait_minutes: 7,
    purpose: 'Challan Cash Deposit & Receipt',
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: '11111111-1111-1111-1111-111111111111',
    title: 'Order Status Update',
    message: 'Your order #CF-4081 is now PREPARING at Central Dining Commons.',
    type: 'order',
    read: false,
    created_at: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: '11111111-1111-1111-1111-111111111111',
    title: 'Admin Token Queued',
    message: 'Token A-102 generated for Bonafide Certificate. Estimated wait: 6 mins.',
    type: 'admin',
    read: true,
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
];

interface CampusState {
  foodCourts: FoodCourt[];
  menuItems: MenuItem[];
  pickupSlots: PickupSlot[];
  orders: Order[];
  libraryZones: LibraryZone[];
  librarySeats: LibrarySeat[];
  reservations: SeatReservation[];
  examSchedule: ExamSchedule[];
  adminServices: AdminService[];
  serviceTokens: ServiceToken[];
  feeRecords: FeeRecord[];
  feeTokens: FeeToken[];
  notifications: Notification[];

  // Simulation parameters
  isPeakRushSimulated: boolean;
  isExamSpikeSimulated: boolean;

  // Actions: Canteen
  updateFoodCourtOccupancy: (id: string, occupied: number, crowd: CrowdLevel, waitMinutes: number) => void;
  toggleMenuItemAvailability: (id: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], counterNumber?: string) => void;

  // Actions: Library
  toggleSeatOccupancy: (seatId: string) => void;
  reserveSeat: (seatId: string, userId: string, userName: string, startTime: string, endTime: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  updateZoneOccupancy: (zoneId: string, occupied: number) => void;

  // Actions: Admin Services
  createServiceToken: (
    serviceId: string,
    userId: string,
    userName: string,
    docs: ServiceToken['uploaded_documents'],
    precheckStatus: ServiceToken['precheck_status'],
    notes?: string
  ) => ServiceToken;
  advanceServiceToken: (tokenId: string, nextStatus: ServiceToken['status'], counterNumber?: string) => void;

  // Actions: Fees
  payFeeRecord: (recordId: string, method: string) => void;
  createFeeToken: (userId: string, userName: string, purpose: string) => FeeToken;
  advanceFeeToken: (tokenId: string, nextStatus: FeeToken['status']) => void;

  // Actions: Simulation & Notifications
  toggleRushSimulation: () => void;
  toggleExamSpikeSimulation: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type']) => void;
  resetToDefaults: () => void;
}

export const useCampusStore = create<CampusState>()(
  persist(
    (set, get) => ({
      foodCourts: INITIAL_FOOD_COURTS,
      menuItems: INITIAL_MENU_ITEMS,
      pickupSlots: INITIAL_PICKUP_SLOTS,
      orders: INITIAL_ORDERS,
      libraryZones: INITIAL_LIBRARY_ZONES,
      librarySeats: generateInitialSeats(),
      reservations: INITIAL_RESERVATIONS,
      examSchedule: INITIAL_EXAM_SCHEDULE,
      adminServices: INITIAL_ADMIN_SERVICES,
      serviceTokens: INITIAL_SERVICE_TOKENS,
      feeRecords: INITIAL_FEE_RECORDS,
      feeTokens: INITIAL_FEE_TOKENS,
      notifications: INITIAL_NOTIFICATIONS,
      isPeakRushSimulated: false,
      isExamSpikeSimulated: false,

      // Canteen Actions
      updateFoodCourtOccupancy: (id, occupied, crowd, waitMinutes) => {
        set({
          foodCourts: get().foodCourts.map((fc) =>
            fc.id === id
              ? {
                  ...fc,
                  current_seats_occupied: occupied,
                  crowd_level: crowd,
                  avg_wait_minutes: waitMinutes,
                  updated_at: new Date().toISOString(),
                }
              : fc
          ),
        });
      },

      toggleMenuItemAvailability: (id) => {
        set({
          menuItems: get().menuItems.map((item) =>
            item.id === id ? { ...item, is_available: !item.is_available } : item
          ),
        });
      },

      createOrder: (orderData) => {
        const newOrderNumber = generateOrderNumber();
        const newId = `ord-${Date.now()}`;
        const newOrder: Order = {
          ...orderData,
          id: newId,
          order_number: newOrderNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Increment slot order count
        const updatedSlots = get().pickupSlots.map((slot) => {
          if (slot.id === orderData.pickup_slot_id) {
            const nextCount = slot.current_orders_count + 1;
            return {
              ...slot,
              current_orders_count: nextCount,
              status: nextCount >= slot.max_capacity ? ('full' as const) : nextCount >= 38 ? ('almost_full' as const) : ('available' as const),
            };
          }
          return slot;
        });

        set({
          orders: [newOrder, ...get().orders],
          pickupSlots: updatedSlots,
        });

        get().addNotification(
          orderData.user_id,
          'Order Placed Successfully',
          `Order ${newOrderNumber} confirmed for slot ${orderData.pickup_slot_time}.`,
          'order'
        );

        return newOrder;
      },

      updateOrderStatus: (orderId, status, counterNumber) => {
        const order = get().orders.find((o) => o.id === orderId);
        const updatedOrders = get().orders.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              counter_number: counterNumber || o.counter_number,
              actual_ready_time: status === 'ready' ? new Date().toISOString() : o.actual_ready_time,
              updated_at: new Date().toISOString(),
            };
          }
          return o;
        });

        set({ orders: updatedOrders });

        if (order) {
          const statusMessages: Record<string, string> = {
            preparing: `Order ${order.order_number} is now being prepared in the kitchen.`,
            ready: `Order ${order.order_number} is READY! Please pick it up at ${counterNumber || order.counter_number}.`,
            picked_up: `Order ${order.order_number} was marked as picked up. Thank you!`,
            cancelled: `Order ${order.order_number} has been cancelled.`,
          };

          get().addNotification(
            order.user_id,
            `Order Status: ${status.toUpperCase()}`,
            statusMessages[status] || `Order ${order.order_number} updated to ${status}.`,
            'order'
          );
        }
      },

      // Library Actions
      toggleSeatOccupancy: (seatId) => {
        const seats = get().librarySeats;
        const targetSeat = seats.find((s) => s.id === seatId);
        if (!targetSeat) return;

        const newOccupiedState = !targetSeat.is_occupied;
        const updatedSeats = seats.map((s) =>
          s.id === seatId
            ? {
                ...s,
                is_occupied: newOccupiedState,
                reserved_by: newOccupiedState ? 'walk-in' : undefined,
              }
            : s
        );

        // Recalculate zone occupied count
        const zoneSeats = updatedSeats.filter((s) => s.zone_id === targetSeat.zone_id);
        const occupiedInZone = zoneSeats.filter((s) => s.is_occupied).length;

        const updatedZones = get().libraryZones.map((z) => {
          if (z.id === targetSeat.zone_id) {
            const occupancyRate = (occupiedInZone / z.total_seats) * 100;
            return {
              ...z,
              occupied_seats: occupiedInZone,
              crowd_level: (occupancyRate < 50 ? 'low' : occupancyRate <= 80 ? 'medium' : 'high') as CrowdLevel,
            };
          }
          return z;
        });

        set({ librarySeats: updatedSeats, libraryZones: updatedZones });
      },

      reserveSeat: (seatId, userId, userName, startTime, endTime) => {
        const seat = get().librarySeats.find((s) => s.id === seatId);
        if (!seat || seat.is_occupied) return false;

        const zone = get().libraryZones.find((z) => z.id === seat.zone_id);
        const newReservation: SeatReservation = {
          id: `res-${Date.now()}`,
          user_id: userId,
          user_name: userName,
          seat_id: seatId,
          seat_number: seat.seat_number,
          zone_id: seat.zone_id,
          zone_name: zone?.name || 'Library Zone',
          slot_date: new Date().toISOString().split('T')[0],
          start_time: startTime,
          end_time: endTime,
          status: 'active',
          created_at: new Date().toISOString(),
        };

        const updatedSeats = get().librarySeats.map((s) =>
          s.id === seatId
            ? { ...s, is_occupied: true, reserved_by: userId }
            : s
        );

        set({
          reservations: [newReservation, ...get().reservations],
          librarySeats: updatedSeats,
        });

        get().addNotification(
          userId,
          'Seat Reserved Successfully',
          `Seat ${seat.seat_number} in ${zone?.name} reserved from ${startTime} to ${endTime}.`,
          'library'
        );

        return true;
      },

      cancelReservation: (resId) => {
        const res = get().reservations.find((r) => r.id === resId);
        if (!res) return;

        const updatedReservations = get().reservations.map((r) =>
          r.id === resId ? { ...r, status: 'cancelled' as const } : r
        );

        const updatedSeats = get().librarySeats.map((s) =>
          s.id === res.seat_id ? { ...s, is_occupied: false, reserved_by: undefined } : s
        );

        set({
          reservations: updatedReservations,
          librarySeats: updatedSeats,
        });

        get().addNotification(
          res.user_id,
          'Reservation Cancelled',
          `Your reservation for seat ${res.seat_number} was cancelled.`,
          'library'
        );
      },

      updateZoneOccupancy: (zoneId, occupied) => {
        set({
          libraryZones: get().libraryZones.map((z) =>
            z.id === zoneId
              ? {
                  ...z,
                  occupied_seats: occupied,
                  crowd_level: (occupied / z.total_seats < 0.5 ? 'low' : occupied / z.total_seats <= 0.8 ? 'medium' : 'high') as CrowdLevel,
                }
              : z
          ),
        });
      },

      // Admin Services Actions
      createServiceToken: (serviceId, userId, userName, docs, precheckStatus, notes) => {
        const service = get().adminServices.find((s) => s.id === serviceId);
        const waitingCount = get().serviceTokens.filter((t) => t.status === 'waiting').length;
        const tokenNumber = `A-${101 + get().serviceTokens.length}`;
        const estimatedWait = Math.max(5, (waitingCount + 1) * (service?.base_processing_minutes || 8) / 2);

        const newToken: ServiceToken = {
          id: `tok-${Date.now()}`,
          token_number: tokenNumber,
          user_id: userId,
          user_name: userName,
          service_id: serviceId,
          service_name: service?.name || 'Admin Service',
          status: 'waiting',
          counter_number: 'Counter 1',
          estimated_wait_minutes: Math.round(estimatedWait),
          uploaded_documents: docs,
          precheck_status: precheckStatus,
          precheck_notes: notes,
          created_at: new Date().toISOString(),
        };

        set({ serviceTokens: [...get().serviceTokens, newToken] });

        get().addNotification(
          userId,
          'Admin Token Issued',
          `Token ${tokenNumber} issued for ${service?.name}. Document Pre-check: ${precheckStatus.toUpperCase()}.`,
          'admin'
        );

        return newToken;
      },

      advanceServiceToken: (tokenId, nextStatus, counterNumber) => {
        const token = get().serviceTokens.find((t) => t.id === tokenId);
        const updatedTokens = get().serviceTokens.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              status: nextStatus,
              counter_number: counterNumber || t.counter_number,
              completed_at: nextStatus === 'completed' ? new Date().toISOString() : t.completed_at,
            };
          }
          return t;
        });

        set({ serviceTokens: updatedTokens });

        if (token) {
          const msg =
            nextStatus === 'serving'
              ? `Your token ${token.token_number} is NOW BEING SERVED at ${counterNumber || 'Counter 1'}!`
              : `Token ${token.token_number} has been completed.`;

          get().addNotification(token.user_id, `Token ${token.token_number} Update`, msg, 'admin');
        }
      },

      // Fees Actions
      payFeeRecord: (recordId, method) => {
        const record = get().feeRecords.find((r) => r.id === recordId);
        if (!record) return;

        const receiptNo = `REC-CF-${Date.now().toString().slice(-6)}`;
        const updated = get().feeRecords.map((r) =>
          r.id === recordId
            ? {
                ...r,
                status: 'paid' as const,
                paid_at: new Date().toISOString(),
                receipt_number: receiptNo,
                payment_method: method,
              }
            : r
        );

        set({ feeRecords: updated });

        get().addNotification(
          record.user_id,
          'Payment Successful! Receipt Generated',
          `Fee payment of ₹${record.total_due.toLocaleString()} confirmed. Receipt #${receiptNo}.`,
          'fee'
        );
      },

      createFeeToken: (userId, userName, purpose) => {
        const waitingCount = get().feeTokens.filter((t) => t.status === 'waiting').length;
        const tokenNumber = `F-${201 + get().feeTokens.length}`;
        const waitMinutes = (waitingCount + 1) * 6;

        const newToken: FeeToken = {
          id: `ft-${Date.now()}`,
          token_number: tokenNumber,
          user_id: userId,
          user_name: userName,
          status: 'waiting',
          counter_number: 'Fee Desk 1',
          estimated_wait_minutes: waitMinutes,
          purpose,
          created_at: new Date().toISOString(),
        };

        set({ feeTokens: [...get().feeTokens, newToken] });

        get().addNotification(
          userId,
          'Physical Counter Token Issued',
          `Token ${tokenNumber} issued for Fee Desk. Estimated wait: ${waitMinutes} mins.`,
          'fee'
        );

        return newToken;
      },

      advanceFeeToken: (tokenId, nextStatus) => {
        const token = get().feeTokens.find((t) => t.id === tokenId);
        const updated = get().feeTokens.map((t) =>
          t.id === tokenId
            ? {
                ...t,
                status: nextStatus,
                completed_at: nextStatus === 'completed' ? new Date().toISOString() : t.completed_at,
              }
            : t
        );

        set({ feeTokens: updated });

        if (token) {
          const msg =
            nextStatus === 'serving'
              ? `Token ${token.token_number} is NOW BEING SERVED at ${token.counter_number || 'Fee Desk 1'}!`
              : `Token ${token.token_number} has been resolved.`;

          get().addNotification(token.user_id, `Fee Desk Call`, msg, 'fee');
        }
      },

      // Simulation & Notifications
      toggleRushSimulation: () => {
        const nextState = !get().isPeakRushSimulated;
        set({
          isPeakRushSimulated: nextState,
          foodCourts: get().foodCourts.map((fc) =>
            fc.id === 'fc-1'
              ? {
                  ...fc,
                  current_seats_occupied: nextState ? 172 : 115,
                  crowd_level: nextState ? 'high' : 'medium',
                  avg_wait_minutes: nextState ? 24 : 14,
                }
              : {
                  ...fc,
                  current_seats_occupied: nextState ? 98 : 42,
                  crowd_level: nextState ? 'medium' : 'low',
                  avg_wait_minutes: nextState ? 14 : 6,
                }
          ),
        });
      },

      toggleExamSpikeSimulation: () => {
        const nextState = !get().isExamSpikeSimulated;
        set({
          isExamSpikeSimulated: nextState,
          libraryZones: get().libraryZones.map((z) => ({
            ...z,
            occupied_seats: nextState ? Math.min(z.total_seats, Math.round(z.occupied_seats * 1.5)) : Math.round(z.total_seats * 0.45),
            crowd_level: nextState ? 'high' : 'medium',
          })),
        });
      },

      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },

      addNotification: (userId, title, message, type) => {
        const newNotif: Notification = {
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          user_id: userId,
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString(),
        };
        set({ notifications: [newNotif, ...get().notifications] });
      },

      resetToDefaults: () => {
        set({
          foodCourts: INITIAL_FOOD_COURTS,
          menuItems: INITIAL_MENU_ITEMS,
          pickupSlots: INITIAL_PICKUP_SLOTS,
          orders: INITIAL_ORDERS,
          libraryZones: INITIAL_LIBRARY_ZONES,
          librarySeats: generateInitialSeats(),
          reservations: INITIAL_RESERVATIONS,
          examSchedule: INITIAL_EXAM_SCHEDULE,
          adminServices: INITIAL_ADMIN_SERVICES,
          serviceTokens: INITIAL_SERVICE_TOKENS,
          feeRecords: INITIAL_FEE_RECORDS,
          feeTokens: INITIAL_FEE_TOKENS,
          notifications: INITIAL_NOTIFICATIONS,
          isPeakRushSimulated: false,
          isExamSpikeSimulated: false,
        });
      },
    }),
    {
      name: 'campusflow-main-storage',
    }
  )
);
