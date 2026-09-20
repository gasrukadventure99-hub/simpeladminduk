import React, { useState } from 'react';
import { UserAccount } from '../types';
import { 
  KeyRound, Lock, Eye, EyeOff, CheckCircle2, 
  AlertCircle, ShieldCheck, ShieldAlert, Check, 
  UserCheck, History, Info, RefreshCw
} from 'lucide-react';

interface AdminChangePasswordViewProps {
  currentUser?: UserAccount;
  onUpdateUser: (updatedAccount: UserAccount) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminChangePasswordView: React.FC<AdminChangePasswordViewProps> = ({
  currentUser,
  onUpdateUser,
  onShowToast,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  // Criteria validation
  const hasMinLength = newPassword.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isDifferentFromOld = newPassword.length > 0 && newPassword !== currentPassword;

  // Strength calculation
  const calculateStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (hasLetter && hasNumber) score += 1;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score += 1;
    return score; // 0 to 4
  };

  const strength = calculateStrength();
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentUser) {
      setErrorMessage('Sesi admin tidak ditemukan. Silakan login ulang.');
      return;
    }

    // 1. Validate Current Password
    const validCurrent = currentUser.password || 'admin';
    if (currentPassword !== validCurrent) {
      setErrorMessage('Kata sandi saat ini (lama) tidak sesuai! Harap periksa kembali.');
      return;
    }

    // 2. Validate New Password Length
    if (!hasMinLength) {
      setErrorMessage('Kata sandi baru minimal harus terdiri dari 6 karakter.');
      return;
    }

    // 3. Validate Difference
    if (newPassword === currentPassword) {
      setErrorMessage('Kata sandi baru tidak boleh sama persis dengan kata sandi lama.');
      return;
    }

    // 4. Validate Match
    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok dengan kata sandi baru.');
      return;
    }

    // Update account
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updatedAccount: UserAccount = {
      ...currentUser,
      password: newPassword,
    };

    onUpdateUser(updatedAccount);
    setLastUpdatedTime(nowStr);
    setSuccessMessage(`Kata sandi akun Admin (${currentUser.email}) berhasil diubah dan disimpan!`);
    onShowToast('Kata sandi admin berhasil diperbarui!', 'success');

    // Reset inputs
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Halaman Ganti Password Admin
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Role: Administrator / Petugas
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbarui kata sandi kredensial akun verifikator Adminduk untuk melindungi kerahasiaan data kependudukan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Keamanan Tingkat Tinggi (SIAK Ready)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Ganti Password */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Formulir Pembaruan Kata Sandi</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                Tanda (<span className="text-rose-500">*</span>) Wajib Diisi
              </span>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Gagal Memperbarui:</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Berhasil Diperbarui:</strong>
                  <span>{successMessage}</span>
                  {lastUpdatedTime && (
                    <span className="text-[11px] text-emerald-700 block mt-0.5">
                      Waktu Pembaruan: {lastUpdatedTime} WIB
                    </span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Field 1: Kata Sandi Lama */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi Lama / Saat Ini <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    id="input-current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi admin saat ini"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ketik kata sandi yang sedang aktif digunakan untuk verifikasi identitas Anda.
                </span>
              </div>

              <hr className="border-slate-100 my-2" />

              {/* Field 2: Kata Sandi Baru */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    id="input-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Buat kata sandi baru (minimal 6 karakter)"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Tingkat Kekuatan:</span>
                      <span className="font-bold text-slate-800">
                        {strengthLabels[strength]}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
                        style={{ width: `${Math.max(15, (strength / 4) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Field 3: Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ulangi Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    id="input-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru untuk konfirmasi"
                    className={`w-full p-2.5 pr-10 rounded-xl border ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-400 bg-rose-50/40'
                        : confirmPassword && passwordsMatch
                        ? 'border-emerald-400 bg-emerald-50/40'
                        : 'border-slate-300 bg-white'
                    } text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword && (
                  <div className="mt-1 text-[11px] flex items-center gap-1">
                    {passwordsMatch ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Kata sandi cocok
                      </span>
                    ) : (
                      <span className="text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Konfirmasi kata sandi belum sama
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Checklist Syarat Password */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-700 block">Kriteria Keamanan Kata Sandi:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                    <span>Minimal 6 karakter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLetter ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    {hasLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                    <span>Mengandung huruf (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                    <span>Mengandung angka (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isDifferentFromOld ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    {isDifferentFromOld ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                    <span>Berbeda dari sandi lama</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition"
                >
                  Batal / Reset
                </button>
                <button
                  type="submit"
                  id="btn-submit-change-password"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simpan Perubahan Kata Sandi</span>
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Right Column: Profil Admin & Kebijakan Keamanan */}
        <div className="space-y-6">
          
          {/* Admin Profile Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Identitas Akun Petugas Aktif</span>
            </h4>

            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-sm">
                  AD
                </div>
                <div>
                  <div className="font-bold text-xs">{currentUser?.fullName || 'Petugas Admin Dukcapil'}</div>
                  <div className="text-[10px] text-amber-300 font-mono">
                    NIP: {currentUser?.nip || '197805122005011004'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Email Login:</span>
                  <span className="text-white font-mono">{currentUser?.email || 'admin@dukcapil.go.id'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Unit Kerja:</span>
                  <span className="text-white">{currentUser?.department || 'Bidang Pelayanan Pendaftaran'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status Sesi:</span>
                  <span className="text-emerald-400 font-semibold">Aktif & Terotentikasi</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Terakhir aktif hari ini ({new Date().toISOString().split('T')[0]})</span>
            </div>
          </div>

          {/* Security Policy Card */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200/90 p-5 text-xs text-amber-950 space-y-3">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>SOP Keamanan Sandi Dinas</span>
            </h4>

            <ul className="space-y-2 text-[11px] leading-relaxed text-amber-900">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Rutin Diperbarui:</strong> Dianjurkan mengganti kata sandi admin secara berkala minimal 90 hari sekali.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Kerahasiaan Mutlak:</strong> Jangan pernah meminjamkan akun petugas atau membagikan kata sandi kepada orang lain.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Prosedur Log Out:</strong> Selalu klik tombol <em>Log Out Admin</em> ketika meninggalkan meja loket kerja.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Akses Data Sensitif:</strong> Aktivitas verifikasi dokumen kependudukan direkam dalam log audit sistem kependudukan.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
