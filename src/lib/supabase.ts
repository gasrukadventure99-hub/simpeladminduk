import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApplicationRecord, ApplicationStatus, UserAccount, WhatsAppNotification } from '../types';

// ==========================================
// CONFIGURATION & DYNAMIC CLIENT MANAGEMENT
// ==========================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_project_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : null;

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const url = (localUrl || envUrl || '').trim();
  const anonKey = (localKey || envKey || '').trim();

  return { url, anonKey };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    anonKey.length > 20
  );
};

let activeClient: SupabaseClient | null = null;

export const reinitSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (isSupabaseConfigured()) {
    try {
      activeClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return activeClient;
    } catch (err) {
      console.warn('[Supabase] Failed to initialize client:', err);
      activeClient = null;
      return null;
    }
  }
  activeClient = null;
  return null;
};

// Initial setup
reinitSupabaseClient();

export const getSupabase = (): SupabaseClient | null => {
  if (!activeClient && isSupabaseConfigured()) {
    return reinitSupabaseClient();
  }
  return activeClient;
};

// Dynamic proxy so existing imports like `supabase.from(...)` or `supabase.channel(...)` work seamlessly
export const supabase: SupabaseClient | null = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return undefined;
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});

export const setSupabaseConfig = (url: string, anonKey: string): void => {
  if (typeof window !== 'undefined') {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    if (cleanUrl && cleanKey) {
      localStorage.setItem('supabase_project_url', cleanUrl);
      localStorage.setItem('supabase_anon_key', cleanKey);
    } else {
      localStorage.removeItem('supabase_project_url');
      localStorage.removeItem('supabase_anon_key');
    }
  }
  reinitSupabaseClient();
};

export async function testSupabaseConnection(
  url: string,
  anonKey: string
): Promise<{ success: boolean; message: string; tableCount?: number }> {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('https://')) {
      return { success: false, message: 'URL proyek harus berawalan "https://"' };
    }
    if (cleanKey.length < 20) {
      return { success: false, message: 'API key anon/public tidak valid (terlalu pendek)' };
    }

    const testClient = createClient(cleanUrl, cleanKey);

    // Test select query on applications table
    const { data, error } = await testClient
      .from('applications')
      .select('id')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Koneksi berhasil tetapi tabel 'applications' belum ditemukan atau izin dibatasi: ${error.message}. Pastikan Anda telah menjalankan kode SQL schema di SQL Editor Supabase.`,
      };
    }

    return {
      success: true,
      message: 'Koneksi ke Supabase berhasil dan tabel PostgreSQL terverifikasi aktif!',
      tableCount: data ? data.length : 0,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal terhubung ke host Supabase: ${err?.message || 'Periksa kembali URL dan koneksi internet Anda.'}`,
    };
  }
}

// ==========================================
// 1. APPLICATIONS CRUD
// ==========================================

export async function fetchApplicationsFromSupabase(): Promise<ApplicationRecord[] | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching applications:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id || undefined,
      registrationNumber: row.registration_number,
      serviceType: row.service_type,
      serviceCategory: row.service_category,
      serviceTitle: row.service_title,
      fullName: row.full_name,
      nik: row.nik,
      phone: row.phone,
      email: row.email || undefined,
      gender: row.gender,
      birthPlace: row.birth_place,
      birthDate: row.birth_date,
      address: row.address,
      rtRw: row.rt_rw,
      kelurahan: row.kelurahan,
      kecamatan: row.kecamatan,
      kabupatenKota: row.kabupaten_kota,
      provinsi: row.provinsi,
      notes: row.notes || undefined,
      reason: row.reason || undefined,
      childName: row.child_name || undefined,
      childBirthDate: row.child_birth_date || undefined,
      fatherName: row.father_name || undefined,
      motherName: row.mother_name || undefined,
      documents: Array.isArray(row.documents)
        ? row.documents
        : typeof row.documents === 'string'
        ? JSON.parse(row.documents)
        : [],
      status: row.status as ApplicationStatus,
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
      processedBy: row.processed_by || undefined,
      rejectionReason: row.rejection_reason || undefined,
      approvalNotes: row.approval_notes || undefined,
      pickupEstimatedDate: row.pickup_estimated_date || undefined,
      pickupLocation: row.pickup_location || undefined,
    }));
  } catch (err) {
    console.error('[Supabase] fetchApplications error:', err);
    return null;
  }
}

export async function insertApplicationToSupabase(app: ApplicationRecord): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const payload = {
      id: app.id,
      user_id: app.userId || null,
      registration_number: app.registrationNumber,
      service_type: app.serviceType,
      service_category: app.serviceCategory,
      service_title: app.serviceTitle,
      full_name: app.fullName,
      nik: app.nik,
      phone: app.phone,
      email: app.email || null,
      gender: app.gender,
      birth_place: app.birthPlace,
      birth_date: app.birthDate,
      address: app.address,
      rt_rw: app.rtRw,
      kelurahan: app.kelurahan,
      kecamatan: app.kecamatan,
      kabupaten_kota: app.kabupatenKota,
      provinsi: app.provinsi,
      notes: app.notes || null,
      reason: app.reason || null,
      child_name: app.childName || null,
      child_birth_date: app.childBirthDate || null,
      father_name: app.fatherName || null,
      mother_name: app.motherName || null,
      documents: app.documents,
      status: app.status,
      submitted_at: app.submittedAt,
      updated_at: app.updatedAt,
      processed_by: app.processedBy || null,
      rejection_reason: app.rejectionReason || null,
      approval_notes: app.approvalNotes || null,
      pickup_estimated_date: app.pickupEstimatedDate || null,
      pickup_location: app.pickupLocation || null,
    };

    const { error } = await client
      .from('applications')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error inserting application:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] insertApplication error:', err);
    return false;
  }
}

