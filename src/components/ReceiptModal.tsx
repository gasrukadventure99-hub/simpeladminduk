import React, { useState } from 'react';
import { ApplicationRecord, UserAccount } from '../types';
import { Printer, CheckCircle2, AlertTriangle, Clock, X, QrCode, FileCheck, MapPin, ShieldAlert, Download, Eye } from 'lucide-react';
import { generatePdfReceipt } from '../utils/generatePdfReceipt';

interface ReceiptModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  currentUser?: UserAccount | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ application, onClose, currentUser }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!application) return null;

  // Enforce access control for role PEMOHON: only allowed to view & print receipts of their own applications
  const isAuthorized = !currentUser || currentUser.role === 'ADMIN' || (
    (application.userId && application.userId === currentUser.id) ||
    (currentUser.nik && application.nik && application.nik.replace(/\s|-/g, '') === currentUser.nik.replace(/\s|-/g, '')) ||
    (currentUser.phone && application.phone && application.phone.replace(/\s|-/g, '') === currentUser.phone.replace(/\s|-/g, '')) ||
    (currentUser.email && application.email && application.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()) ||
    (currentUser.fullName && application.fullName && application.fullName.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-rose-500 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-rose-950 mb-1.5">Akses Resi Tidak Diizinkan</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Resi tanda terima permohonan <strong className="font-mono text-rose-900">{application.registrationNumber}</strong> bukan milik akun pemohon Anda (<strong className="text-slate-800">{currentUser?.fullName}</strong>).
            <br /><br />
            Sesuai regulasi privasi data kependudukan, pemohon hanya dapat melihat dan mencetak resi tanda terima atas permohonan miliknya sendiri.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDirectPdfDownload = () => {
    try {
      setIsGeneratingPdf(true);
      generatePdfReceipt(application);
      setTimeout(() => setIsGeneratingPdf(false), 800);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsGeneratingPdf(false);
      window.print();
    }
  };

  const getStatusBadge = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'DISETUJUI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            DISETUJUI / SELESAI
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            DITOLAK (PERLU REVISI)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-600" />
            SEDANG DIPROSES
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 text-sky-400 border border-white/20">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide">PRATINJAU RESI BUKTI PENDAFTARAN</h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-sky-300 border border-sky-400/30">
                  Preview Mode
                </span>
              </div>
              <p className="text-[11px] text-blue-100">Periksa isi dokumen sebelum mencetak ke printer atau menyimpan ke PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-receipt-top"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 shadow-2xs"
              title="Cetak langsung ke mesin printer fisik"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak ke Printer</span>
            </button>
            <button
              id="btn-download-receipt-pdf-top"
              onClick={handleDirectPdfDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-2xs transition"
              title="Unduh dan simpan resi sebagai file PDF A4 resmi"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Memproses PDF...' : 'Simpan ke PDF'}</span>
            </button>
            <button
              id="btn-close-receipt"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner before printable receipt */}
        <div className="no-print mx-6 sm:mx-8 mt-5 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 gap-3">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Pratinjau Dokumen Resmi:</strong> Tampilan di bawah ini merupakan wujud tanda terima sah pendaftaran <strong>Simpel Adminduk</strong>. Silakan pilih <strong>Cetak ke Printer</strong> atau <strong>Simpan ke PDF</strong> di tombol yang tersedia.
            </span>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900 flex-1">
          
          {/* Government Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center relative">
            <div className="text-xs uppercase font-semibold tracking-widest text-slate-600">
              PEMERINTAH KABUPATEN SUBANG
            </div>
            <div className="text-base sm:text-lg font-extrabold uppercase text-slate-900 tracking-tight mt-0.5">
              DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Simpel Adminduk (Sistem Pelayanan Administrasi Kependudukan) Online Mandiri
            </div>
            <div className="text-[11px] text-slate-500 italic mt-0.5">
              Jl. Raya Dangdeur KM. 2 Subang | Website: disdukcapil.subangkab.go.id | Helpdesk: 1500-537
            </div>
          </div>

          {/* Title & Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Tanda Terima Permohonan Online
              </span>
              <span className="text-lg font-mono font-black text-blue-900 tracking-wider">
                {application.registrationNumber}
              </span>
            </div>
            <div className="text-right flex flex-col items-center sm:items-end gap-1">
              <span className="text-[11px] text-slate-500 font-medium">Status Pengajuan:</span>
              {getStatusBadge(application.status)}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="space-y-4 text-xs sm:text-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-slate-500 text-xs block">Jenis Layanan Adminduk:</span>
                <span className="font-bold text-slate-900">{application.serviceTitle}</span>
                <span className="block text-xs text-blue-700 font-medium mt-0.5">Kategori: {application.serviceCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Waktu Pengajuan:</span>
                <span className="font-semibold text-slate-800">{application.submittedAt} WIB</span>
                <span className="block text-xs text-slate-500 mt-0.5">Pembaruan Terakhir: {application.updatedAt}</span>
              </div>
            </div>

            {/* Applicant Data */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-200">
                Data Identitas Pemohon
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900">{application.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nomor Induk Kependudukan (NIK):</span>
                  <span className="font-mono font-bold text-slate-900">{application.nik}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">No. Handphone / WhatsApp:</span>
                  <span className="font-medium text-slate-800">{application.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jenis Kelamin:</span>
                  <span className="font-medium text-slate-800">{application.gender}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Alamat KTP:</span>
                  <span className="font-medium text-slate-800">
                    {application.address}, RT/RW {application.rtRw}, Kel. {application.kelurahan}, Kec. {application.kecamatan}, {application.kabupatenKota}, {application.provinsi}
                  </span>
                </div>

                {application.childName && (
                  <div className="sm:col-span-2 bg-blue-50 p-2.5 rounded-lg border border-blue-200 mt-1">
                    <span className="text-blue-700 font-bold block text-xs">Data Anak (Akta Kelahiran):</span>
                    <p className="text-blue-950 font-semibold">{application.childName} (Lahir: {application.childBirthDate})</p>
                    <p className="text-blue-800 text-[11px]">Orang Tua: {application.fatherName} & {application.motherName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Verified */}
            <div>
              <span className="text-slate-500 text-xs block mb-1 font-medium">Dokumen Persyaratan yang Diunggah:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {application.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{doc.uploadedFileName || 'Terunggah (Mockup File)'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Officer Notes or Rejection Note */}
            {application.status === 'DITOLAK' && application.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                <span className="font-bold flex items-center gap-1.5 text-rose-700 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  Alasan Penolakan / Catatan Perbaikan Petugas:
                </span>
                <p className="pl-5 leading-relaxed">{application.rejectionReason}</p>
              </div>
            )}

            {application.status === 'DISETUJUI' && application.approvalNotes && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <span className="font-bold flex items-center gap-1.5 text-emerald-700 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Catatan Persetujuan Petugas:
                </span>
                <p className="pl-5 leading-relaxed">{application.approvalNotes}</p>
              </div>
            )}

            {/* Pickup / Download instructions */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-blue-900 block">Petunjuk Pengambilan / Penerimaan Dokumen:</span>
                <p className="text-blue-800 leading-relaxed mt-0.5">
                  {application.pickupLocation || 'Bawa bukti tanda terima ini beserta dokumen fisik asli yang dipersyaratkan saat pengambilan di loket Dinas Dukcapil terdekat.'}
                </p>
                {application.pickupEstimatedDate && (
                  <p className="text-blue-900 font-semibold mt-1">
                    Estimasi Selesai: {application.pickupEstimatedDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Receipt Footer with Mock Barcode & Officer Validation */}
          <div className="pt-4 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Barcode & Security stamp */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white border border-slate-300 p-1 rounded-lg flex items-center justify-center shadow-xs">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-slate-500 uppercase">Verifikasi Digital BSrE</div>
                <div className="text-xs font-bold text-slate-800 tracking-wider">SEC-{application.registrationNumber.replace(/[^0-9]/g, '')}</div>
                <div className="text-[9px] text-slate-400">Dokumen Sah Terdaftar di Database SIAK</div>
              </div>
            </div>

            {/* Officer Stamp */}
            <div className="text-center sm:text-right">
              <div className="text-[11px] text-slate-500">Petugas Pemroses:</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                {application.processedBy || 'Seksi Pelayanan Pendaftaran Penduduk'}
              </div>
              <div className="text-[10px] text-slate-400 italic mt-0.5">
                Dokumen ini dicetak otomatis secara elektronik dan tidak memerlukan tanda tangan basah.
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Buttons (Hidden on print) */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span>Pratinjau Siap • Format Standar A4 Resmi Disdukcapil Subang</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Tutup Pratinjau
            </button>
            <button
              id="btn-bottom-print-browser"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs transition"
              title="Cetak langsung ke mesin printer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak ke Printer</span>
            </button>
            <button
              id="btn-bottom-download-pdf"
              onClick={handleDirectPdfDownload}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition"
              title="Simpan dokumen sebagai berkas PDF resmi"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Menyimpan PDF...' : 'Simpan ke PDF'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
