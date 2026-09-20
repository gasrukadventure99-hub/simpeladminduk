import React, { useState, useMemo } from 'react';
import { UserAccount, UserRole } from '../types';
import { 
  Users, UserPlus, Search, Filter, Edit2, Trash2, Shield, 
  UserCheck, Key, Mail, Phone, MapPin, Building, Calendar, 
  CheckCircle2, AlertTriangle, X, ChevronLeft, ChevronRight, Eye, EyeOff
} from 'lucide-react';

interface UserManagementViewProps {
  accounts: UserAccount[];
  currentUserId?: string;
  onCreateUser: (account: UserAccount) => void;
  onUpdateUser: (account: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  accounts,
  currentUserId,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onShowToast,
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'PEMOHON'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<UserAccount | null>(null);

  // Form inputs state
  const [formRole, setFormRole] = useState<UserRole>('PEMOHON');
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDepartment, setFormDepartment] = useState('Seksi Pelayanan Dokumen Kependudukan');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Filtered & searched accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchRole = roleFilter === 'ALL' || acc.role === roleFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        acc.fullName.toLowerCase().includes(term) ||
        acc.email.toLowerCase().includes(term) ||
        acc.phone.includes(term) ||
        (acc.nik && acc.nik.includes(term)) ||
        (acc.nip && acc.nip.includes(term));