export async function updateApplicationStatusInSupabase(
  id: string,
  updates: {
    status: ApplicationStatus;
    updatedAt: string;
    processedBy?: string;
    rejectionReason?: string;
    approvalNotes?: string;
    pickupEstimatedDate?: string;
    pickupLocation?: string;
  }
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const payload: any = {
      status: updates.status,
      updated_at: updates.updatedAt,
    };
    if (updates.processedBy !== undefined) payload.processed_by = updates.processedBy;
    if (updates.rejectionReason !== undefined) payload.rejection_reason = updates.rejectionReason;
    if (updates.approvalNotes !== undefined) payload.approval_notes = updates.approvalNotes;
    if (updates.pickupEstimatedDate !== undefined) payload.pickup_estimated_date = updates.pickupEstimatedDate;
    if (updates.pickupLocation !== undefined) payload.pickup_location = updates.pickupLocation;

    const { error } = await client
      .from('applications')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('[Supabase] Error updating application status:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] updateApplicationStatus error:', err);
    return false;
  }
}

export async function deleteApplicationFromSupabase(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('applications').delete().eq('id', id);
    if (error) {
      console.error('[Supabase] Error deleting application:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] deleteApplication error:', err);
    return false;
  }
}

// ==========================================
// 2. USER ACCOUNTS CRUD
// ==========================================

export async function fetchAccountsFromSupabase(): Promise<UserAccount[] | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('user_accounts')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching accounts:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      role: row.role,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      password: row.password || undefined,
      nik: row.nik || undefined,
      address: row.address || undefined,
      nip: row.nip || undefined,
      department: row.department || undefined,
      registeredAt: row.registered_at,
    }));
  } catch (err) {
    console.error('[Supabase] fetchAccounts error:', err);
    return null;
  }
}

export async function insertAccountToSupabase(account: UserAccount): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const payload = {
      id: account.id,
      role: account.role,
      full_name: account.fullName,
      email: account.email,
      phone: account.phone,
      password: account.password || null,
      nik: account.nik || null,
      address: account.address || null,
      nip: account.nip || null,
      department: account.department || null,
      registered_at: account.registeredAt,
    };

    const { error } = await client
      .from('user_accounts')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error inserting user account:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] insertAccount error:', err);
    return false;
  }
}

export async function deleteAccountFromSupabase(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('user_accounts').delete().eq('id', id);
    if (error) {
      console.error('[Supabase] Error deleting account:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] deleteAccount error:', err);
    return false;
  }
}

// ==========================================
// 3. WHATSAPP NOTIFICATIONS CRUD
// ==========================================

export async function fetchNotificationsFromSupabase(): Promise<WhatsAppNotification[] | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('whatsapp_notifications')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching notifications:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      applicationId: row.application_id,
      registrationNumber: row.registration_number,
      recipientPhone: row.recipient_phone,
      recipientName: row.recipient_name,
      message: row.message,
      type: row.type,
      sentAt: row.sent_at,
      status: row.status,
    }));
  } catch (err) {
    console.error('[Supabase] fetchNotifications error:', err);
    return null;
  }
}

export async function insertNotificationToSupabase(notif: WhatsAppNotification): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const payload = {
      id: notif.id,
      application_id: notif.applicationId,
      registration_number: notif.registrationNumber,
      recipient_phone: notif.recipientPhone,
      recipient_name: notif.recipientName,
      message: notif.message,
      type: notif.type,
      sent_at: notif.sentAt,
      status: notif.status,
    };

    const { error } = await client
      .from('whatsapp_notifications')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error inserting notification:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] insertNotification error:', err);
    return false;
  }
}

// ==========================================
// 4. BULK SYNC UTILITY
// ==========================================

export async function syncAllLocalDataToSupabase(
  applications: ApplicationRecord[],
  accounts: UserAccount[],
  notifications: WhatsAppNotification[]
): Promise<{ success: boolean; appsCount: number; accountsCount: number }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, appsCount: 0, accountsCount: 0 };
  }

  let appsCount = 0;
  let accountsCount = 0;

  for (const acc of accounts) {
    const ok = await insertAccountToSupabase(acc);
    if (ok) accountsCount++;
  }

  for (const app of applications) {
    const ok = await insertApplicationToSupabase(app);
    if (ok) appsCount++;
  }

  for (const notif of notifications) {
    await insertNotificationToSupabase(notif);
  }

  return { success: true, appsCount, accountsCount };
}
