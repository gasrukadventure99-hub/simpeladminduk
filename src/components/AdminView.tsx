import React, { useState, useMemo } from 'react';
import { ApplicationRecord, ApplicationStatus, UserAccount } from '../types';
import { 
  FileText, CheckCircle2, AlertTriangle, Clock, Search, 
  Filter, Eye, Check, X, Printer, Shield, ArrowUpDown, 
  RotateCcw, Plus, ChevronLeft, ChevronRight, UserCheck, MessageCircle,
  BarChart3, Layers, LogOut, Users, Edit3, Trash2, PlusCircle, KeyRound, Database
} from 'lucide-react';
import { UserManagementView } from './UserManagementView';
import { ApplicationEditModal } from './ApplicationEditModal';
import { ApplicationCreateModal } from './ApplicationCreateModal';
import { AdminChangePasswordView } from './AdminChangePasswordView';

interface AdminViewProps {
  applications: ApplicationRecord[];
  onOpenDetail: (app: ApplicationRecord) => void;
  onOpenStatusChange: (app: ApplicationRecord, targetStatus?: ApplicationStatus) => void;
  onOpenReceipt: (app: ApplicationRecord) => void;
  onResetMockData: () => void;
  onAddRandomMock: () => void;
  onOpenWhatsAppModal?: () => void;
  onOpenSupabaseModal?: () => void;
  isSupabaseActive?: boolean;
  onLogout: () => void;
  // User CRUD Props
  accounts: UserAccount[];
  currentUserId?: string;
  currentUser?: UserAccount;
  onCreateUser: (account: UserAccount) => void;
  onUpdateUser: (account: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  // Application CRUD Props
  onCreateApplication: (app: ApplicationRecord) => void;
  onUpdateApplication: (app: ApplicationRecord) => void;
  onDeleteApplication: (appId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  applications,
  onOpenDetail,
  onOpenStatusChange,
  onOpenReceipt,
  onResetMockData,
  onAddRandomMock,
  onOpenWhatsAppModal,
  onOpenSupabaseModal,
  isSupabaseActive = false,
  onLogout,
  accounts,
  currentUserId,
  currentUser,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
  onShowToast,
}) => {
  // Admin Sub-Menu Tabs: TABLE (Berkas), USER_CRUD (Tambah User CRUD), CHANGE_PASSWORD (Ganti Password), ANALYTICS
  const [activeAdminTab, setActiveAdminTab] = useState<'TABLE' | 'USER_CRUD' | 'CHANGE_PASSWORD' | 'ANALYTICS'>('TABLE');

  // Filters and Search for Applications
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Pagination for Applications
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Application CRUD Modals
  const [isCreateAppModalOpen, setIsCreateAppModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ApplicationRecord | null>(null);
  const [deleteTargetApp, setDeleteTargetApp] = useState<ApplicationRecord | null>(null);

  // Logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // KPI Analytics
  const stats = useMemo(() => {
    const total = applications.length;
    const diproses = applications.filter((a) => a.status === 'DIPROSES').length;
    const disetujui = applications.filter((a) => a.status === 'DISETUJUI').length;
    const ditolak = applications.filter((a) => a.status === 'DITOLAK').length;

    // Service Breakdown
    const ktpCount = applications.filter((a) => a.serviceCategory === 'KTP-el').length;
    const kkCount = applications.filter((a) => a.serviceCategory === 'Kartu Keluarga').length;
    const aktaCount = applications.filter((a) => a.serviceCategory === 'Akta Kelahiran').length;

    return {
      total,
      diproses,
      disetujui,
      ditolak,
      ktpCount,
      kkCount,
      aktaCount,
    };
  }, [applications]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return applications
      .filter((app) => {
        // Search
        const matchSearch =
          app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.nik.includes(searchTerm) ||
          app.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());

        // Category Filter
        const matchCategory =
          selectedCategory === 'ALL' || app.serviceCategory === selectedCategory;

        // Status Filter
        const matchStatus =
          selectedStatus === 'ALL' || app.status === selectedStatus;

        return matchSearch && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'NEWEST') {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        } else {
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        }
      });
  }, [applications, searchTerm, selectedCategory, selectedStatus, sortOrder]);

  // Paginated records
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Application Delete Handler
  const handleConfirmDeleteApp = () => {
    if (!deleteTargetApp) return;
    onDeleteApplication(deleteTargetApp.id);
    onShowToast(`Berkas registrasi ${deleteTargetApp.registrationNumber} berhasil dihapus.`, 'info');
    setDeleteTargetApp(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Top Header Banner with Role Info & LOGOUT BUTTON - MODERN CIVIC THEME */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border-2 border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500 text-white text-xs font-black border border-white mb-2 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-white" />
            Petugas Disdukcapil Subang • Simpel Adminduk
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Dashboard Simpel Adminduk Kabupaten Subang
          </h2>
          <p className="text-slate-100 text-xs sm:text-sm mt-1">
            Sistem Pelayanan Administrasi Kependudukan • Disdukcapil Kabupaten Subang: Validasi berkas persyaratan pemohon, kelola akun pengguna (CRUD), ubah status dengan alasan, serta pantau analitik pelayanan.
          </p>
        </div>

        {/* Action Tools & LOGOUT BUTTON */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* SUPABASE CLOUD DATABASE CONNECTION (KHUSUS ADMIN) */}
          {onOpenSupabaseModal && (
            <button
              id="btn-admin-supabase-config"
              onClick={onOpenSupabaseModal}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold border-2 border-white shadow-xs transition ${
                isSupabaseActive
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-blue-950/90 hover:bg-blue-900'
              }`}
              title="Pengaturan Koneksi Database Cloud Supabase (Khusus Role Admin)"
            >
              <Database className={`w-4 h-4 ${isSupabaseActive ? 'text-emerald-300' : 'text-amber-400'}`} />
              <span>Koneksi Supabase</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>
          )}

          {onOpenWhatsAppModal && (
            <button
              id="btn-admin-open-wa"
              onClick={onOpenWhatsAppModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white border-2 border-white text-xs font-bold shadow-xs transition"
              title="Buka Gateway & Log Notifikasi WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Gateway WA</span>
            </button>
          )}

          {/* Create New Application Button */}
          <button
            id="btn-admin-create-app"
            onClick={() => setIsCreateAppModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black border-2 border-white shadow-sm transition"
            title="Input permohonan baru secara manual oleh petugas"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Input Berkas</span>
          </button>

          <button
            id="btn-add-mock-app"
            onClick={onAddRandomMock}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/40 hover:border-white text-xs font-semibold transition"
            title="Tambah permohonan simulasi cepat"
          >
            <span>Simulasi Cepat</span>
          </button>

          <button
            id="btn-reset-mock-data"
            onClick={onResetMockData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/40 hover:border-white text-xs font-semibold transition"
            title="Reset data ke kondisi awal"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* QUICK GANTI PASSWORD SHORTCUT */}
          <button
            id="btn-quick-change-pass"
            onClick={() => setActiveAdminTab('CHANGE_PASSWORD')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition ${
              activeAdminTab === 'CHANGE_PASSWORD'
                ? 'bg-white text-blue-950 border-white shadow-sm font-black'
                : 'bg-blue-900/80 hover:bg-blue-800 text-white border-white/80'
            }`}
            title="Buka halaman ganti password admin"
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden md:inline">Ganti Password</span>
          </button>

          {/* DEDICATED LOG OUT BUTTON FOR ADMIN */}
          <button
            id="btn-admin-view-logout"
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold border-2 border-white shadow-md transition"
            title="Keluar dari akun admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </div>

      {/* QUICK KPI HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div 
          onClick={() => { setActiveAdminTab('TABLE'); setSelectedStatus('ALL'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-blue-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Masuk
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500 font-medium">Berkas</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            100% dari seluruh berkas yang tercatat
          </div>
        </div>

        {/* Diproses */}
        <div 
          onClick={() => { setActiveAdminTab('TABLE'); setSelectedStatus('DIPROSES'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-amber-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Menunggu / Diproses
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{stats.diproses}</span>
            <span className="text-xs text-amber-700/80 font-medium">Antrean Verifikasi</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {stats.total > 0 ? ((stats.diproses / stats.total) * 100).toFixed(0) : 0}% butuh tindakan petugas
          </div>
        </div>

        {/* Disetujui */}
        <div 
          onClick={() => { setActiveAdminTab('TABLE'); setSelectedStatus('DISETUJUI'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Telah Disetujui
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{stats.disetujui}</span>
            <span className="text-xs text-emerald-700/80 font-medium">Dokumen Terbit</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {stats.total > 0 ? ((stats.disetujui / stats.total) * 100).toFixed(0) : 0}% persentase disetujui
          </div>
        </div>

        {/* Ditolak */}
        <div 
          onClick={() => { setActiveAdminTab('TABLE'); setSelectedStatus('DITOLAK'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-rose-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Ditolak (Revisi)
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{stats.ditolak}</span>
            <span className="text-xs text-rose-700/80 font-medium">Perlu Revisi</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {stats.total > 0 ? ((stats.ditolak / stats.total) * 100).toFixed(0) : 0}% dengan catatan penolakan
          </div>
        </div>
      </div>

      {/* ROLE ADMIN NAVIGATION MENU TABS - MODERN CIVIC THEME WITH CRISP WHITE LIST */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-2xl border-2 border-white p-2.5 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          
          {/* Menu 1: Tabel Manajemen Berkas dengan CRUD Permohonan */}
          <button
            id="menu-admin-table"
            onClick={() => setActiveAdminTab('TABLE')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeAdminTab === 'TABLE'
                ? 'bg-white text-blue-950 border-2 border-white shadow-lg'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${activeAdminTab === 'TABLE' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span className="truncate">Tabel Berkas ({filteredRecords.length})</span>
          </button>

          {/* Menu 2: Tambah User (CRUD) */}
          <button
            id="menu-admin-user-crud"
            onClick={() => setActiveAdminTab('USER_CRUD')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeAdminTab === 'USER_CRUD'
                ? 'bg-white text-blue-950 border-2 border-white shadow-lg'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${activeAdminTab === 'USER_CRUD' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span className="truncate">Kelola User ({accounts.length})</span>
          </button>

          {/* Menu 3: Ganti Password Untuk Role Admin */}
          <button
            id="menu-admin-change-password"
            onClick={() => setActiveAdminTab('CHANGE_PASSWORD')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeAdminTab === 'CHANGE_PASSWORD'
                ? 'bg-white text-blue-950 border-2 border-white shadow-lg'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <KeyRound className={`w-4 h-4 shrink-0 ${activeAdminTab === 'CHANGE_PASSWORD' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span className="truncate">Ganti Password</span>
          </button>

          {/* Menu 4: Ringkasan Analitik Permohonan */}
          <button
            id="menu-admin-analytics"
            onClick={() => setActiveAdminTab('ANALYTICS')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeAdminTab === 'ANALYTICS'
                ? 'bg-white text-blue-950 border-2 border-white shadow-lg'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <BarChart3 className={`w-4 h-4 shrink-0 ${activeAdminTab === 'ANALYTICS' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span className="truncate">Analitik & SLA</span>
          </button>

          {/* Menu 5: Menu Log-Out untuk Role User Admin */}
          <button
            id="menu-admin-tab-logout"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-bold text-xs sm:text-sm text-rose-200 hover:bg-rose-900/60 hover:text-white border-2 border-rose-400/50 hover:border-rose-400 transition"
            title="Keluar dari akun admin"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-300" />
            <span className="truncate">Log Out Admin</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MENU 1: TABEL MANAJEMEN BERKAS (CRUD LENGKAP: CREATE, READ, UPDATE, DELETE)*/}
      {/* ========================================================================= */}
      {activeAdminTab === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Table Controls: Search, Filter & Tambah Berkas */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-slate-900">
                    Tabel Manajemen Berkas & Dokumen Persyaratan
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-black border border-orange-200">
                    CRUD Permohonan Aktif
                  </span>
                  {onOpenSupabaseModal && (
                    <button
                      onClick={onOpenSupabaseModal}
                      className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold border flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                        isSupabaseActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="Klik untuk membuka pengaturan koneksi Supabase (Khusus Admin)"
                    >
                      <Database className="w-3 h-3 text-emerald-600" />
                      <span>{isSupabaseActive ? 'Supabase Cloud: Terhubung' : 'Penyimpanan: Lokal (Atur Supabase)'}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola data pemohon (Create, Read, Update, Delete), verifikasi kelayakan berkas, dan ubah status pendaftaran.
                </p>
              </div>

              {/* Action Buttons: Tambah Permohonan Manual */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  id="btn-table-create-app"
                  onClick={() => setIsCreateAppModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-xs transition border-2 border-white"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Tambah Berkas (Create)</span>
                </button>

                {/* Search Input */}
                <div className="relative flex-1 md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="search-admin-input"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari NIK, Nama, No. Reg..."
                    className="w-full text-xs pl-9 pr-7 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              
              {/* Filter Kategori Layanan */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  Layanan:
                </span>
                <select
                  id="filter-category-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Semua Layanan Adminduk</option>
                  <option value="KTP-el">KTP-el</option>
                  <option value="Kartu Keluarga">Kartu Keluarga (KK)</option>
                  <option value="Akta Kelahiran">Akta Kelahiran</option>
                </select>
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  id="filter-status-select"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="DIPROSES">Diproses / Antrean</option>
                  <option value="DISETUJUI">Disetujui</option>
                  <option value="DITOLAK">Ditolak (Perlu Revisi)</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  Urutkan:
                </span>
                <button
                  onClick={() => setSortOrder(prev => prev === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
                  className="p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-medium"
                >
                  {sortOrder === 'NEWEST' ? 'Terbaru Dahulu' : 'Terlama Dahulu'}
                </button>
              </div>

            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">No. Registrasi</th>
                  <th className="py-3.5 px-4">Nama Pemohon & NIK</th>
                  <th className="py-3.5 px-4">Layanan Adminduk</th>
                  <th className="py-3.5 px-4">Dokumen</th>
                  <th className="py-3.5 px-4">Waktu Masuk</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi Verifikasi & CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Tidak ditemukan berkas pendaftaran yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/30 transition">
                      
                      {/* No Registrasi */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-950 whitespace-nowrap">
                        {app.registrationNumber}
                      </td>

                      {/* Nama & NIK */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="font-mono text-[11px] text-slate-500">NIK: {app.nik}</div>
                        <div className="text-[10px] text-slate-400">{app.phone}</div>
                      </td>

                      {/* Layanan */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[10px] border border-slate-200 mb-0.5">
                          {app.serviceCategory}
                        </span>
                        <div className="font-medium text-slate-800 max-w-xs truncate" title={app.serviceTitle}>
                          {app.serviceTitle}
                        </div>
                      </td>

                      {/* Dokumen Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          {app.documents.length} berkas
                        </span>
                      </td>

                      {/* Waktu Masuk */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <div>{app.submittedAt}</div>
                        <div className="text-[10px] text-slate-400">WIB</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {app.status === 'DISETUJUI' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            DISETUJUI
                          </span>
                        ) : app.status === 'DITOLAK' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            DITOLAK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            DIPROSES
                          </span>
                        )}
                      </td>

                      {/* Actions: READ (Tinjau/Resi), UPDATE (Edit/Setujui/Tolak), DELETE (Hapus) */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* 1. READ: Tinjau Detail */}
                          <button
                            id={`btn-detail-${app.id}`}
                            onClick={() => onOpenDetail(app)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition border border-blue-200 text-xs"
                            title="Peninjauan Detail Berkas Pemohon"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Tinjau</span>
                          </button>

                          {/* 2. UPDATE: Setujui */}
                          <button
                            id={`btn-approve-${app.id}`}
                            onClick={() => onOpenStatusChange(app, 'DISETUJUI')}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold transition border border-emerald-300 text-xs"
                            title="Setujui Permohonan Ini"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>

                          {/* 3. UPDATE: Tolak */}
                          <button
                            id={`btn-reject-${app.id}`}
                            onClick={() => onOpenStatusChange(app, 'DITOLAK')}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-semibold transition border border-rose-300 text-xs"
                            title="Tolak dengan Alasan Penolakan"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>

                          {/* 4. UPDATE: Edit Data Pemohon */}
                          <button
                            id={`btn-edit-app-${app.id}`}
                            onClick={() => setEditingApplication(app)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white transition border border-amber-200"
                            title="Edit Data Pemohon (Update)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. DELETE: Hapus Berkas */}
                          <button
                            id={`btn-delete-app-${app.id}`}
                            onClick={() => setDeleteTargetApp(app)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition border border-rose-200"
                            title="Hapus Berkas Permohonan (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 6. READ: Pratinjau & Cetak Resi */}
                          <button
                            id={`btn-receipt-${app.id}`}
                            onClick={() => onOpenReceipt(app)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition border border-blue-200"
                            title="Pratinjau & Cetak Resi Bukti Pendaftaran"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              Menampilkan halaman <strong className="text-slate-900">{currentPage}</strong> dari{' '}
              <strong className="text-slate-900">{totalPages}</strong> (Total {filteredRecords.length} Data)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    currentPage === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MENU 2: TAMBAH USER (CRUD)                                               */}
      {/* ========================================================================= */}
      {activeAdminTab === 'USER_CRUD' && (
        <UserManagementView
          accounts={accounts}
          currentUserId={currentUserId}
          onCreateUser={onCreateUser}
          onUpdateUser={onUpdateUser}
          onDeleteUser={onDeleteUser}
          onShowToast={onShowToast}
        />
      )}

      {/* ========================================================================= */}
      {/* MENU 3: GANTI PASSWORD UNTUK ROLE ADMIN                                  */}
      {/* ========================================================================= */}
      {activeAdminTab === 'CHANGE_PASSWORD' && (
        <AdminChangePasswordView
          currentUser={currentUser}
          onUpdateUser={onUpdateUser}
          onShowToast={onShowToast}
        />
      )}

      {/* ========================================================================= */}
      {/* MENU 4: RINGKASAN ANALITIK PERMOHONAN                                    */}
      {/* ========================================================================= */}
      {activeAdminTab === 'ANALYTICS' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Ringkasan Analitik & Efisiensi Pelayanan Adminduk</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statistik real-time beban kerja verifikator, persentase kelulusan berkas, dan distribusi permohonan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  SLA Verifikasi: &lt; 24 Jam
                </span>
              </div>
            </div>

            {/* Service Distribution Bars */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Distribusi Jenis Pelayanan Dokumen Kependudukan:
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">KTP-el (Baru & Penggantian)</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">{stats.ktpCount} Berkas</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.ktpCount / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    {stats.total > 0 ? ((stats.ktpCount / stats.total) * 100).toFixed(1) : 0}% dari total pengajuan
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">Kartu Keluarga (KK)</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">{stats.kkCount} Berkas</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.kkCount / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    {stats.total > 0 ? ((stats.kkCount / stats.total) * 100).toFixed(1) : 0}% dari total pengajuan
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">Kutipan Akta Kelahiran</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{stats.aktaCount} Berkas</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.aktaCount / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    {stats.total > 0 ? ((stats.aktaCount / stats.total) * 100).toFixed(1) : 0}% dari total pengajuan
                  </span>
                </div>

              </div>
            </div>

            {/* Performance Indicators & Verification Efficiency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
              
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-emerald-800 font-bold block mb-1">Rasio Persetujuan Berkas (Approval Rate)</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {stats.total > 0 ? ((stats.disetujui / stats.total) * 100).toFixed(1) : 0}%
                </span>
                <p className="text-[11px] text-emerald-600 mt-1">
                  {stats.disetujui} permohonan disetujui dan diterbitkan
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-rose-800 font-bold block mb-1">Rasio Penolakan / Revisi (Rejection Rate)</span>
                <span className="text-2xl font-black text-rose-700 font-mono">
                  {stats.total > 0 ? ((stats.ditolak / stats.total) * 100).toFixed(1) : 0}%
                </span>
                <p className="text-[11px] text-rose-600 mt-1">
                  {stats.ditolak} permohonan perlu perbaikan berkas
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-amber-800 font-bold block mb-1">Antrean Butuh Verifikasi Segera</span>
                <span className="text-2xl font-black text-amber-700 font-mono">
                  {stats.diproses} Berkas
                </span>
                <p className="text-[11px] text-amber-600 mt-1">
                  Menunggu peninjauan petugas verifikator
                </p>
              </div>

            </div>

            {/* Direct Quick Action to process pending files */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Ingin langsung memproses berkas yang sedang menunggu antrean?
              </span>
              <button
                onClick={() => {
                  setSelectedStatus('DIPROSES');
                  setActiveAdminTab('TABLE');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                <span>Buka Antrean Verifikasi ({stats.diproses})</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: CREATE APPLICATION, EDIT APPLICATION, DELETE CONFIRM, LOGOUT CONFIRM */}
      {/* ========================================================================= */}

      {/* 1. Create Application Modal (Admin Create) */}
      <ApplicationCreateModal
        isOpen={isCreateAppModalOpen}
        onClose={() => setIsCreateAppModalOpen(false)}
        onCreate={(newApp) => {
          onCreateApplication(newApp);
          onShowToast(`Berkas baru ${newApp.registrationNumber} atas nama ${newApp.fullName} berhasil dibuat!`, 'success');
        }}
      />

      {/* 2. Edit Application Modal (Admin Update) */}
      <ApplicationEditModal
        application={editingApplication}
        onClose={() => setEditingApplication(null)}
        onSave={(updated) => {
          onUpdateApplication(updated);
          onShowToast(`Data berkas ${updated.registrationNumber} berhasil diperbarui!`, 'success');
        }}
      />

      {/* 3. Delete Application Confirmation Modal (Admin Delete) */}
      {deleteTargetApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-bold text-base text-slate-900">
                  Konfirmasi Hapus Berkas Permohonan (Delete)
                </h3>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin menghapus berkas pendaftaran ini dari basis data?
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-mono font-bold text-blue-900">{deleteTargetApp.registrationNumber}</div>
                <div className="font-bold text-slate-800">{deleteTargetApp.fullName} (NIK: {deleteTargetApp.nik})</div>
                <div className="text-slate-500">{deleteTargetApp.serviceTitle}</div>
                <div className="text-[11px] text-slate-400">Status: {deleteTargetApp.status}</div>
              </div>
              <p className="text-[11px] text-rose-600 font-medium">
                Peringatan: Berkas dan dokumen lampiran akan dihapus secara permanen dari sistem.
              </p>
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteTargetApp(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 text-xs"
                >
                  Batalkan
                </button>
                <button
                  id="btn-confirm-delete-app"
                  onClick={handleConfirmDeleteApp}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Berkas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Logout Confirmation Modal for Admin */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-bold text-base text-slate-900">
                  Konfirmasi Log Out Admin
                </h3>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin keluar dari sesi kerja Petugas Admin Disdukcapil?
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 text-xs"
                >
                  Batal
                </button>
                <button
                  id="btn-confirm-logout-admin"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Ya, Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
