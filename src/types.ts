export type ServiceType = 
  | 'KTP_BARU' 
  | 'KTP_PENGGANTIAN' 
  | 'KK_BARU' 
  | 'KK_PERUBAHAN' 
  | 'AKTA_KELAHIRAN';

export type ApplicationStatus = 'DIPROSES' | 'DISETUJUI' | 'DITOLAK';

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  uploadedAt?: string;
  mockPreviewUrl?: string;
}

export interface ApplicationRecord {
  id: string;
  userId?: string;
  registrationNumber: string; // e.g., REG-2026-KTP-0192
  serviceType: ServiceType;
  serviceCategory: 'KTP-el' | 'Kartu Keluarga' | 'Akta Kelahiran';
  serviceTitle: string;
  
  // Applicant Data
  fullName: string;
  nik: string; // 16 digits
  phone: string;
  email?: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  address: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  
  // Service-specific details
  notes?: string;
  reason?: string; // Reason for replacement/change
  childName?: string; // For Akta Kelahiran
  childBirthDate?: string;
  fatherName?: string;
  motherName?: string;

  // Documents
  documents: RequiredDocument[];

  // Processing & Status
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  processedBy?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  pickupEstimatedDate?: string;
  pickupLocation?: string;
}

export type UserRole = 'PEMOHON' | 'ADMIN';

export interface UserAccount {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  nik?: string; // For PEMOHON
  address?: string;
  nip?: string; // For ADMIN
  department?: string;
  registeredAt: string;
}

export interface WhatsAppNotification {
  id: string;
  applicationId: string;
  registrationNumber: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  type: 'REGISTRATION_CONFIRMATION' | 'STATUS_APPROVED' | 'STATUS_REJECTED' | 'DOCUMENT_READY';
  sentAt: string;
  status: 'TERKIRIM' | 'DIBACA';
}
