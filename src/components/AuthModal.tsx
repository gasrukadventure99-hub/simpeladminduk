import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { 
  X, User, ShieldCheck, UserPlus, LogIn, Lock, 
  Phone, Mail, MapPin, Eye, EyeOff, CheckCircle2, 
  AlertCircle, Sparkles, Building2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'LOGIN_PEMOHON' | 'LOGIN_ADMIN' | 'REGISTER_PEMOHON';
  onClose: () => void;
  onLoginSuccess: (account: UserAccount) => void;
  onRegisterSuccess: (newAccount: UserAccount) => void;
  accounts: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'LOGIN_PEMOHON',
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
  accounts
}) => {
  const [mode, setMode] = useState<'LOGIN_PEMOHON' | 'LOGIN_ADMIN' | 'REGISTER_PEMOHON'>(initialMode);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register State
  const [regNik, setRegNik] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetRole: UserRole = mode === 'LOGIN_ADMIN' ? 'ADMIN' : 'PEMOHON';
    
    // Find matching account
    const found = accounts.find(acc => {
      if (acc.role !== targetRole) return false;
      const matchId = 
        acc.email.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
        (acc.nik && acc.nik === loginIdentifier.trim()) ||
        (acc.nip && acc.nip === loginIdentifier.trim());
      
      const matchPass = acc.password === loginPassword.trim();
      return matchId && matchPass;
    });

    if (found) {
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMessage(
        mode === 'LOGIN_ADMIN'
          ? 'Email/NIP atau kata sandi petugas tidak sesuai. Silakan periksa kembali kredensial Anda.'
          : 'NIK/Email atau kata sandi pemohon salah. Pastikan Anda telah mendaftar.'
      );
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (regNik.length !== 16 || !/^\d+$/.test(regNik)) {
      setErrorMessage('NIK harus tepat 16 digit angka kependudukan!');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter!');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    // Check existing NIK
    const existing = accounts.find(a => a.nik === regNik || a.email.toLowerCase() === regEmail.toLowerCase());
    if (existing) {
      setErrorMessage('NIK atau Email ini sudah terdaftar sebelumnya! Silakan login.');
      return;
    }

    const newAccount: UserAccount = {
      id: `user-${Date.now()}`,
      role: 'PEMOHON',
      nik: regNik,
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      password: regPassword,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onRegisterSuccess(newAccount);
    onLoginSuccess(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Civic Blue and Orange Accent */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white shadow-inner">
              <Building2 className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  PORTAL SIMPEL ADMINDUK
                </h3>
                <span className="text-[10px] px-2 py-0.5 font-bold bg-orange-500 text-white rounded-full">
                  SUBANG
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Sistem Pelayanan Administrasi Kependudukan • Disdukcapil Kab. Subang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher with Modern Civic Light Gray Bar */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN_PEMOHON');
              setErrorMessage(null);
            }}
            className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'LOGIN_PEMOHON'
                ? 'bg-white text-blue-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className={`w-3.5 h-3.5 ${mode === 'LOGIN_PEMOHON' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Login Pemohon</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('REGISTER_PEMOHON');
              setErrorMessage(null);
            }}
            className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'REGISTER_PEMOHON'
                ? 'bg-white text-blue-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserPlus className={`w-3.5 h-3.5 ${mode === 'REGISTER_PEMOHON' ? 'text-orange-500' : 'text-slate-400'}`} />
            <span>Daftar Akun</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('LOGIN_ADMIN');
              setErrorMessage(null);
            }}
            className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'LOGIN_ADMIN'
                ? 'bg-white text-blue-900 border border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${mode === 'LOGIN_ADMIN' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Login Petugas</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          
          {/* 1. LOGIN FORM (PEMOHON or ADMIN) */}
          {(mode === 'LOGIN_PEMOHON' || mode === 'LOGIN_ADMIN') && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">
                  {mode === 'LOGIN_ADMIN' ? '🔐 Akses Internal Petugas Adminduk' : '👤 Akses Mandiri Masyarakat Pemohon'}
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {mode === 'LOGIN_ADMIN' 
                    ? 'Halaman ini khusus untuk verifikator dan operator resmi Disdukcapil untuk meneliti berkas masyarakat.'
                    : 'Masuk dengan NIK atau Email terdaftar Anda untuk mengajukan berkas dan menerima notifikasi WhatsApp.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {mode === 'LOGIN_ADMIN' ? 'Email Petugas / NIP *' : 'Nomor Induk Kependudukan (NIK) / Email *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={mode === 'LOGIN_ADMIN' ? 'admin@dukcapil.subang.go.id atau NIP' : '16 Digit NIK KTP atau email'}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition flex items-center justify-center gap-2 mt-2 border-2 border-white"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk ke {mode === 'LOGIN_ADMIN' ? 'Portal Petugas' : 'Dashboard Pemohon'}</span>
              </button>

              {mode === 'LOGIN_PEMOHON' && (
                <div className="text-center pt-2">
                  <span className="text-slate-500">Belum memiliki akun terdaftar? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('REGISTER_PEMOHON');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-blue-700 hover:underline"
                  >
                    Daftar Akun Baru Sekarang
                  </button>
                </div>
              )}

            </form>
          )}

          {/* 2. REGISTRATION FORM (PEMOHON) */}
          {mode === 'REGISTER_PEMOHON' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs max-h-[65vh] overflow-y-auto pr-1">
              
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <span className="font-semibold text-blue-950 block">📝 Formulir Pendaftaran Akun Pemohon Adminduk</span>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  Daftarkan identitas Anda untuk mengajukan KTP-el, KK, dan Akta Kelahiran serta menerima notifikasi WhatsApp resmi.
                </p>
              </div>

              {/* NIK */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  required
                  value={regNik}
                  onChange={(e) => setRegNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="16 digit sesuai Kartu Keluarga (KK)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">{regNik.length}/16 digit</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Sesuai Akta Kelahiran / KK"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Contoh: 081234567890 (Untuk notifikasi status)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
                  ✓ Sistem akan mengirimkan konfirmasi & resi langsung ke WhatsApp ini.
                </span>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat Email Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat Domisili KTP
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Jl. Nama Jalan, RT/RW, Kelurahan, Kecamatan"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Konfirmasi Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Register */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md transition flex items-center justify-center gap-2 mt-4 border-2 border-white"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Daftar Akun Pemohon & Masuk</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-500">Sudah memiliki akun? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN_PEMOHON');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-700 hover:underline"
                >
                  Masuk ke Akun Anda
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
