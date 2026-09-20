import React, { useState } from 'react';
import { WhatsAppNotification, ApplicationRecord, UserRole } from '../types';
import { 
  X, MessageCircle, Send, CheckCheck, Phone, 
  ExternalLink, Clock, ShieldCheck, CheckCircle2, 
  Filter, Smartphone, RefreshCw, User
} from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: WhatsAppNotification[];
  applications: ApplicationRecord[];
  currentRole: UserRole | null;
  currentUserPhone?: string;
  onSendManualWa?: (notification: WhatsAppNotification) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  notifications,
  applications,
  currentRole,
  currentUserPhone,
  onSendManualWa
}) => {
  const [selectedNotifId, setSelectedNotifId] = useState<string>(
    notifications[0]?.id || ''
  );
  const [filterType, setFilterType] = useState<string>('ALL');

  // Manual broadcast state for Admin
  const [targetAppId, setTargetAppId] = useState<string>(applications[0]?.id || '');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Filter notifications if user is PEMOHON: only show their notifications
  const displayedNotifications = notifications.filter((notif) => {
    if (currentRole === 'PEMOHON' && currentUserPhone) {
      const cleanUserPhone = currentUserPhone.replace(/\D/g, '');
      const cleanNotifPhone = notif.recipientPhone.replace(/\D/g, '');
      // Match by phone or registration
      if (!cleanNotifPhone.includes(cleanUserPhone) && !cleanUserPhone.includes(cleanNotifPhone)) {
        return false;
      }
    }
    if (filterType !== 'ALL' && notif.type !== filterType) return false;
    return true;
  });

  const activeNotif = 
    notifications.find((n) => n.id === selectedNotifId) || 
    displayedNotifications[0] || 
    notifications[0];

  const handleSendCustomBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppId || !customMessage.trim()) return;

    const targetApp = applications.find(a => a.id === targetAppId);
    if (!targetApp) return;

    const newNotif: WhatsAppNotification = {
      id: `wa-${Date.now()}`,
      applicationId: targetApp.id,
      registrationNumber: targetApp.registrationNumber,
      recipientPhone: targetApp.phone,
      recipientName: targetApp.fullName,
      message: customMessage,
      type: 'STATUS_APPROVED',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'TERKIRIM'
    };

    if (onSendManualWa) {
      onSendManualWa(newNotif);
    }

    setSelectedNotifId(newNotif.id);
    setCustomMessage('');
  };

  const getWaLink = (phone: string, text: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-6 border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center font-bold text-white shadow-md">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  SISTEM NOTIFIKASI WHATSAPP ADMINDUK
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-sky-300 border border-sky-400/40 flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> OFFICIAL GATEWAY
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Pemberitahuan resmi otomatis untuk status berkas, tanda terima, dan jadwal pengambilan fisik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Screen (Left: List & Broadcast, Right: Smartphone Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* LEFT PANEL: Notifications List & Broadcast Tool */}
          <div className="lg:col-span-6 p-5 border-r border-slate-200 overflow-y-auto max-h-[75vh] space-y-4">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  {currentRole === 'PEMOHON' ? 'Riwayat Pesan WhatsApp Anda' : 'Pusat Log Pesan Terkirim'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {displayedNotifications.length} pesan tercatat dalam sistem
                </p>
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">Semua Jenis Pesan</option>
                <option value="STATUS_APPROVED">Disetujui</option>
                <option value="STATUS_REJECTED">Ditolak / Revisi</option>
                <option value="REGISTRATION_CONFIRMATION">Bukti Pendaftaran</option>
              </select>
            </div>

            {/* Notification items */}
            <div className="space-y-2.5">
              {displayedNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  Belum ada notifikasi WhatsApp yang sesuai kriteria.
                </div>
              ) : (
                displayedNotifications.map((notif) => {
                  const isSelected = activeNotif?.id === notif.id;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => setSelectedNotifId(notif.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {notif.recipientName}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {notif.sentAt}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                        <span className="font-mono text-blue-800 font-semibold">{notif.registrationNumber}</span>
                        <span className="text-slate-700 font-mono">{notif.recipientPhone}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                        "{notif.message.replace(/\*/g, '')}"
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          notif.type === 'STATUS_APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : notif.type === 'STATUS_REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notif.type === 'STATUS_APPROVED' ? 'Disetujui' : notif.type === 'STATUS_REJECTED' ? 'Ditolak' : 'Pendaftaran'}
                        </span>

                        <span className="text-blue-700 font-bold flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                          {notif.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ADMIN ONLY: MANUAL SEND WHATSAPP FORM */}
            {currentRole === 'ADMIN' && (
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Kirim Pesan WhatsApp Manual ke Pemohon
                  </span>
                </div>

                <form onSubmit={handleSendCustomBroadcast} className="space-y-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pilih Berkas Pemohon:
                    </label>
                    <select
                      value={targetAppId}
                      onChange={(e) => setTargetAppId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.fullName} — {app.registrationNumber} ({app.serviceCategory})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pesan Notifikasi:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Tuliskan pesan pemberitahuan khusus kepada pemohon..."
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pesan WhatsApp Sekarang</span>
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Authentic WhatsApp Smartphone Screen Simulation */}
          <div className="lg:col-span-6 p-6 bg-slate-100 flex flex-col items-center justify-center">
            
            <div className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 flex flex-col">
              
              {/* Smartphone Notch Bar */}
              <div className="bg-slate-900 text-white text-[10px] px-6 py-1 flex items-center justify-between font-mono">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="text-[10px]">4G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* WhatsApp App Header */}
              <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-emerald-900 font-bold text-xs shrink-0">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white leading-tight">
                        Disdukcapil Resmi
                      </span>
                      {/* WhatsApp Verified Green Badge */}
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-200 block">Akun Bisnis Terverifikasi</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              {/* Chat Message Canvas */}
              <div className="p-4 bg-[#efeae2] min-h-[340px] flex flex-col justify-end space-y-3 relative overflow-hidden">
                
                {/* Wallpaper watermark */}
                <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                  <MessageCircle className="w-48 h-48" />
                </div>

                {/* Date bubble */}
                <div className="self-center bg-white/80 shadow-xs px-2.5 py-0.5 rounded-md text-[9px] text-slate-500 font-medium">
                  HARI INI
                </div>

                {/* Encryption disclaimer */}
                <div className="self-center bg-[#ffeecd] border border-amber-200/60 rounded-lg p-2 text-center text-[9px] text-amber-900 max-w-[90%] shadow-xs leading-tight">
                  🔒 Pesan ini dikirim secara otomatis oleh Sistem Informasi Administrasi Kependudukan (SI-ADMINDUK) terenkripsi end-to-end.
                </div>

                {/* Active Message Bubble */}
                {activeNotif ? (
                  <div className="self-end bg-[#dcf8c6] text-slate-900 p-3 rounded-2xl rounded-tr-xs shadow-md max-w-[92%] text-xs space-y-1 relative border border-emerald-200/50">
                    <div className="text-[10px] font-bold text-[#075e54] flex items-center justify-between border-b border-emerald-300/40 pb-1 mb-1">
                      <span>Pemberitahuan Pelayanan</span>
                      <span className="font-mono text-[9px]">{activeNotif.registrationNumber}</span>
                    </div>

                    <div className="whitespace-pre-line text-[11px] leading-relaxed">
                      {activeNotif.message}
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 pt-1">
                      <span>{activeNotif.sentAt.split(' ')[1] || '10:00'}</span>
                      <span className="text-[#34b7f1] flex items-center">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 py-12">
                    Pilih pesan untuk melihat pratinjau chat WhatsApp.
                  </div>
                )}

              </div>

              {/* Chat Input Simulation */}
              <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-slate-300 text-slate-400 text-xs">
                <span className="text-base">😊</span>
                <div className="bg-white flex-1 py-1.5 px-3 rounded-full text-[11px] text-slate-500 shadow-xs">
                  Balas pesan ini...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs shadow-xs">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

            {/* Direct Open WhatsApp Button */}
            {activeNotif && (
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={getWaLink(activeNotif.recipientPhone, activeNotif.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Uji Buka di Aplikasi WhatsApp Asli</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </a>
              </div>
            )}

          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Gateway WhatsApp Disdukcapil terhubung dengan nomor resmi Call Center 1500537</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
