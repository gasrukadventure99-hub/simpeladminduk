import React, { useState } from 'react';
import { ApplicationRecord } from '../types';
import { generateRealisticDocumentSvg } from '../utils/documentVisuals';
import { DocumentPreviewModal, DocumentPreviewData } from './DocumentPreviewModal';
import { 
  X, FileText, CheckCircle2, AlertTriangle, Clock, 
  ExternalLink, Printer, User, Phone, MapPin, 
  Calendar, FileCheck, Shield, ChevronRight, Eye
} from 'lucide-react';

interface DetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onOpenStatusChange: (app: ApplicationRecord) => void;
  onOpenReceipt: (app: ApplicationRecord) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  application,
  onClose,
  onOpenStatusChange,
  onOpenReceipt,
}) => {
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentPreviewData | null>(null);

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-blue-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide">BERKAS PERMOHONAN ADMINDUK</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-sky-300 font-mono border border-sky-400/30">
                  {application.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">{application.serviceTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            application.status === 'DISETUJUI'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : application.status === 'DITOLAK'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-start gap-3">
              {application.status === 'DISETUJUI' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              ) : application.status === 'DITOLAK' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">
                  Status Pengajuan: {application.status}
                </span>
                <p className="text-xs mt-0.5">
                  {application.status === 'DISETUJUI'
                    ? application.approvalNotes || 'Permohonan telah disetujui dan siap diterbitkan.'
                    : application.status === 'DITOLAK'
                    ? application.rejectionReason || 'Permohonan ditolak karena berkas tidak memenuhi syarat.'
                    : 'Berkas telah diterima sistem dan sedang dalam antrean verifikasi petugas.'}
                </p>
                {application.pickupEstimatedDate && application.pickupEstimatedDate !== '-' && (
                  <p className="text-xs font-semibold mt-1">
                    Estimasi Selesai: {application.pickupEstimatedDate} {application.pickupLocation && `(${application.pickupLocation})`}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => onOpenStatusChange(application)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs transition"
              >
                Ubah Status
              </button>
            </div>
          </div>

          {/* Applicant Demographic Information */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              Data Pemohon Kependudukan
            </h4>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Nama Lengkap:</span>
                <span className="font-bold text-slate-900 text-sm">{application.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NIK:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{application.nik}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Jenis Kelamin:</span>
                <span className="font-semibold text-slate-800">{application.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block">No. Telepon / WhatsApp:</span>
                <span className="font-semibold text-slate-800">{application.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tempat & Tanggal Lahir:</span>
                <span className="font-semibold text-slate-800">{application.birthPlace}, {application.birthDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Masuk Pengajuan:</span>
                <span className="font-semibold text-slate-800">{application.submittedAt}</span>
              </div>
              <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-200">
                <span className="text-slate-500 block">Alamat Domisili KTP:</span>
                <span className="font-medium text-slate-900">
                  {application.address}, RT/RW {application.rtRw}, Kel. {application.kelurahan}, Kec. {application.kecamatan}, {application.kabupatenKota}, {application.provinsi}
                </span>
              </div>

              {/* Conditional service notes */}
              {application.notes && (
                <div className="sm:col-span-2 md:col-span-3 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold">Catatan Tambahan Pemohon:</span>
                  <p className="text-slate-700 italic mt-0.5">{application.notes}</p>
                </div>
              )}

              {application.childName && (
                <div className="sm:col-span-2 md:col-span-3 bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                  <span className="text-blue-900 font-bold block text-xs">Data Anak (Permohonan Akta Lahir):</span>
                  <p className="text-blue-950 font-semibold">{application.childName} (Lahir: {application.childBirthDate})</p>
                  <p className="text-blue-800 text-xs">Orang Tua: {application.fatherName} & {application.motherName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Requirement Documents Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Dokumen Persyaratan yang Diunggah ({application.documents.length})
              </h4>
              <span className="text-[11px] text-slate-400">Klik dokumen untuk melihat preview</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block leading-tight">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">
                          {doc.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[150px]">
                      {doc.uploadedFileName || 'berkas_lampiran.pdf'} ({doc.uploadedFileSize || '1.2 MB'})
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const previewUrl = (doc.mockPreviewUrl && !doc.mockPreviewUrl.includes('unsplash'))
                          ? doc.mockPreviewUrl
                          : generateRealisticDocumentSvg(doc.name, application.fullName, application.nik);
                        setSelectedPreviewDoc({
                          title: doc.name,
                          url: previewUrl,
                          fileName: doc.uploadedFileName,
                          size: doc.uploadedFileSize
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 font-semibold text-[11px] transition shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Berkas</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview Modal */}
          <DocumentPreviewModal
            data={selectedPreviewDoc}
            onClose={() => setSelectedPreviewDoc(null)}
          />

          {/* Log & Officer Audit History */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              Riwayat Pemeriksaan Sistem & Petugas
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-slate-600">
                <span>Pengajuan dikirim oleh pemohon:</span>
                <span className="font-mono">{application.submittedAt}</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-slate-600">
                <span>Pemeriksaan terakhir:</span>
                <span className="font-mono">{application.updatedAt}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Petugas Penanggung Jawab:</span>
                <span className="font-medium text-slate-900">
                  {application.processedBy || 'Seksi Identitas Penduduk Disdukcapil'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="btn-detail-open-receipt-preview"
              onClick={() => onOpenReceipt(application)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition"
              title="Buka pratinjau resi pendaftaran sebelum mencetak ke printer atau menyimpan ke PDF"
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau & Cetak Resi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Tutup
            </button>
            <button
              onClick={() => onOpenStatusChange(application)}
              className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition"
            >
              Tindak Lanjuti Berkas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