      return matchRole && matchSearch;
    });
  }, [accounts, roleFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage) || 1;
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  // Open Create Form
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormRole('PEMOHON');
    setFormFullName('');
    setFormEmail('');
    setFormPhone('');
    setFormPassword('');
    setFormNik('');
    setFormNip('');
    setFormAddress('');
    setFormDepartment('Seksi Pelayanan Dokumen Kependudukan');
    setFormErrors({});
    setShowPassword(false);
    setIsFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormRole(user.role);
    setFormFullName(user.fullName);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormPassword(user.password || '');
    setFormNik(user.nik || '');
    setFormNip(user.nip || '');
    setFormAddress(user.address || '');
    setFormDepartment(user.department || 'Seksi Pelayanan Dokumen Kependudukan');
    setFormErrors({});
    setShowPassword(false);
    setIsFormModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formFullName.trim()) {
      errors.fullName = 'Nama lengkap wajib diisi.';
    }

    if (!formEmail.trim()) {
      errors.email = 'Alamat email wajib diisi.';
    } else if (!/^\S+@\S+\.\S+$/.test(formEmail)) {
      errors.email = 'Format email tidak valid.';
    }

    if (!formPhone.trim()) {
      errors.phone = 'Nomor HP/WhatsApp wajib diisi.';
    }

    if (!editingUser && !formPassword.trim()) {
      errors.password = 'Kata sandi akun wajib diisi.';
    }

    if (formRole === 'PEMOHON') {
      if (!formNik.trim()) {
        errors.nik = 'NIK 16 digit wajib diisi untuk pemohon.';
      } else if (formNik.length !== 16 || !/^\d+$/.test(formNik)) {
        errors.nik = 'NIK harus berupa 16 digit angka.';
      }
    } else if (formRole === 'ADMIN') {
      if (!formNip.trim()) {
        errors.nip = 'NIP wajib diisi untuk akun petugas admin.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Form (Create or Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      // Update existing
      const updated: UserAccount = {
        ...editingUser,
        role: formRole,
        fullName: formFullName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        password: formPassword.trim() || editingUser.password,
        nik: formRole === 'PEMOHON' ? formNik.trim() : undefined,
        address: formRole === 'PEMOHON' ? formAddress.trim() : undefined,
        nip: formRole === 'ADMIN' ? formNip.trim() : undefined,
        department: formRole === 'ADMIN' ? formDepartment.trim() : undefined,
      };

      onUpdateUser(updated);
      onShowToast(`Akun ${updated.fullName} (${updated.role}) berhasil diperbarui!`, 'success');
    } else {
      // Create new
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        role: formRole,
        fullName: formFullName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        password: formPassword.trim() || 'password123',
        nik: formRole === 'PEMOHON' ? formNik.trim() : undefined,
        address: formRole === 'PEMOHON' ? formAddress.trim() : undefined,
        nip: formRole === 'ADMIN' ? formNip.trim() : undefined,
        department: formRole === 'ADMIN' ? formDepartment.trim() : undefined,
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      onCreateUser(newUser);
      onShowToast(`Akun baru ${newUser.fullName} (${newUser.role}) berhasil ditambahkan!`, 'success');
    }

    setIsFormModalOpen(false);
  };

  // Execute Delete
  const handleConfirmDelete = () => {
    if (!deleteTargetUser) return;

    if (deleteTargetUser.id === currentUserId) {
      onShowToast('Anda tidak dapat menghapus akun admin Anda sendiri yang sedang aktif digunakan!', 'error');
      setDeleteTargetUser(null);
      return;
    }

    onDeleteUser(deleteTargetUser.id);
    onShowToast(`Akun ${deleteTargetUser.fullName} telah berhasil dihapus dari sistem.`, 'info');
    setDeleteTargetUser(null);
  };

  const totalAdmins = accounts.filter(a => a.role === 'ADMIN').length;
  const totalPemohons = accounts.filter(a => a.role === 'PEMOHON').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 mb-2">
            <Users className="w-3.5 h-3.5" />
            Manajemen Pengguna & Otoritas Sistem (CRUD)
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Tambah User & Kelola Akun Pengguna (CRUD)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fitur Create, Read, Update, dan Delete untuk mengelola akun Pemohon (Warga) dan Akun Petugas Disdukcapil (Admin).
          </p>
        </div>

        {/* Primary Action Button: Tambah User Baru */}
        <button
          id="btn-add-user-modal"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah User Baru</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Pengguna</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{accounts.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Seluruh akun terdaftar di sistem</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase">
            <span>Petugas Admin</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">{totalAdmins}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Memiliki hak akses verifikasi & approval</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase">
            <span>Pemohon (Warga)</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{totalPemohons}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Akun masyarakat untuk pengajuan permohonan</div>
        </div>
      </div>

      {/* User Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Search & Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-user-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama, Email, NIK, NIP, atau No HP..."
              className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              Role:
            </span>
            <select
              id="filter-user-role-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="p-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Role ({accounts.length})</option>
              <option value="ADMIN">Petugas Admin ({totalAdmins})</option>
              <option value="PEMOHON">Pemohon / Warga ({totalPemohons})</option>
            </select>
          </div>

        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & Kontak</th>
                <th className="py-3 px-4">Role Pengguna</th>
                <th className="py-3 px-4">Nomor Identitas (NIK / NIP)</th>
                <th className="py-3 px-4">Alamat / Departemen</th>
                <th className="py-3 px-4">Terdaftar Sejak</th>
                <th className="py-3 px-4 text-center">Aksi (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ditemukan data pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((user) => {
                  const isCurrentUser = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition">
                      
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{user.fullName}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {user.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Shield className="w-3 h-3 text-amber-700" />
                            PETUGAS ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            <UserCheck className="w-3 h-3 text-blue-600" />
                            PEMOHON (WARGA)
                          </span>
                        )}
                      </td>

                      {/* Identity NIK/NIP */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {user.role === 'ADMIN' ? (
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">NIP Pegawai</div>
                            <div className="font-mono font-bold text-slate-800">{user.nip || '-'}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">NIK Kependudukan</div>
                            <div className="font-mono font-bold text-slate-800">{user.nik || '-'}</div>
                          </div>
                        )}
                      </td>

                      {/* Address / Department */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 text-xs max-w-xs truncate" title={user.address || user.department}>
                          {user.role === 'ADMIN' ? (
                            <span className="flex items-center gap-1 text-slate-700">
                              <Building className="w-3 h-3 text-slate-400 shrink-0" />
                              {user.department || 'Dinas Kependudukan dan Pencatatan Sipil'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {user.address || 'Alamat belum diatur'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{user.registeredAt}</span>
                        </div>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* Edit User Button */}
                          <button
                            id={`btn-edit-user-${user.id}`}
                            onClick={() => handleOpenEditModal(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold transition border border-slate-200 text-xs"
                            title="Edit / Update Data Pengguna"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete User Button */}
                          <button
                            id={`btn-delete-user-${user.id}`}
                            onClick={() => setDeleteTargetUser(user)}
                            disabled={isCurrentUser}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition border text-xs ${
                              isCurrentUser
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border-rose-200'
                            }`}
                            title={isCurrentUser ? 'Tidak dapat menghapus akun Anda sendiri' : 'Hapus Pengguna'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <div>
            Menampilkan halaman <strong className="text-slate-900">{currentPage}</strong> dari{' '}
            <strong className="text-slate-900">{totalPages}</strong> (Total {filteredAccounts.length} Akun)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT USER MODAL                                        */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
                  {editingUser ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    {editingUser ? 'EDIT / UPDATE PENGGUNA (CRUD)' : 'TAMBAH USER BARU (CRUD)'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingUser
                      ? `Perbarui informasi data akun ${editingUser.fullName}`
                      : 'Buat akun pemohon atau akun petugas admin baru'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveUser} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Role Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Pilih Role Akun Pengguna <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormRole('PEMOHON')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                      formRole === 'PEMOHON'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <UserCheck className={`w-4 h-4 mt-0.5 ${formRole === 'PEMOHON' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold">Pemohon (Masyarakat)</div>
                      <div className="text-[11px] text-slate-500">Akses formulir pengajuan berkas online</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormRole('ADMIN')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                      formRole === 'ADMIN'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Shield className={`w-4 h-4 mt-0.5 ${formRole === 'ADMIN' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold">Petugas Admin</div>
                      <div className="text-[11px] text-slate-500">Akses verifikasi berkas & analitik</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="form-user-name"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Kom"
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    formErrors.fullName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {formErrors.fullName && (
                  <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.fullName}</span>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="form-user-email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      formErrors.email ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    No. WhatsApp / HP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="form-user-phone"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      formErrors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kata Sandi (Password) {editingUser ? '(Kosongkan jika tidak diubah)' : <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="form-user-password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? 'Biarkan kosong jika tetap' : 'Masukkan password akun...'}
                    className={`w-full p-2.5 pr-10 rounded-xl border text-xs ${
                      formErrors.password ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.password}</span>
                )}
              </div>

              {/* Role Conditional Fields */}
              {formRole === 'PEMOHON' ? (
                <div className="space-y-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="font-bold text-blue-900">Informasi Kependudukan Pemohon</div>
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nomor Induk Kependudukan (NIK) 16 Digit <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      id="form-user-nik"
                      value={formNik}
                      onChange={(e) => setFormNik(e.target.value.replace(/\D/g, ''))}
                      placeholder="16 digit NIK..."
                      className={`w-full p-2.5 rounded-xl border font-mono text-xs ${
                        formErrors.nik ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.nik && (
                      <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.nik}</span>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alamat Domisili KTP</label>
                    <textarea
                      rows={2}
                      id="form-user-address"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Alamat lengkap, RT/RW, Kelurahan, Kecamatan..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
                  <div className="font-bold text-amber-900">Informasi Kepegawaian Petugas Admin</div>
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nomor Induk Pegawai (NIP) 18 Digit <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-user-nip"
                      value={formNip}
                      onChange={(e) => setFormNip(e.target.value)}
                      placeholder="Contoh: 198501012010011002"
                      className={`w-full p-2.5 rounded-xl border font-mono text-xs ${
                        formErrors.nip ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.nip && (
                      <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.nip}</span>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Departemen / Seksi Penugasan</label>
                    <input
                      type="text"
                      id="form-user-dept"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      placeholder="Contoh: Seksi Pelayanan Dokumen Kependudukan"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  id="btn-submit-user"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Tambahkan Pengguna'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM DELETE USER MODAL                                       */}
      {/* ========================================================================= */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-bold text-base text-slate-900">
                  Konfirmasi Hapus Pengguna (Delete)
                </h3>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin menghapus akun pengguna berikut dari basis data sistem?
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{deleteTargetUser.fullName}</div>
                <div className="text-slate-500">Email: {deleteTargetUser.email}</div>
                <div className="text-slate-500">Role: <span className="font-semibold">{deleteTargetUser.role}</span></div>
                {deleteTargetUser.nik && <div className="font-mono text-slate-500">NIK: {deleteTargetUser.nik}</div>}
                {deleteTargetUser.nip && <div className="font-mono text-slate-500">NIP: {deleteTargetUser.nip}</div>}
              </div>

              <p className="text-[11px] text-rose-600 font-medium">
                Peringatan: Tindakan ini tidak dapat dibatalkan. Pengguna ini tidak akan bisa login lagi ke portal.
              </p>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteTargetUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 text-xs"
                >
                  Batalkan
                </button>
                <button
                  id="btn-confirm-delete-user"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Akun</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
