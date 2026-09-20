export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem Pendaftaran Online Adminduk</title>
  <meta name="description" content="Sistem Pendaftaran Online Pelayanan Administrasi Kependudukan (Adminduk) Terintegrasi">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    @media print {
      body * { visibility: hidden; }
      #printable-receipt, #printable-receipt * { visibility: visible; }
      #printable-receipt {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 20px;
        background: white !important;
        color: black !important;
      }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">

  <!-- TOP GOVERNMENT STRIP -->
  <div class="bg-blue-950 text-blue-200 text-xs px-4 py-1.5 border-b border-blue-900">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-medium">PORTAL RESMI LAYANAN DUKCAPIL ONLINE MANDIRI</span>
      </div>
      <div class="hidden sm:flex items-center gap-4 text-slate-300">
        <span>Call Center: 1500537</span>
        <span>•</span>
        <span>Jam Pelayanan: 08.00 - 15.30 WIB</span>
      </div>
    </div>
  </div>

  <!-- NAVBAR WITH ROLE SWITCHER -->
  <header class="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold tracking-tight">SI-ADMINDUK ONLINE</h1>
            <span class="text-[10px] px-2 py-0.5 font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">PROTOTYPE</span>
          </div>
          <p class="text-xs text-slate-400">Dinas Kependudukan dan Pencatatan Sipil</p>
        </div>
      </div>

      <!-- ROLE SWITCHER -->
      <div class="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
        <button id="btn-role-user" onclick="switchRole('USER')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow">
          👤 Login sebagai User (Masyarakat)
        </button>
        <button id="btn-role-admin" onclick="switchRole('ADMIN')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white">
          🛡️ Login sebagai Admin (Petugas)
          <span id="nav-pending-badge" class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold hidden">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
    
    <!-- ============================================== -->
    <!-- VIEW 1: ROLE USER (MASYARAKAT) -->
    <!-- ============================================== -->
    <div id="view-user" class="space-y-6">
      
      <!-- User Hero -->
      <div class="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <span class="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-2">
          ✨ Layanan Adminduk Mandiri
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Pendaftaran Adminduk Online</h2>
        <p class="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Urus KTP-el, Kartu Keluarga, dan Akta Kelahiran secara mandiri dari rumah. Unggah dokumen persyaratan dan pantau status permohonan secara real-time.
        </p>
      </div>

      <!-- User Dashboard Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-medium text-slate-500 block">Total Pengajuan</span>
          <span id="stat-user-total" class="text-2xl font-bold text-slate-900">0</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-medium text-amber-600 block">Sedang Diproses</span>
          <span id="stat-user-diproses" class="text-2xl font-bold text-amber-600">0</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-medium text-emerald-600 block">Telah Disetujui</span>
          <span id="stat-user-disetujui" class="text-2xl font-bold text-emerald-600">0</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-medium text-rose-600 block">Ditolak / Perlu Revisi</span>
          <span id="stat-user-ditolak" class="text-2xl font-bold text-rose-600">0</span>
        </div>
      </div>

      <!-- User Tabs -->
      <div class="flex border-b border-slate-200 bg-white rounded-t-xl px-6 pt-3 shadow-xs">
        <button id="user-tab-form-btn" onclick="switchUserTab('FORM')" class="pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 border-blue-600 text-blue-600">
          📝 Form Pengajuan Baru
        </button>
        <button id="user-tab-status-btn" onclick="switchUserTab('STATUS')" class="pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800">
          🔍 Status & Riwayat Pengajuan (<span id="user-app-count-badge">0</span>)
        </button>
      </div>

      <!-- TAB: FORM PENGAJUAN -->
      <div id="user-tab-form" class="bg-white rounded-b-xl border-x border-b border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <form id="form-adminduk" onsubmit="handleUserFormSubmit(event)" class="space-y-6">
          
          <!-- 1. Layanan Selector -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Pilih Jenis Layanan Adminduk:
            </label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="service-selector-container">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- 2. Data Pemohon -->
          <div class="pt-4 border-t border-slate-200 space-y-4">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Data Identitas Pemohon:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div class="sm:col-span-2">
                <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input type="text" id="input-fullname" required placeholder="Sesuai KK/Akta Lahir" class="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">NIK (16 Digit) *</label>
                <input type="text" id="input-nik" maxlength="16" required placeholder="3201xxxxxxxxxxxx" class="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono">
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                <input type="tel" id="input-phone" required placeholder="0812-xxxx-xxxx" class="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                <select id="input-gender" class="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                <input type="date" id="input-birthdate" required value="2000-01-01" class="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
              </div>
              <div class="sm:col-span-2 md:col-span-3">
                <label class="block font-semibold text-slate-700 mb-1">Alamat Lengkap KTP *</label>
                <input type="text" id="input-address" required placeholder="Nama Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan" class="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
              </div>
            </div>

            <!-- Dynamic extra field for Akta Kelahiran -->
            <div id="extra-akta-fields" class="hidden bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs space-y-3">
              <span class="font-bold text-blue-900 block">Data Anak (Akta Kelahiran):</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-700 mb-1">Nama Lengkap Bayi</label>
                  <input type="text" id="input-child-name" placeholder="Nama bayi" class="w-full p-2 rounded-lg border border-blue-300 bg-white">
                </div>
                <div>
                  <label class="block text-slate-700 mb-1">Tanggal Lahir Bayi</label>
                  <input type="date" id="input-child-dob" class="w-full p-2 rounded-lg border border-blue-300 bg-white">
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Upload Dokumen Syarat (Mockup Upload File) -->
          <div class="pt-4 border-t border-slate-200 space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Upload Dokumen Persyaratan (Mockup):
            </label>
            <p class="text-xs text-slate-500">Klik tombol "Unggah Berkas" untuk mensimulasikan upload berkas persyaratan.</p>
            <div id="upload-docs-list" class="space-y-2">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span class="text-xs text-slate-500">Pastikan data dan dokumen yang dilampirkan telah sesuai.</span>
            <button type="submit" class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">
              🚀 Kirim Berkas Pengajuan Adminduk
            </button>
          </div>

        </form>
      </div>

      <!-- TAB: STATUS & RIWAYAT -->
      <div id="user-tab-status" class="hidden space-y-4">
        <div id="user-apps-container" class="space-y-3">
          <!-- Rendered via JS -->
        </div>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- VIEW 2: ROLE ADMIN (PETUGAS ADMINDUK) -->
    <!-- ============================================== -->
    <div id="view-admin" class="hidden space-y-6">
      
      <!-- Admin Header -->
      <div class="bg-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span class="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold mb-1">
            🛡️ Panel Petugas Adminduk
          </span>
          <h2 class="text-xl sm:text-2xl font-bold">Dashboard Manajemen Pengajuan</h2>
          <p class="text-xs text-slate-400 mt-0.5">Kelola verifikasi, setujui, tolak dengan alasan, dan cetak tanda terima berkas masuk.</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="addSimulatedApplication()" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">
            + Simulasi Masuk Baru
          </button>
          <button onclick="resetDataToDefault()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition">
            Reset Data
          </button>
        </div>
      </div>

      <!-- Admin Analytics Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-bold text-slate-500 uppercase">Total Pengajuan</span>
          <span id="admin-stat-total" class="text-3xl font-extrabold text-slate-900 block mt-1">0</span>
        </div>
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-bold text-amber-600 uppercase">Diproses / Antrean</span>
          <span id="admin-stat-diproses" class="text-3xl font-extrabold text-amber-600 block mt-1">0</span>
        </div>
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-bold text-emerald-600 uppercase">Disetujui</span>
          <span id="admin-stat-disetujui" class="text-3xl font-extrabold text-emerald-600 block mt-1">0</span>
        </div>
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-xs font-bold text-rose-600 uppercase">Ditolak</span>
          <span id="admin-stat-ditolak" class="text-3xl font-extrabold text-rose-600 block mt-1">0</span>
        </div>
      </div>

      <!-- Admin Table Container -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        <!-- Filter and Search Bar -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            
            <!-- Category filter -->
            <select id="admin-filter-category" onchange="renderAdminTable()" class="p-2 rounded-lg border border-slate-300 bg-white font-medium">
              <option value="ALL">Semua Layanan</option>
              <option value="KTP-el">KTP-el</option>
              <option value="Kartu Keluarga">Kartu Keluarga (KK)</option>
              <option value="Akta Kelahiran">Akta Kelahiran</option>
            </select>

            <!-- Status filter -->
            <select id="admin-filter-status" onchange="renderAdminTable()" class="p-2 rounded-lg border border-slate-300 bg-white font-medium">
              <option value="ALL">Semua Status</option>
              <option value="DIPROSES">Diproses</option>
              <option value="DISETUJUI">Disetujui</option>
              <option value="DITOLAK">Ditolak</option>
            </select>

          </div>

          <div class="w-full sm:w-64">
            <input type="text" id="admin-search-input" oninput="renderAdminTable()" placeholder="Cari NIK / Nama / No Reg..." class="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs">
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">No. Registrasi</th>
                <th class="py-3 px-4">Pemohon & NIK</th>
                <th class="py-3 px-4">Layanan</th>
                <th class="py-3 px-4">Waktu</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody id="admin-table-body" class="divide-y divide-slate-200">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>

      </div>

    </div>

  </main>

  <!-- MODAL RESI / BUKTI PENDAFTARAN -->
  <div id="modal-receipt" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs hidden overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col">
      <div class="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <h3 class="font-bold text-xs">BUKTI PENDAFTARAN ADMINDUK RESMI</h3>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold">🖨️ Cetak Resi</button>
          <button onclick="closeModal('modal-receipt')" class="p-1 text-slate-400 hover:text-white">✕</button>
        </div>
      </div>
      <div id="printable-receipt" class="p-6 sm:p-8 text-slate-900 text-xs sm:text-sm">
        <!-- Injected via JS -->
      </div>
      <div class="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
        <button onclick="closeModal('modal-receipt')" class="px-4 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 rounded-lg">Tutup</button>
      </div>
    </div>
  </div>

  <!-- MODAL UBAH STATUS (SETUJUI / TOLAK) -->
  <div id="modal-status" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs hidden overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden">
      <div class="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <h3 class="font-bold text-xs">TINDAK LANJUT / UBAH STATUS BERKAS</h3>
        <button onclick="closeModal('modal-status')" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <form id="form-change-status" onsubmit="handleSaveStatus(event)" class="p-6 space-y-4 text-xs">
        <input type="hidden" id="status-target-app-id">
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200" id="status-modal-app-info"></div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Pilih Status Baru:</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" id="btn-choice-disetujui" onclick="selectStatusChoice('DISETUJUI')" class="p-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 text-center">
              ✓ SETUJUI BERKAS
            </button>
            <button type="button" id="btn-choice-ditolak" onclick="selectStatusChoice('DITOLAK')" class="p-2.5 rounded-lg border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-center">
              ✕ TOLAK BERKAS
            </button>
          </div>
        </div>

        <div id="status-rejection-field" class="hidden space-y-2">
          <label class="block font-bold text-rose-800">Alasan Penolakan / Dokumen yang Perlu Diperbaiki *:</label>
          <textarea id="status-rejection-reason" rows="3" class="w-full p-2 border border-rose-300 rounded-lg bg-rose-50/50" placeholder="Contoh: Foto KK buram / lampiran belum lengkap..."></textarea>
        </div>

        <div id="status-approval-field" class="space-y-2">
          <label class="block font-bold text-emerald-800">Catatan Persetujuan / Lokasi Ambil:</label>
          <input type="text" id="status-approval-note" class="w-full p-2 border border-emerald-300 rounded-lg" value="Berkas telah divalidasi. Fisik siap diambil di Loket 2 Dukcapil.">
        </div>

        <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
          <button type="button" onclick="closeModal('modal-status')" class="px-4 py-2 bg-slate-100 rounded-lg font-medium">Batal</button>
          <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Simpan Keputusan</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL DETAIL BERKAS -->
  <div id="modal-detail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs hidden overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col">
      <div class="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <h3 class="font-bold text-xs">DETAIL BERKAS ADMINDUK</h3>
        <button onclick="closeModal('modal-detail')" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <div id="detail-modal-body" class="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
        <!-- Injected via JS -->
      </div>
      <div class="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
        <button onclick="closeModal('modal-detail')" class="px-4 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 rounded-lg">Tutup</button>
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    // Initial Dummy Data
    const INITIAL_DATA = [
      {
        id: 'adm-001',
        registrationNumber: 'REG-2026-KTP-4819',
        serviceCategory: 'KTP-el',
        serviceTitle: 'Pembuatan KTP-el Baru (Pemula 17 Tahun)',
        fullName: 'Bima Satria Wicaksono',
        nik: '3201121508070003',
        phone: '0812-3456-7890',
        gender: 'Laki-laki',
        birthDate: '2007-08-15',
        address: 'Jl. Merak No. 14, RT 03/07, Kabupaten Subang',
        documents: ['Kartu Keluarga Asli (KK)', 'Akta Kelahiran', 'Pas Foto 3x4'],
        status: 'DISETUJUI',
        submittedAt: '2026-09-10 09:40',
        approvalNotes: 'Berkas tervalidasi lengkap. KTP fisik siap diambil di loket.'
      },
      {
        id: 'adm-002',
        registrationNumber: 'REG-2026-KK-9214',
        serviceCategory: 'Kartu Keluarga',
        serviceTitle: 'Perubahan Data KK (Penambahan Anggota Baru)',
        fullName: 'Siti Nurhaliza',
        nik: '3201125203920005',
        phone: '0857-1122-3344',
        gender: 'Perempuan',
        birthDate: '1992-03-12',
        address: 'Komplek Griya Indah Blok C3 No. 8, Kabupaten Subang',
        documents: ['KK Lama Asli', 'Buku Nikah', 'Surat Keterangan Lahir RS'],
        status: 'DIPROSES',
        submittedAt: '2026-09-12 10:25'
      },
      {
        id: 'adm-003',
        registrationNumber: 'REG-2026-AKT-1048',
        serviceCategory: 'Akta Kelahiran',
        serviceTitle: 'Penerbitan Kutipan Akta Kelahiran Baru',
        fullName: 'Ahmad Fauzi Ridwan',
        nik: '3201122106880001',
        phone: '0813-8899-7711',
        gender: 'Laki-laki',
        birthDate: '1988-06-21',
        address: 'Jl. Riau No. 45, Kabupaten Subang',
        documents: ['Surat Kelahiran RSUD', 'Buku Nikah Ortu', 'KK', 'KTP Saksi'],
        status: 'DIPROSES',
        submittedAt: '2026-09-11 11:15'
      },
      {
        id: 'adm-004',
        registrationNumber: 'REG-2026-KTP-3312',
        serviceCategory: 'KTP-el',
        serviceTitle: 'Penggantian KTP-el Rusak / Patah',
        fullName: 'Rizky Ramadhan',
        nik: '3201120904950007',
        phone: '0821-9988-7766',
        gender: 'Laki-laki',
        birthDate: '1995-04-09',
        address: 'Jl. Otista No. 88, Kabupaten Subang',
        documents: ['Foto Fisik KTP Rusak', 'Scan KK'],
        status: 'DITOLAK',
        submittedAt: '2026-09-08 14:20',
        rejectionReason: 'Foto fisik KTP buram, NIK tidak terbaca. Harap unggah ulang dengan pencahayaan jelas.'
      }
    ];

    const SERVICES = [
      {
        id: 'KTP_BARU',
        category: 'KTP-el',
        title: 'Pembuatan KTP-el Baru / Penggantian',
        docs: ['Kartu Keluarga (KK) Asli', 'Akta Kelahiran', 'Pas Foto 3x4 Latar Merah/Biru']
      },
      {
        id: 'KK_BARU',
        category: 'Kartu Keluarga',
        title: 'Kartu Keluarga (KK) Baru / Perubahan Data',
        docs: ['Kartu Keluarga Lama Asli', 'Buku Nikah / Akta Perkawinan', 'Dokumen Pendukung Perubahan']
      },
      {
        id: 'AKTA_KELAHIRAN',
        category: 'Akta Kelahiran',
        title: 'Penerbitan Kutipan Akta Kelahiran',
        docs: ['Surat Keterangan Lahir RS/Bidan', 'Buku Nikah Orang Tua', 'KK Orang Tua', 'KTP-el Saksi']
      }
    ];

    // App State
    let currentRole = 'USER';
    let currentApplications = JSON.parse(localStorage.getItem('si_adminduk_data')) || INITIAL_DATA;
    let selectedServiceIndex = 0;
    let uploadedMockFiles = {};
    let currentStatusChoice = 'DISETUJUI';

    function saveData() {
      localStorage.setItem('si_adminduk_data', JSON.stringify(currentApplications));
    }

    // Role Switcher
    function switchRole(role) {
      currentRole = role;
      const userBtn = document.getElementById('btn-role-user');
      const adminBtn = document.getElementById('btn-role-admin');
      const viewUser = document.getElementById('view-user');
      const viewAdmin = document.getElementById('view-admin');

      if (role === 'USER') {
        userBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-blue-600 text-white shadow';
        adminBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white';
        viewUser.classList.remove('hidden');
        viewAdmin.classList.add('hidden');
      } else {
        adminBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-amber-600 text-white shadow';
        userBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white';
        viewAdmin.classList.remove('hidden');
        viewUser.classList.add('hidden');
        renderAdminTable();
      }
      updateStats();
    }

    function switchUserTab(tab) {
      const formBtn = document.getElementById('user-tab-form-btn');
      const statusBtn = document.getElementById('user-tab-status-btn');
      const tabForm = document.getElementById('user-tab-form');
      const tabStatus = document.getElementById('user-tab-status');

      if (tab === 'FORM') {
        formBtn.className = 'pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 border-blue-600 text-blue-600';
        statusBtn.className = 'pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800';
        tabForm.classList.remove('hidden');
        tabStatus.classList.add('hidden');
      } else {
        statusBtn.className = 'pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 border-blue-600 text-blue-600';
        formBtn.className = 'pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800';
        tabStatus.classList.remove('hidden');
        tabForm.classList.add('hidden');
        renderUserStatusList();
      }
    }

    // Render Services
    function renderServices() {
      const container = document.getElementById('service-selector-container');
      container.innerHTML = SERVICES.map((srv, idx) => \`
        <div onclick="selectService(\${idx})" class="cursor-pointer p-4 rounded-xl border-2 transition \${selectedServiceIndex === idx ? 'border-blue-600 bg-blue-50/60 font-bold' : 'border-slate-200 hover:bg-slate-50'}">
          <span class="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">\${srv.category}</span>
          <h4 class="font-bold text-xs text-slate-900 mt-2">\${srv.title}</h4>
          <p class="text-[11px] text-slate-500 mt-1 font-normal">\${srv.docs.length} Berkas Syarat</p>
        </div>
      \`).join('');
      renderUploadDocs();

      const extraAkta = document.getElementById('extra-akta-fields');
      if (SERVICES[selectedServiceIndex].id === 'AKTA_KELAHIRAN') {
        extraAkta.classList.remove('hidden');
      } else {
        extraAkta.classList.add('hidden');
      }
    }

    function selectService(idx) {
      selectedServiceIndex = idx;
      uploadedMockFiles = {};
      renderServices();
    }

    function renderUploadDocs() {
      const container = document.getElementById('upload-docs-list');
      const docs = SERVICES[selectedServiceIndex].docs;
      container.innerHTML = docs.map((doc, idx) => {
        const isUp = uploadedMockFiles[idx];
        return \`
          <div class="p-3 rounded-lg border \${isUp ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'} flex items-center justify-between text-xs">
            <div>
              <span class="font-semibold text-slate-800">\${doc}</span>
              \${isUp ? \`<span class="block text-[10px] text-emerald-700 font-mono">✓ \${isUp}</span>\` : ''}
            </div>
            <button type="button" onclick="simulateUpload(\${idx}, '\${doc}')" class="px-3 py-1.5 rounded-lg \${isUp ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'} text-[11px] font-bold">
              \${isUp ? 'Ganti Berkas' : 'Unggah Berkas'}
            </button>
          </div>
        \`;
      }).join('');
    }

    function simulateUpload(idx, docName) {
      uploadedMockFiles[idx] = 'Scan_' + docName.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf (1.2 MB)';
      renderUploadDocs();
    }

    // Submit User Form
    function handleUserFormSubmit(e) {
      e.preventDefault();
      const fullName = document.getElementById('input-fullname').value;
      const nik = document.getElementById('input-nik').value;
      const phone = document.getElementById('input-phone').value;
      const gender = document.getElementById('input-gender').value;
      const birthDate = document.getElementById('input-birthdate').value;
      const address = document.getElementById('input-address').value;

      if (nik.length !== 16 || isNaN(nik)) {
        alert('NIK harus 16 digit angka!');
        return;
      }

      const srv = SERVICES[selectedServiceIndex];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = srv.category === 'KTP-el' ? 'KTP' : srv.category === 'Kartu Keluarga' ? 'KK' : 'AKT';
      const regNumber = \`REG-2026-\${code}-\${randomSuffix}\`;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

      const newApp = {
        id: 'adm-' + Date.now(),
        registrationNumber: regNumber,
        serviceCategory: srv.category,
        serviceTitle: srv.title,
        fullName,
        nik,
        phone,
        gender,
        birthDate,
        address,
        documents: srv.docs,
        status: 'DIPROSES',
        submittedAt: now
      };

      currentApplications.unshift(newApp);
      saveData();
      updateStats();

      // Reset form
      e.target.reset();
      uploadedMockFiles = {};
      renderUploadDocs();

      alert('Permohonan berhasil terkirim! No. Registrasi: ' + regNumber);
      switchUserTab('STATUS');
      openReceipt(newApp);
    }

    // Render User Status List
    function renderUserStatusList() {
      const container = document.getElementById('user-apps-container');
      if (currentApplications.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-400">Belum ada pengajuan.</div>';
        return;
      }

      container.innerHTML = currentApplications.map(app => {
        let badge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">SEDANG DIPROSES</span>';
        if (app.status === 'DISETUJUI') {
          badge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">DISETUJUI</span>';
        } else if (app.status === 'DITOLAK') {
          badge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">DITOLAK</span>';
        }

        return \`
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span class="font-mono font-bold text-blue-900 text-xs">\${app.registrationNumber}</span>
                <h4 class="font-bold text-sm text-slate-900">\${app.serviceTitle}</h4>
                <p class="text-xs text-slate-500">Pemohon: \${app.fullName} (NIK: \${app.nik})</p>
              </div>
              <div class="flex items-center gap-2">
                \${badge}
                <button onclick="openReceiptById('\${app.id}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold">Resi</button>
              </div>
            </div>
            \${app.status === 'DITOLAK' && app.rejectionReason ? \`
              <div class="p-2.5 bg-rose-50 text-rose-800 rounded-lg text-xs border border-rose-200">
                <strong>Alasan Penolakan:</strong> \${app.rejectionReason}
              </div>
            \` : ''}
            \${app.status === 'DISETUJUI' && app.approvalNotes ? \`
              <div class="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-200">
                <strong>Catatan Persetujuan:</strong> \${app.approvalNotes}
              </div>
            \` : ''}
          </div>
        \`;
      }).join('');
    }

    // Render Admin Table
    function renderAdminTable() {
      const cat = document.getElementById('admin-filter-category').value;
      const stat = document.getElementById('admin-filter-status').value;
      const search = (document.getElementById('admin-search-input').value || '').toLowerCase();

      const filtered = currentApplications.filter(app => {
        const matchCat = cat === 'ALL' || app.serviceCategory === cat;
        const matchStat = stat === 'ALL' || app.status === stat;
        const matchSearch = app.fullName.toLowerCase().includes(search) || app.nik.includes(search) || app.registrationNumber.toLowerCase().includes(search);
        return matchCat && matchStat && matchSearch;
      });

      const tbody = document.getElementById('admin-table-body');
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-400">Tidak ada pengajuan yang cocok.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(app => {
        let badge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">DIPROSES</span>';
        if (app.status === 'DISETUJUI') badge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">DISETUJUI</span>';
        if (app.status === 'DITOLAK') badge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">DITOLAK</span>';

        return \`
          <tr class="hover:bg-slate-50">
            <td class="py-3 px-4 font-mono font-bold text-blue-900">\${app.registrationNumber}</td>
            <td class="py-3 px-4">
              <span class="font-bold text-slate-900 block">\${app.fullName}</span>
              <span class="text-[11px] text-slate-500 font-mono">NIK: \${app.nik}</span>
            </td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700 block mb-0.5 w-fit">\${app.serviceCategory}</span>
              <span class="text-slate-800">\${app.serviceTitle}</span>
            </td>
            <td class="py-3 px-4 text-slate-500 whitespace-nowrap">\${app.submittedAt}</td>
            <td class="py-3 px-4 whitespace-nowrap">\${badge}</td>
            <td class="py-3 px-4 text-center whitespace-nowrap">
              <div class="inline-flex items-center gap-1.5">
                <button onclick="openDetailModal('\${app.id}')" class="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold text-xs">Detail</button>
                <button onclick="openStatusModal('\${app.id}', 'DISETUJUI')" class="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-200 rounded-lg" title="Setujui">✓</button>
                <button onclick="openStatusModal('\${app.id}', 'DITOLAK')" class="p-1 bg-rose-50 text-rose-700 hover:bg-rose-200 rounded-lg" title="Tolak">✕</button>
                <button onclick="openReceiptById('\${app.id}')" class="p-1 bg-slate-100 hover:bg-slate-200 rounded-lg" title="Resi">🖨️</button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Modal Helpers
    function closeModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    function openReceiptById(id) {
      const app = currentApplications.find(a => a.id === id);
      if (app) openReceipt(app);
    }

    function openReceipt(app) {
      const container = document.getElementById('printable-receipt');
      container.innerHTML = \`
        <div class="border-b-2 border-slate-900 pb-3 text-center">
          <h2 class="font-extrabold text-base uppercase">DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL</h2>
          <p class="text-[11px] text-slate-600">Tanda Terima Pendaftaran Online Pelayanan Administrasi Kependudukan</p>
        </div>
        <div class="my-4 p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
          <div>
            <span class="text-[10px] uppercase text-slate-500 font-bold block">Nomor Registrasi:</span>
            <span class="font-mono font-extrabold text-lg text-blue-900">\${app.registrationNumber}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-500 block">Status:</span>
            <span class="font-bold uppercase text-xs">\${app.status}</span>
          </div>
        </div>
        <div class="space-y-2 text-xs">
          <p><strong>Nama Pemohon:</strong> \${app.fullName}</p>
          <p><strong>NIK:</strong> \${app.nik}</p>
          <p><strong>No. HP:</strong> \${app.phone}</p>
          <p><strong>Alamat:</strong> \${app.address}</p>
          <p><strong>Layanan:</strong> \${app.serviceTitle} (\${app.serviceCategory})</p>
          <p><strong>Waktu Masuk:</strong> \${app.submittedAt} WIB</p>
          \${app.rejectionReason ? \`<div class="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded"><strong>Catatan Penolakan:</strong> \${app.rejectionReason}</div>\` : ''}
          \${app.approvalNotes ? \`<div class="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded"><strong>Catatan Pengambilan:</strong> \${app.approvalNotes}</div>\` : ''}
        </div>
        <div class="mt-6 pt-4 border-t border-dashed border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
          <span>Verifikasi SIAK Digital</span>
          <span>Bawa bukti ini saat pengambilan fisik dokumen.</span>
        </div>
      \`;
      document.getElementById('modal-receipt').classList.remove('hidden');
    }

    function openStatusModal(id, targetStatus) {
      const app = currentApplications.find(a => a.id === id);
      if (!app) return;
      document.getElementById('status-target-app-id').value = id;
      document.getElementById('status-modal-app-info').innerHTML = \`
        <strong>\${app.fullName}</strong> (NIK: \${app.nik})<br>
        <span class="text-slate-500">No. Reg: \${app.registrationNumber} | Layanan: \${app.serviceTitle}</span>
      \`;
      selectStatusChoice(targetStatus || 'DISETUJUI');
      document.getElementById('modal-status').classList.remove('hidden');
    }

    function selectStatusChoice(status) {
      currentStatusChoice = status;
      const btnSetuju = document.getElementById('btn-choice-disetujui');
      const btnTolak = document.getElementById('btn-choice-ditolak');
      const rejField = document.getElementById('status-rejection-field');
      const appField = document.getElementById('status-approval-field');

      if (status === 'DISETUJUI') {
        btnSetuju.className = 'p-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 text-center';
        btnTolak.className = 'p-2.5 rounded-lg border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-center';
        rejField.classList.add('hidden');
        appField.classList.remove('hidden');
      } else {
        btnTolak.className = 'p-2.5 rounded-lg border-2 border-rose-500 bg-rose-50 font-bold text-rose-800 text-center';
        btnSetuju.className = 'p-2.5 rounded-lg border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-center';
        rejField.classList.remove('hidden');
        appField.classList.add('hidden');
      }
    }

    function handleSaveStatus(e) {
      e.preventDefault();
      const id = document.getElementById('status-target-app-id').value;
      const app = currentApplications.find(a => a.id === id);
      if (!app) return;

      app.status = currentStatusChoice;
      if (currentStatusChoice === 'DITOLAK') {
        app.rejectionReason = document.getElementById('status-rejection-reason').value || 'Dokumen persyaratan kurang lengkap.';
        app.approvalNotes = undefined;
      } else {
        app.approvalNotes = document.getElementById('status-approval-note').value;
        app.rejectionReason = undefined;
      }

      saveData();
      updateStats();
      renderAdminTable();
      closeModal('modal-status');
    }

    function openDetailModal(id) {
      const app = currentApplications.find(a => a.id === id);
      if (!app) return;
      document.getElementById('detail-modal-body').innerHTML = \`
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <p><strong>Nomor Registrasi:</strong> <span class="font-mono text-blue-900">\${app.registrationNumber}</span></p>
          <p><strong>Nama Lengkap:</strong> \${app.fullName}</p>
          <p><strong>NIK:</strong> \${app.nik}</p>
          <p><strong>Jenis Kelamin:</strong> \${app.gender || '-'}</p>
          <p><strong>No. HP:</strong> \${app.phone}</p>
          <p><strong>Alamat:</strong> \${app.address}</p>
          <p><strong>Layanan:</strong> \${app.serviceTitle}</p>
          <p><strong>Status Saat Ini:</strong> <span class="font-bold">\${app.status}</span></p>
        </div>
        <div>
          <span class="font-bold block mb-1">Dokumen Persyaratan Terlampir:</span>
          <ul class="list-disc pl-5 space-y-1 text-slate-700">
            \${(app.documents || []).map(d => \`<li>\${d} (Terunggah & Terverifikasi)</li>\`).join('')}
          </ul>
        </div>
      \`;
      document.getElementById('modal-detail').classList.remove('hidden');
    }

    function updateStats() {
      const total = currentApplications.length;
      const diproses = currentApplications.filter(a => a.status === 'DIPROSES').length;
      const disetujui = currentApplications.filter(a => a.status === 'DISETUJUI').length;
      const ditolak = currentApplications.filter(a => a.status === 'DITOLAK').length;

      // User stats
      document.getElementById('stat-user-total').innerText = total;
      document.getElementById('stat-user-diproses').innerText = diproses;
      document.getElementById('stat-user-disetujui').innerText = disetujui;
      document.getElementById('stat-user-ditolak').innerText = ditolak;
      document.getElementById('user-app-count-badge').innerText = total;

      // Admin stats
      document.getElementById('admin-stat-total').innerText = total;
      document.getElementById('admin-stat-diproses').innerText = diproses;
      document.getElementById('admin-stat-disetujui').innerText = disetujui;
      document.getElementById('admin-stat-ditolak').innerText = ditolak;

      const navBadge = document.getElementById('nav-pending-badge');
      if (diproses > 0) {
        navBadge.innerText = diproses;
        navBadge.classList.remove('hidden');
      } else {
        navBadge.classList.add('hidden');
      }
    }

    function addSimulatedApplication() {
      const names = ['Dewi Anggraini', 'Bambang Pamungkas', 'Indah Permatasari', 'Rendra Prasetyo'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomNik = '320112' + Math.floor(1000000000 + Math.random() * 9000000000);
      const srv = SERVICES[Math.floor(Math.random() * SERVICES.length)];
      const code = srv.category === 'KTP-el' ? 'KTP' : srv.category === 'Kartu Keluarga' ? 'KK' : 'AKT';
      const reg = 'REG-2026-' + code + '-' + Math.floor(1000 + Math.random() * 9000);

      const newApp = {
        id: 'adm-' + Date.now(),
        registrationNumber: reg,
        serviceCategory: srv.category,
        serviceTitle: srv.title,
        fullName: randomName,
        nik: randomNik,
        phone: '0812-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
        gender: Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan',
        birthDate: '1998-05-12',
        address: 'Jl. Ahmad Yani No. ' + Math.floor(1 + Math.random() * 99) + ', Kabupaten Subang',
        documents: srv.docs,
        status: 'DIPROSES',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      currentApplications.unshift(newApp);
      saveData();
      updateStats();
      renderAdminTable();
      alert('Permohonan simulasi baru berhasil ditambahkan: ' + randomName);
    }

    function resetDataToDefault() {
      if (confirm('Kembalikan seluruh data ke data dummy awal?')) {
        currentApplications = [...INITIAL_DATA];
        saveData();
        updateStats();
        renderAdminTable();
        renderUserStatusList();
      }
    }

    // Initialize
    renderServices();
    updateStats();
    renderAdminTable();
  </script>
</body>
</html>`;
