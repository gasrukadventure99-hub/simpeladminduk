import React, { useState, useEffect } from 'react';
import { 
  Database, CheckCircle2, AlertTriangle, RefreshCw, 
  ExternalLink, KeyRound, Globe, Copy, Check, X, ShieldCheck, ArrowRight, HardDriveDownload
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  setSupabaseConfig, 
  isSupabaseConfigured, 
  testSupabaseConnection,
  syncAllLocalDataToSupabase
} from '../lib/supabase';
import { ApplicationRecord, UserAccount, WhatsAppNotification } from '../types';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationRecord[];
  accounts: UserAccount[];
  notifications: WhatsAppNotification[];
  onConnectionSuccess: (message: string) => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  applications,
  accounts,
  notifications,
  onConnectionSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setIsConnected(isSupabaseConfigured());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Mohon isi Project URL dan Anon/Public API Key terlebih dahulu.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url, anonKey);
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      setSupabaseConfig(url, anonKey);
      setIsConnected(true);
      onConnectionSuccess('Berhasil terhubung ke Supabase PostgreSQL! Data kini tersinkronisasi permanen.');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Apakah Anda yakin ingin memutuskan koneksi Supabase dan kembali ke penyimpanan lokal?')) {
      setSupabaseConfig('', '');
      setUrl('');
      setAnonKey('');
      setIsConnected(false);
      setTestResult({
        success: true,
        message: 'Koneksi Supabase telah diputus. Aplikasi kini beroperasi dalam mode penyimpanan lokal.',
      });
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await syncAllLocalDataToSupabase(applications, accounts, notifications);
      setIsSyncing(false);
      if (res.success) {
        onConnectionSuccess(`Sinkronisasi selesai! ${res.appsCount} berkas permohonan dan ${res.accountsCount} akun berhasil diunggah ke Supabase.`);
      }
    } catch (err) {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between border-b-2 border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/90 border border-white/30 flex items-center justify-center text-white shadow-xs">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Koneksi Database Cloud Supabase</h2>
              <p className="text-xs text-blue-200">Integrasi PostgreSQL Permanen & Sinkronisasi Realtime</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isConnected
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs sm:text-sm">
              <div className="font-bold flex items-center gap-2">
                <span>Status Saat Ini:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isConnected ? 'Terhubung (Cloud PostgreSQL)' : 'Penyimpanan Lokal'}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-90 leading-relaxed">
                {isConnected
                  ? 'Aplikasi terhubung ke database cloud Supabase. Semua permohonan baru, update verifikasi petugas, dan notifikasi WA tersimpan permanen dan tidak akan hilang saat komputer dimatikan.'
                  : 'Aplikasi saat ini menyimpan data di peramban (localStorage). Hubungkan Supabase Anda di bawah ini agar data tersimpan permanen di cloud dan bisa diakses bersamaan dari multi-perangkat.'}
              </p>
            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleTestAndConnect} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Supabase Project URL</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Ditemukan di Supabase: <strong>Project Settings $\rightarrow$ API $\rightarrow$ Project URL</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Supabase API Key (anon / public)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Ditemukan di Supabase: <strong>Project Settings $\rightarrow$ API $\rightarrow$ Project API Keys (`anon` `public`)</strong>
              </span>
            </div>

            {/* Test Connection Result Alert */}
            {testResult && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                testResult.success 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">{testResult.message}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {isConnected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
                  >
                    Putuskan Koneksi
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {isConnected && (
                  <button
                    type="button"
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition shadow-xs"
                    title="Upload semua permohonan lokal ke Supabase"
                  >
                    <HardDriveDownload className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <span>{isSyncing ? 'Mengunggah...' : 'Upload Data Lokal ke Cloud'}</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isTesting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menguji Koneksi...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>{isConnected ? 'Perbarui & Simpan Koneksi' : 'Tes & Hubungkan Sekarang'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Helper Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span>Langkah Cepat di Supabase:</span>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Buka Dashboard Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed text-[11px] sm:text-xs">
              <li>Buka proyek Anda di <strong>supabase.com</strong>.</li>
              <li>Pastikan skrip <code>supabase_schema.sql</code> sudah dijalankan di menu <strong>SQL Editor</strong>.</li>
              <li>Buka menu <strong>Project Settings</strong> (ikon gerigi di kiri bawah) $\rightarrow$ pilih <strong>API</strong>.</li>
              <li>Salin <strong>Project URL</strong> dan kunci <strong>anon public</strong> ke formulir di atas, lalu klik <strong>Tes & Hubungkan Sekarang</strong>.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
