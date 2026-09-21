export interface User {
  id: number;
  username: string;
  role: string;
  full_name: string;
  status?: string;
  last_active?: string;
}

export interface AuthResponse extends User {
  token: string;
}

export interface LoginCredentials {
  username?: string;
  password?: string;
}

export interface DashboardStats {
  total_documents: number;
  processed_documents: number;
  documents_waiting: number;
  information_found: number;
  differences_found: number;
  differences_resolved: number;
  reports_created: number;
  ai_questions: number;
  production_trend?: any[];
  target_vs_actual?: any[];
  recent_activity?: any[];
}

export interface Document {
  id: number;
  doc_id: string;
  name: string;
  doc_type: string;
  year: number;
  subsidiary: string;
  mine: string;
  department?: string;
  upload_date: string;
  uploaded_by: string;
  status: string;
  reading_accuracy?: number;
  pages?: number;
  file_type?: string;
}

export interface ExtractedInfo {
  id: number;
  document_id: number;
  field: string;
  value: string;
  unit: string;
  source_page: string;
  status: string;
  year?: number;
  subsidiary?: string;
  mine?: string;
}

export interface Difference {
  id: number;
  diff_id: string;
  field: string;
  value_a: string;
  value_b: string;
  unit_a?: string;
  unit_b?: string;
  doc_a_id: number;
  doc_b_id: number;
  doc_a_name?: string;
  doc_b_name?: string;
  page_a?: string;
  page_b?: string;
  year?: number;
  subsidiary?: string;
  priority?: string;
  status: string;
  resolution?: string;
  resolved_by?: string;
}
