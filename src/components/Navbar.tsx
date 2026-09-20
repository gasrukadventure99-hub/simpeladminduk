import React from 'react';
import { UserAccount } from '../types';
import { Building2, MessageCircle, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentUser: UserAccount | null;
  onOpenLogin?: (mode?: 'LOGIN_PEMOHON' | 'LOGIN_ADMIN' | 'REGISTER_PEMOHON') => void;
  onLogout: () => void;
  onOpenWhatsAppModal: () => void;
  pendingCount?: number;
  waUnreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenWhatsAppModal,
  waUnreadCount
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white border-b-2 border-white/20 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      
      {/* Government Identification Ribbon with Modern Blue, White, and Orange Secondary Accent */}
      <div className="bg-blue-950 text-blue-100 text-xs px-4 py-1.5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="font-semibold tracking-wide text-white text-[11px] sm:text-xs">
              PEMERINTAH KABUPATEN SUBANG • SIMPEL ADMINDUK (SISTEM PELAYANAN ADMINISTRASI KEPENDUDUKAN)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-200 text-[11px]">
            <span>Call Center: 1500537</span>
            <span className="text-white/40">•</span>
            <span className="text-white font-bold bg-sky-500 px-2.5 py-0.5 rounded-full border border-white/30 text-[10px] shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Layanan Online 24 Jam
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md border-2 border-white text-white shrink-0 relative">
                <Building2 className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-sky-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    SIMPEL ADMINDUK
                    <span className="text-[10px] px-2.5 py-0.5 font-black bg-sky-500 text-white rounded-full border border-white shadow-xs">
                      KABUPATEN SUBANG
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-blue-100 font-medium">
                  {currentUser?.role === 'ADMIN'
                    ? 'Panel Verifikasi & Validasi Petugas Disdukcapil Kabupaten Subang'
                    : 'Sistem Pelayanan Administrasi Kependudukan • Disdukcapil Kab. Subang'}
                </p>
              </div>
            </div>

            {/* Quick WhatsApp for Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenWhatsAppModal}
                className="p-2 rounded-xl bg-blue-900 text-white border-2 border-white text-xs shadow-xs"
                title="Notifikasi WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* User Controls & Access Menus */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            
            {/* WhatsApp Notification Button */}
            <button
              onClick={onOpenWhatsAppModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/90 hover:bg-blue-800 text-xs font-bold text-white border-2 border-white transition shadow-sm"
              title="Pusat Notifikasi WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-bold">WhatsApp</span>
              {waUnreadCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500 text-white font-black shadow-xs border border-white">
                  {waUnreadCount}
                </span>
              )}
            </button>

            {/* Authenticated User Status & Logout (Only shown when logged in) */}
            {currentUser && (
              currentUser.role === 'ADMIN' ? (
                /* CASE: LOGGED IN AS ADMIN */
                <div className="flex items-center gap-3">
                  <div className="bg-blue-950/90 border-2 border-white rounded-xl px-3.5 py-1.5 text-right shadow-sm">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold text-white truncate max-w-[160px]">
                        {currentUser.fullName}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-200 font-mono block">
                      NIP: {currentUser.nip || '197805122005011004'}
                    </span>
                  </div>

                  <button
                    id="btn-admin-logout"
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold border-2 border-white transition shadow-sm"
                    title="Keluar dari Portal Petugas Admin"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              ) : (
                /* CASE: LOGGED IN AS PEMOHON */
                <div className="flex items-center gap-3">
                  <div className="bg-blue-950/90 border-2 border-white rounded-xl px-3.5 py-1.5 text-right shadow-sm">
                    <div className="flex items-center gap-1.5 justify-end">
                      <User className="w-3.5 h-3.5 text-white" />
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">
                        {currentUser.fullName}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-200 font-mono block">
                      NIK: {currentUser.nik}
                    </span>
                  </div>

                  <button
                    id="btn-pemohon-logout"
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-blue-950 border-2 border-white text-xs font-black transition shadow-sm"
                    title="Keluar dari Akun"
                  >
                    <LogOut className="w-3.5 h-3.5 text-blue-900" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </div>
              )
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
