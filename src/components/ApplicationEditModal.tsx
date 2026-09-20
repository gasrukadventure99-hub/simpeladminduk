import React, { useState } from 'react';
import { ApplicationRecord } from '../types';
import { X, Edit, CheckCircle2, User, Phone, MapPin, FileText, AlertTriangle } from 'lucide-react';

interface ApplicationEditModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onSave: (updated: ApplicationRecord) => void;
}

export const ApplicationEditModal: React.FC<ApplicationEditModalProps> = ({
  application,
  onClose,
  onSave,
}) => {
  if (!application) return null;

  const [fullName, setFullName] = useState(application.fullName);
  const [nik, setNik] = useState(application.nik);
  const [phone, setPhone] = useState(application.phone);
  const [email, setEmail] = useState(application.email || '');
  const [address, setAddress] = useState(application.address);
  const [rtRw, setRtRw] = useState(application.rtRw || '01/01');
  const [kelurahan, setKelurahan] = useState(application.kelurahan || '');
  const [kecamatan, setKecamatan] = useState(application.kecamatan || '');
  const [notes, setNotes] = useState(application.notes || '');
  const [serviceTitle, setServiceTitle] = useState(application.serviceTitle);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap pemohon wajib diisi.';
    if (!nik.trim()) {
      errs.nik = 'NIK wajib diisi.';
    } else if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      errs.nik = 'NIK harus 16 digit angka.';
    }
    if (!phone.trim()) errs.phone = 'Nomor telepon/WA wajib diisi.';
    if (!address.trim()) errs.address = 'Alamat pemohon wajib diisi.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedApp: ApplicationRecord = {
      ...application,
      fullName: fullName.trim(),
      nik: nik.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      rtRw: rtRw.trim(),
      kelurahan: kelurahan.trim(),
      kecamatan: kecamatan.trim(),
      notes: notes.trim() || undefined,
      serviceTitle: serviceTitle.trim(),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onSave(updatedApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                EDIT DATA PERMOHONAN ADMINDUK (CRUD - UPDATE)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                No. Registrasi: <span className="font-mono text-blue-300 font-bold">{application.registrationNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-blue-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Layanan:</span>
              <span className="font-bold">{application.serviceCategory} — {application.serviceTitle}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-blue-800 border border-blue-200">
              Status: {application.status}
            </span>
          </div>

          {/* Full Name & NIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="edit-app-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.fullName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.fullName && <span className="text-rose-500 text-[11px] mt-1 block">{errors.fullName}</span>}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                NIK (16 Digit) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                id="edit-app-nik"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                className={`w-full p-2.5 rounded-xl border font-mono ${
                  errors.nik ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.nik && <span className="text-rose-500 text-[11px] mt-1 block">{errors.nik}</span>}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                No. WhatsApp / HP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="edit-app-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.phone && <span className="text-rose-500 text-[11px] mt-1 block">{errors.phone}</span>}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Email Pemohon
              </label>
              <input
                type="email"
                id="edit-app-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Service Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Judul Layanan Spesifik
            </label>
            <input
              type="text"
              id="edit-app-servicetitle"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          {/* Address & RT/RW */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              id="edit-app-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${
                errors.address ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
              }`}
            />
            {errors.address && <span className="text-rose-500 text-[11px] mt-1 block">{errors.address}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">RT / RW</label>
              <input
                type="text"
                value={rtRw}
                onChange={(e) => setRtRw(e.target.value)}
                placeholder="02/05"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kelurahan / Desa</label>
              <input
                type="text"
                value={kelurahan}
                onChange={(e) => setKelurahan(e.target.value)}
                placeholder="Kelurahan..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kecamatan</label>
              <input
                type="text"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                placeholder="Kecamatan..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Catatan Khusus Petugas Verifikator
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan hasil verifikasi atau keterangan berkas..."
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Batalkan
            </button>
            <button
              type="submit"
              id="btn-save-edit-app"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Perubahan Berkas</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
