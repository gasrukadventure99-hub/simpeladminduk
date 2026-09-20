import React, { useState } from 'react';
import { ApplicationRecord } from '../types';
import { 
  Building2, UserPlus, LogIn, Shield, Search, 
  FileCheck, Clock, CheckCircle2, MessageCircle, 
  ArrowRight, Sparkles, HelpCircle, PhoneCall
} from 'lucide-react';

interface PublicLandingProps {
  onOpenLogin: (mode: 'LOGIN_PEMOHON' | 'LOGIN_ADMIN' | 'REGISTER_PEMOHON') => void;
  applications: ApplicationRecord[];
  onOpenReceipt: (app: ApplicationRecord) => void;
  onOpenDetail: (app: ApplicationRecord) => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onOpenLogin,
  applications,
  onOpenReceipt,
  onOpenDetail
}) => {
  const [trackingQuery, setTrackingQuery] = useState('');
  const [searchResult, setSearchResult] = useState<ApplicationRecord | null | 'NOT_FOUND'>(null);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingQuery.trim().toLowerCase();
    if (!query) return;

    const found = applications.find(
      (a) => a.registrationNumber.toLowerCase() === query || a.nik === query
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult('NOT_FOUND');
    }
  };

  return (
    <div className="space-y-10 pb-8">
      
      {/* Hero Banner with Modern Blue, White, & Biru Muda Secondary Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl border-2 border-white">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500 text-white text-xs font-black border border-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Simpel Adminduk • Layanan Mandiri 24 Jam Disdukcapil Kab. Subang
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Simpel Adminduk
            <span className="block text-xl sm:text-2xl lg:text-3xl text-sky-300 font-semibold mt-1">
              Sistem Pelayanan Administrasi Kependudukan Kabupaten Subang
            </span>
          </h1>

          <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
            Melalui <strong>Simpel Adminduk</strong>, Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) Kabupaten Subang menyediakan layanan pengajuan KTP-el, Kartu Keluarga, dan Akta Kelahiran secara mandiri dari rumah tanpa antre. Pantau perkembangan berkas dan terima notifikasi resmi langsung melalui WhatsApp.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              id="hero-btn-register"
              onClick={() => onOpenLogin('REGISTER_PEMOHON')}
              className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm border-2 border-white shadow-xl transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Daftar Akun Pemohon Baru</span>
            </button>

            <button
              id="hero-btn-login"
              onClick={() => onOpenLogin('LOGIN_PEMOHON')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-950 font-black text-xs sm:text-sm border-2 border-white transition flex items-center gap-2 shadow-md"
            >
              <LogIn className="w-4 h-4 text-blue-900" />
              <span>Masuk ke Akun Pemohon</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic element */}
        <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden md:block">
          <Building2 className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Quick Tracking Tool with Modern Light Gray & Blue Frame */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white border-2 border-white flex items-center justify-center font-bold shadow-xs">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-blue-950">
              Lacak Cepat Status Permohonan Anda (Kabupaten Subang)
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan Nomor Registrasi (contoh: REG-2026-KTP-4819) atau 16 Digit NIK Anda
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={trackingQuery}
              onChange={(e) => {
                setTrackingQuery(e.target.value);
                setSearchResult(null);
              }}
              placeholder="Ketik Nomor Registrasi atau NIK..."
              className="w-full p-3 rounded-xl border-2 border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white border-2 border-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4 text-white" />
            <span>Cari Status Berkas</span>
          </button>
        </form>

        {/* Tracking result */}
        {searchResult === 'NOT_FOUND' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs text-center">
            Berkas dengan nomor registrasi / NIK tersebut tidak ditemukan. Pastikan data yang dimasukkan benar.
          </div>
        )}

        {searchResult && searchResult !== 'NOT_FOUND' && (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200 pb-3">
              <div>
                <span className="font-mono text-blue-900 font-bold text-xs">
                  {searchResult.registrationNumber}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{searchResult.serviceTitle}</h4>
                <p className="text-slate-600 text-xs">
                  Pemohon: {searchResult.fullName} (NIK: {searchResult.nik})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  searchResult.status === 'DISETUJUI'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchResult.status === 'DITOLAK'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-sky-100 text-sky-800 border border-sky-200'
                }`}>
                  {searchResult.status === 'DISETUJUI' ? 'DISETUJUI' : searchResult.status === 'DITOLAK' ? 'DITOLAK / REVISI' : 'SEDANG DIPROSES'}
                </span>

                <button
                  onClick={() => onOpenReceipt(searchResult)}
                  className="px-3 py-1 rounded-lg bg-white border border-blue-300 text-blue-700 font-bold hover:bg-blue-50"
                >
                  Lihat Resi
                </button>
              </div>
            </div>

            {searchResult.status === 'DITOLAK' && searchResult.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg">
                <strong>Catatan Perbaikan:</strong> {searchResult.rejectionReason}
              </div>
            )}

            {searchResult.status === 'DISETUJUI' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg">
                <strong>Status Pengambilan:</strong> {searchResult.approvalNotes || 'Berkas telah divalidasi dan siap diambil.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Core Services Info Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Layanan Administrasi Kependudukan Utama
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pilih layanan yang Anda perlukan dan ajukan langsung secara online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: KTP-el */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 shadow-md flex flex-col justify-between hover:shadow-xl transition group">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase tracking-wide inline-block">
                Identitas Kependudukan
              </span>
              <h3 className="font-black text-lg text-blue-950 group-hover:text-blue-700 transition">
                Perekaman & Penggantian KTP-el
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembuatan KTP-el baru bagi pemula usia 17 tahun, penggantian KTP-el rusak, atau penerbitan ulang karena hilang di wilayah Kabupaten Subang.
              </p>
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cukup upload KK asli & Pas foto</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Notifikasi WhatsApp saat fisik selesai cetak</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenLogin('LOGIN_PEMOHON')}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 group-hover:bg-sky-500 text-white border-2 border-white font-black text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Ajukan KTP-el</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Kartu Keluarga (KK) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 shadow-md flex flex-col justify-between hover:shadow-xl transition group">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase tracking-wide inline-block">
                Data Keluarga
              </span>
              <h3 className="font-black text-blue-950 text-lg group-hover:text-blue-700 transition">
                Kartu Keluarga (KK) Baru & Perubahan Data
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembuatan KK baru untuk pengantin baru, pemecahan KK orang tua, penambahan anggota keluarga, atau pembetulan elemen data warga Subang.
              </p>
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Format digital PDF ber-Tanda Tangan Elektronik (TTE)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Validasi cepat tanpa biaya (Gratis Rp 0,-)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenLogin('LOGIN_PEMOHON')}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 group-hover:bg-sky-500 text-white border-2 border-white font-black text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Ajukan Kartu Keluarga</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Akta Kelahiran */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 shadow-md flex flex-col justify-between hover:shadow-xl transition group">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase tracking-wide inline-block">
                Pencatatan Sipil
              </span>
              <h3 className="font-black text-blue-950 text-lg group-hover:text-blue-700 transition">
                Penerbitan Kutipan Akta Kelahiran
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencatatan kelahiran anak baru lahir di Kabupaten Subang sekaligus penerbitan NIK bayi dan pembaruan dokumen KK secara terintegrasi 3-in-1.
              </p>
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lampiran Surat Lahir Faskes/Bidan & Buku Nikah</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Terbit Akta Lahir & KK Baru bersamaan</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenLogin('LOGIN_PEMOHON')}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 group-hover:bg-sky-500 text-white border-2 border-white font-black text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Ajukan Akta Kelahiran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Official Officer Access Note */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Akses Khusus Petugas Disdukcapil Kabupaten Subang:</span>
        </div>
        <button
          onClick={() => onOpenLogin('LOGIN_ADMIN')}
          className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-black text-xs border border-white transition shadow-xs"
        >
          Masuk ke Portal Petugas (Admin)
        </button>
      </div>

    </div>
  );
};
