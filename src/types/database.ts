export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  whatsapp: string
  address: string
  state: string
  city: string
  avatar_url: string
  role: "customer" | "admin" | "super_admin" | "technician"
  created_at: string
  updated_at: string
}

export interface Setting {
  id: string
  key: string
  value: Record<string, unknown>
  category: string
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  category_id: string | null
  title: string
  slug: string
  description: string
  short_description: string
  image_url: string
  hero_image_url: string
  benefits: string[]
  includes: string[]
  equipment: string[]
  process_steps: { step: string; description: string }[]
  estimated_duration: string
  pricing_type: "fixed" | "starting" | "range" | "request_quote"
  starting_price: number
  price_range_min: number
  price_range_max: number
  meta_title: string
  meta_description: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  category?: ServiceCategory
  service_faqs?: ServiceFAQ[]
  service_gallery?: ServiceGallery[]
}

export interface ServiceFAQ {
  id: string
  service_id: string
  question: string
  answer: string
  display_order: number
  is_active: boolean
}

export interface ServiceGallery {
  id: string
  service_id: string
  image_url: string
  caption: string
  display_order: number
}

export interface Technician {
  id: string
  user_id: string | null
  name: string
  phone: string
  email: string
  specialization: string
  profile_photo: string
  availability: "available" | "busy" | "unavailable"
  status: "active" | "inactive"
  bio: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  booking_number: string
  customer_id: string | null
  service_id: string | null
  status: "pending" | "confirmed" | "assigned" | "in_progress" | "completed" | "cancelled" | "rescheduled"
  service_name: string
  service_type: string
  full_name: string
  email: string
  phone: string
  whatsapp: string
  state: string
  city: string
  address: string
  description: string
  project_details: Record<string, unknown>
  preferred_date: string | null
  preferred_time: string
  appointment_date: string | null
  appointment_time: string
  assigned_technician_id: string | null
  admin_notes: string
  internal_notes: string
  estimated_cost: number
  final_cost: number
  payment_status: "unpaid" | "partial" | "paid" | "refunded"
  created_at: string
  updated_at: string
  service?: Service
  technician?: Technician
  customer?: Profile
  booking_uploads?: BookingUpload[]
}

export interface BookingUpload {
  id: string
  booking_id: string
  file_url: string
  file_name: string
  file_type: string
  file_size: number
  uploaded_by: string | null
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  location: string
  service_id: string | null
  service_type: string
  client_name: string
  is_published: boolean
  is_featured: boolean
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
  service?: Service
  project_images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  caption: string
  image_type: "standard" | "before" | "after"
  display_order: number
}

export interface Review {
  id: string
  customer_id: string | null
  booking_id: string | null
  service_id: string | null
  name: string
  rating: number
  review: string
  image_url: string
  service_used: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Quote {
  id: string
  quote_number: string
  customer_id: string | null
  service_id: string | null
  service_name: string
  full_name: string
  email: string
  phone: string
  state: string
  city: string
  address: string
  description: string
  budget: string
  preferred_date: string | null
  status: "pending" | "reviewing" | "quoted" | "accepted" | "rejected" | "expired"
  quote_amount: number
  quote_description: string
  quote_items: { description: string; amount: number }[]
  estimated_duration: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface QuoteUpload {
  id: string
  quote_id: string
  file_url: string
  file_name: string
  file_type: string
  file_size: number
  created_at: string
}

export interface Payment {
  id: string
  booking_id: string | null
  quote_id: string | null
  invoice_id: string | null
  customer_id: string | null
  amount: number
  currency: string
  status: "pending" | "success" | "failed" | "refunded"
  payment_method: string
  transaction_reference: string
  paystack_reference: string
  metadata: Record<string, unknown>
  paid_at: string | null
  created_at: string
  updated_at: string
  booking?: Booking
  customer?: Profile
}

export interface Invoice {
  id: string
  invoice_number: string
  booking_id: string | null
  quote_id: string | null
  customer_id: string | null
  items: { description: string; amount: number }[]
  subtotal: number
  tax: number
  total: number
  status: "unpaid" | "paid" | "overdue" | "cancelled"
  due_date: string | null
  notes: string
  created_at: string
  updated_at: string
  customer?: Profile
  booking?: Booking
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  is_active: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  author_id: string | null
  category_id: string | null
  tags: string[]
  meta_title: string
  meta_description: string
  seo_keywords: string
  status: "draft" | "published" | "archived"
  published_at: string | null
  created_at: string
  updated_at: string
  category?: BlogCategory
  author?: Profile
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  service_type: string
  status: "unread" | "read" | "replied" | "archived"
  admin_notes: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link: string
  is_read: boolean
  created_at: string
}

export interface SiteSettings {
  business_name: string
  business_description: string
  logo_url: string
  favicon_url: string
  phone: string
  whatsapp: string
  email: string
  address: string
  working_hours: string
  state: string
  city: string
  service_areas: string[]
  social_links: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
  }
  hero_headline: string
  hero_subheadline: string
  hero_cta_text: string
  hero_cta_secondary: string
  about_text: string
  meta_title: string
  meta_description: string
  og_image: string
  stats: {
    customers_served: number
    projects_completed: number
    states_covered: number
    years_experience: number
    satisfaction_rate: number
  }
}
