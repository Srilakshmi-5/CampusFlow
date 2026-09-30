export type UserRole =
  | 'student'
  | 'kitchen_staff'
  | 'librarian'
  | 'admin_staff'
  | 'fees_staff'
  | 'super_admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  student_id?: string;
  department?: string;
  phone?: string;
  created_at: string;
}

export type CrowdLevel = 'low' | 'medium' | 'high';
export type FacilityStatus = 'open' | 'closed' | 'busy';

export interface FoodCourt {
  id: string;
  name: string;
  location: string;
  opening_time: string;
  closing_time: string;
  total_seats: number;
  current_seats_occupied: number;
  status: FacilityStatus;
  avg_wait_minutes: number;
  crowd_level: CrowdLevel;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  food_court_id: string;
  name: string;
  display_order: number;
}

export interface MenuItem {
  id: string;
  food_court_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  prep_time_minutes: number;
  is_available: boolean;
  is_veg: boolean;
  image_url: string;
  popularity_score: number;
  quick_item: boolean;
}

export interface PickupSlot {
  id: string;
  food_court_id: string;
  slot_time: string;
  max_capacity: number;
  current_orders_count: number;
  status: 'available' | 'almost_full' | 'full';
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user_name: string;
  food_court_id: string;
  food_court_name?: string;
  pickup_slot_id: string;
  pickup_slot_time: string;
  status: OrderStatus;
  total_amount: number;
  estimated_ready_time: string;
  actual_ready_time?: string;
  qr_code_data: string;
  counter_number: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface LibraryZone {
  id: string;
  name: string;
  description: string;
  total_seats: number;
  occupied_seats: number;
  noise_level: 'silent' | 'quiet' | 'discussion';
  crowd_level: CrowdLevel;
  floor: string;
}

export interface LibrarySeat {
  id: string;
  zone_id: string;
  seat_number: string;
  has_power_outlet: boolean;
  is_occupied: boolean;
  reserved_by?: string;
  reservation_until?: string;
}

export interface SeatReservation {
  id: string;
  user_id: string;
  user_name: string;
  seat_id: string;
  seat_number: string;
  zone_id: string;
  zone_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: 'active' | 'completed' | 'cancelled' | 'no_show';
  created_at: string;
}

export interface ExamSchedule {
  id: string;
  department: string;
  subject: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  student_count: number;
  expected_crowd_multiplier: number;
}

export interface AdminService {
  id: string;
  name: string;
  description: string;
  category: string;
  required_documents: string[];
  base_processing_minutes: number;
  is_active: boolean;
}

export type TokenStatus = 'waiting' | 'serving' | 'completed' | 'cancelled';
export type PrecheckStatus = 'pending' | 'complete' | 'missing_docs';

export interface UploadedDocument {
  name: string;
  fileName: string;
  sizeBytes: number;
  uploadedAt: string;
  status: 'valid' | 'invalid' | 'missing';
  error?: string;
}

export interface ServiceToken {
  id: string;
  token_number: string;
  user_id: string;
  user_name: string;
  service_id: string;
  service_name: string;
  status: TokenStatus;
  counter_number?: string;
  estimated_wait_minutes: number;
  uploaded_documents: UploadedDocument[];
  precheck_status: PrecheckStatus;
  precheck_notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface FeeRecord {
  id: string;
  user_id: string;
  user_name: string;
  semester: string;
  academic_year: string;
  tuition_fee: number;
  library_fee: number;
  exam_fee: number;
  lab_fee: number;
  total_due: number;
  due_date: string;
  status: 'unpaid' | 'partially_paid' | 'paid';
  paid_at?: string;
  receipt_number?: string;
  payment_method?: string;
}

export interface FeeToken {
  id: string;
  token_number: string;
  user_id: string;
  user_name: string;
  status: TokenStatus;
  counter_number?: string;
  estimated_wait_minutes: number;
  purpose: string;
  created_at: string;
  completed_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'library' | 'admin' | 'fee' | 'system';
  read: boolean;
  created_at: string;
}

export interface ClassTimeAnalysisResult {
  verdict: 'SAFE' | 'TIGHT' | 'NOT SAFE';
  totalTimeMinutes: number;
  availableMinutes: number;
  marginMinutes: number;
  breakdown: {
    prepTime: number;
    pickupQueueWait: number;
    diningTime: number;
    walkingTime: number;
  };
  recommendation: string;
  quickAction?: {
    type: 'QUICK_MEAL' | 'CHANGE_SLOT' | 'ORDER_AHEAD';
    label: string;
  };
}
