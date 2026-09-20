import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { CheckCircle2, AlertTriangle, X, ShieldAlert, FileText, Calendar, MapPin, MessageCircle, Send } from 'lucide-react';

interface StatusChangeModalProps {
  application: ApplicationRecord | null;
  targetStatus: ApplicationStatus;
  onClose: () => void;
  onSave: (
    applicationId: string,
    newStatus: ApplicationStatus,
    details: {
      rejectionReason?: string;
      approvalNotes?: string;
      pickupEstimatedDate?: string;
      pickupLocation?: string;
      officerName?: string;
      sendWhatsApp?: boolean;
    }
  ) => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  application,
  targetStatus: initialTargetStatus,
  onClose,
  onSave,
}) => {
  if (!application) return null;

  const [status, setStatus] = useState<ApplicationStatus>(initialTargetStatus);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [rejectionReason, setRejectionReason] = useState(
    application.rejectionReason || 'Lampiran dokumen persyaratan kurang jelas/buram. Harap unggah ulang berkas asli yang terbaca dengan jelas.'
  );
  const [approvalNotes, setApprovalNotes] = useState(
    application.approvalNotes || 'Seluruh berkas persyaratan telah divalidasi dan memenuhi ketentuan kependudukan.'
  );
  const [pickupEstimatedDate, setPickupEstimatedDate] = useState(
    application.pickupEstimatedDate && application.pickupEstimatedDate !== '-'
      ? application.pickupEstimatedDate
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [pickupLocation, setPickupLocation] = useState(
    application.pickupLocation || 'Loket 2 Pelayanan Mandiri Disdukcapil (Bawa KTP asli & bukti tanda terima)'
  );
  const [officerName, setOfficerName] = useState('Drs. Hendra Irawan (NIP. 197805122005011004)');

  const quickRejectionTemplates = [
    'Foto dokumen/scan persyaratan terlalu buram dan teks tidak terbaca.',
    'Dokumen Kartu Keluarga (KK) yang dilampirkan sudah tidak berlaku/versi lama.',
    'Surat tanda bukti kehilangan dari Kepolisian belum dilampirkan.',
    'Buku Nikah / Surat Keterangan Lahir belum dilegalisir faskes bersangkutan.',
    'Data pemohon tidak sinkron dengan database kependudukan nasional (SIAK).'
  ];

  const previewWaText = status === 'DISETUJUI'
    ? `Yth. Bpk/Ibu ${application.fullName.toUpperCase()},\n\nPermohonan Adminduk Anda No. *${application.registrationNumber}* (${application.serviceTitle}) telah *DISETUJUI*.\n\nFisik dokumen dapat diambil pada: *${pickupEstimatedDate}* di *${pickupLocation}*.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`
    : `Yth. Bpk/Ibu ${application.fullName.toUpperCase()},\n\nPermohonan Adminduk No. *${application.registrationNumber}* berstatus *DITOLAK / PERLU REVISI*.\n\n*Alasan:* ${rejectionReason}\n\nSilakan perbaiki berkas di portal online.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'DITOLAK' && !rejectionReason.trim()) {
      alert('Harap masukkan alasan penolakan berkas!');
      return;
    }

    onSave(application.id, status, {
      rejectionReason: status === 'DITOLAK' ? rejectionReason : undefined,
      approvalNotes: status === 'DISETUJUI' ? approvalNotes : undefined,
      pickupEstimatedDate: status === 'DISETUJUI' ? pickupEstimatedDate : '-',
      pickupLocation: status === 'DISETUJUI' ? pickupLocation : undefined,
      officerName,
      sendWhatsApp
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 text-sky-400 border border-white/20">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">UBAH STATUS PENGAJUAN ADMINDUK</h3>
              <p className="text-xs text-blue-100">No. Registrasi: {application.registrationNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          
          {/* Applicant quick bar */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Pemohon:</span>
              <span className="font-bold text-slate-900 text-sm">{application.fullName}</span>
              <span className="text-slate-500 block font-mono">NIK: {application.nik}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Layanan:</span>
              <span className="font-semibold text-blue-900">{application.serviceCategory}</span>
              <span className="text-[11px] text-slate-500 block">{application.serviceTitle}</span>
            </div>
          </div>

          {/* Status Selector radio buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Pilih Keputusan Status:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('DISETUJUI')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-xs transition ${
                  status === 'DISETUJUI'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${status === 'DISETUJUI' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>SETUJUI BERKAS</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('DITOLAK')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-xs transition ${
                  status === 'DITOLAK'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${status === 'DITOLAK' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>TOLAK PENGAJUAN</span>
              </button>
            </div>
          </div>

          {/* Conditional Fields based on status */}
          {status === 'DITOLAK' ? (
            <div className="space-y-3 bg-rose-50/70 p-4 rounded-xl border border-rose-200">
              <label className="block text-xs font-bold text-rose-900">
                Alasan Penolakan / Catatan Perbaikan Berkas <span className="text-rose-600">*</span>:
              </label>

              {/* Quick templates */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-rose-800">Template Cepat Alasan Penolakan:</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {quickRejectionTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(tmpl)}
                      className="text-[10px] text-left px-2 py-1 rounded bg-white text-rose-800 border border-rose-200 hover:bg-rose-100/70 transition"
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
                className="w-full text-xs p-2.5 rounded-lg border border-rose-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                placeholder="Tuliskan instruksi perbaikan yang jelas untuk masyarakat pemohon..."
              />
              <p className="text-[11px] text-rose-700">
                Alasan ini akan tampil pada dashboard pemohon dan resi tanda terima agar dapat diperbaiki.
              </p>
            </div>
          ) : (
            <div className="space-y-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">
                  Catatan Persetujuan & Tindak Lanjut:
                </label>
                <input
                  type="text"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="Catatan untuk pemohon..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-emerald-900 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    Estimasi Pengambilan:
                  </label>
                  <input
                    type="date"
                    value={pickupEstimatedDate}
                    onChange={(e) => setPickupEstimatedDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-emerald-900 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    Lokasi / Cara Pengambilan:
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Contoh: Loket Pelayanan / Unduh TTE"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Officer Identity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama & NIP Petugas Pemeriksa:
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>

          {/* WhatsApp Notification Dispatch Box */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950">
              <input
                type="checkbox"
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Kirim Notifikasi WhatsApp Otomatis ke Pemohon ({application.phone})
              </span>
            </label>

            {sendWhatsApp && (
              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-slate-800 text-[11px] font-mono whitespace-pre-line leading-relaxed shadow-xs">
                {previewWaText}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition flex items-center gap-1.5 ${
                status === 'DISETUJUI'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {status === 'DISETUJUI' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Status Persetujuan</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Simpan Penolakan Berkas</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
