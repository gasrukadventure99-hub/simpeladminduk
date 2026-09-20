-- ==============================================================================
-- SKEMA DATABASE LENGKAP SI-ADMINDUK ONLINE KABUPATEN SUBANG (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Petunjuk Penggunaan:
-- 1. Buka dashboard Supabase Anda (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor" di bilah navigasi kiri
-- 3. Klik "New query", tempelkan seluruh kode SQL ini, lalu klik tombol "Run"
-- 4. Semua tabel, indeks, keamanan RLS, dan data awal akan terbuat secara otomatis!
-- ==============================================================================

-- 1. TABEL PENGGUNA & AKUN (USER_ACCOUNTS)
CREATE TABLE IF NOT EXISTS public.user_accounts (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('PEMOHON', 'ADMIN')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    password TEXT,
    nik VARCHAR(16),
    address TEXT,
    nip VARCHAR(25),
    department TEXT,
    registered_at TIMESTAMPTZ DEFAULT TIMEZONE('asia/jakarta', NOW())
);

-- Indexing untuk mempercepat login dan pencarian akun
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON public.user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_accounts_nik ON public.user_accounts(nik);
CREATE INDEX IF NOT EXISTS idx_user_accounts_role ON public.user_accounts(role);

-- 2. TABEL PERMOHONAN BERKAS ADMINDUK (APPLICATIONS)
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.user_accounts(id) ON DELETE SET NULL,
    registration_number TEXT NOT NULL UNIQUE,
    service_type TEXT NOT NULL,
    service_category TEXT NOT NULL,
    service_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    nik VARCHAR(16) NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    gender TEXT NOT NULL,
    birth_place TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    address TEXT NOT NULL,
    rt_rw TEXT NOT NULL,
    kelurahan TEXT NOT NULL,
    kecamatan TEXT NOT NULL,
    kabupaten_kota TEXT NOT NULL DEFAULT 'Kabupaten Subang',
    provinsi TEXT NOT NULL DEFAULT 'Jawa Barat',
    notes TEXT,
    reason TEXT,
    child_name TEXT,
    child_birth_date TEXT,
    father_name TEXT,
    mother_name TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'DIPROSES' CHECK (status IN ('DIPROSES', 'DISETUJUI', 'DITOLAK')),
    submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('asia/jakarta', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('asia/jakarta', NOW()),
    processed_by TEXT,
    rejection_reason TEXT,
    approval_notes TEXT,
    pickup_estimated_date TEXT,
    pickup_location TEXT
);

-- Indexing untuk pencarian cepat status berkas dan pelacakan resi
CREATE INDEX IF NOT EXISTS idx_applications_reg_num ON public.applications(registration_number);
CREATE INDEX IF NOT EXISTS idx_applications_nik ON public.applications(nik);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON public.applications(submitted_at DESC);

-- 3. TABEL RIWAYAT NOTIFIKASI WHATSAPP GATEWAY (WHATSAPP_NOTIFICATIONS)
CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
    id TEXT PRIMARY KEY,
    application_id TEXT,
    registration_number TEXT,
    recipient_phone TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT TIMEZONE('asia/jakarta', NOW()),
    status TEXT NOT NULL DEFAULT 'TERKIRIM' CHECK (status IN ('TERKIRIM', 'DIBACA'))
);

CREATE INDEX IF NOT EXISTS idx_wa_reg_num ON public.whatsapp_notifications(registration_number);
CREATE INDEX IF NOT EXISTS idx_wa_phone ON public.whatsapp_notifications(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_wa_sent_at ON public.whatsapp_notifications(sent_at DESC);

-- ==============================================================================
-- KONFIGURASI KEAMANAN (ROW LEVEL SECURITY / RLS)
-- ==============================================================================
-- Mengaktifkan RLS agar tabel aman terlindungi
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (Anonim & Terotentikasi) untuk kemudahan operasional layanan publik
-- 1. Policies untuk user_accounts
DROP POLICY IF EXISTS "Public access to user_accounts" ON public.user_accounts;
CREATE POLICY "Public access to user_accounts" 
ON public.user_accounts 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- 2. Policies untuk applications
DROP POLICY IF EXISTS "Public access to applications" ON public.applications;
CREATE POLICY "Public access to applications" 
ON public.applications 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- 3. Policies untuk whatsapp_notifications
DROP POLICY IF EXISTS "Public access to whatsapp_notifications" ON public.whatsapp_notifications;
CREATE POLICY "Public access to whatsapp_notifications" 
ON public.whatsapp_notifications 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- AKTIFKAN SUPABASE REALTIME (OPSIONAL - DATA OTOMATIS BERGERAK LIVE)
-- ==============================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.applications, public.whatsapp_notifications;
COMMIT;

-- ==============================================================================
-- DATA AWAL / SEED DATA (AGAR APLIKASI LANGSUNG MEMILIKI DATA RESMI)
-- ==============================================================================

-- Akun Petugas Admin & Akun Contoh Warga
INSERT INTO public.user_accounts (id, role, full_name, email, phone, password, nip, department, registered_at)
VALUES 
('admin-01', 'ADMIN', 'Drs. H. Mulyana, M.Si', 'admin@subang.go.id', '0812-9988-7766', 'admin123', '197805122005011004', 'Bidang Pelayanan Pendaftaran Penduduk', NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_accounts (id, role, full_name, email, phone, password, nik, address, registered_at)
VALUES 
('user-001', 'PEMOHON', 'Bima Satria Wicaksono', 'bima.satria@example.com', '0812-3456-7890', 'user123', '3201121508070003', 'Jl. Pejuang 45 No. 14, Subang', NOW() - INTERVAL '10 days'),
('user-002', 'PEMOHON', 'Siti Rahmawati', 'siti.rahmawati@example.com', '0857-1122-3344', 'user123', '3201124503920001', 'Perumahan Subang Indah C-12, Subang', NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- Data Permohonan Contoh
INSERT INTO public.applications (
    id, user_id, registration_number, service_type, service_category, service_title,
    full_name, nik, phone, email, gender, birth_place, birth_date, address, rt_rw,
    kelurahan, kecamatan, kabupaten_kota, provinsi, status, submitted_at, updated_at,
    processed_by, approval_notes, pickup_estimated_date, pickup_location, documents
) VALUES (
    'adm-001',
    'user-001',
    'REG-2026-KTP-4819',
    'KTP_BARU',
    'KTP-el',
    'Perekaman KTP-el Pemula (Usia 17 Tahun)',
    'Bima Satria Wicaksono',
    '3201121508070003',
    '0812-3456-7890',
    'bima.satria@example.com',
    'Laki-laki',
    'Subang',
    '2007-08-15',
    'Jl. Pejuang 45 No. 14, RT 03 / RW 07',
    '03/07',
    'Karanganyar',
    'Subang',
    'Kabupaten Subang',
    'Jawa Barat',
    'DISETUJUI',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '4 days',
    'Drs. H. Mulyana, M.Si',
    'Dokumen lengkap dan valid. KTP-el telah dicetak.',
    '2026-09-25 (09:00 - 15:00 WIB)',
    'Loket 03 Disdukcapil Kab. Subang',
    '[
      {"id":"doc-1","name":"Kartu Keluarga (KK) Asli","description":"Scan atau foto jelas KK","required":true,"uploadedFileName":"KK_Keluarga_Wicaksono.pdf","uploadedFileSize":"1.40 MB"},
      {"id":"doc-2","name":"Akta Kelahiran","description":"Scan Akta Kelahiran","required":true,"uploadedFileName":"Akta_Lahir_Bima.pdf","uploadedFileSize":"850 KB"}
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Selesai
