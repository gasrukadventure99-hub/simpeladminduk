import React, { useState } from 'react';
import { ApplicationRecord, ServiceType, RequiredDocument } from '../types';
import { X, PlusCircle, CheckCircle2, FileText, User, Phone, MapPin } from 'lucide-react';

interface ApplicationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newApp: ApplicationRecord) => void;
}

export const ApplicationCreateModal: React.FC<ApplicationCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<'KTP-el' | 'Kartu Keluarga' | 'Akta Kelahiran'>('KTP-el');
  const [serviceType, setServiceType] = useState<ServiceType>('KTP_BARU');
  const [fullName, setFullName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [birthPlace, setBirthPlace] = useState('Subang');
  const [birthDate, setBirthDate] = useState('2005-01-01');
  const [address, setAddress] = useState('');
  const [rtRw, setRtRw] = useState('01/01');
  const [kelurahan, setKelurahan] = useState('Karanganyar');
  const [kecamatan, setKecamatan] = useState('Subang');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCategoryChange = (cat: 'KTP-el' | 'Kartu Keluarga' | 'Akta Kelahiran') => {
    setCategory(cat);
    if (cat === 'KTP-el') setServiceType('KTP_BARU');
    else if (cat === 'Kartu Keluarga') setServiceType('KK_BARU');
    else setServiceType('AKTA_KELAHIRAN');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap pemohon wajib diisi.';
    if (!nik.trim()) {
      errs.nik = 'NIK 16 digit wajib diisi.';
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

    const code = category === 'KTP-el' ? 'KTP' : category === 'Kartu Keluarga' ? 'KK' : 'AKT';
    const regNum = `REG-2026-${code}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let title = '';
    let mockDocs: RequiredDocument[] = [];

    if (category === 'KTP-el') {
      title = serviceType === 'KTP_BARU'
        ? 'Perekaman KTP-el Pemula (Usia 17 Tahun)'
        : 'Penggantian KTP-el (Rusak/Hilang/Perubahan Data)';
      mockDocs = [
        {
          id: 'doc-1',
          name: 'Kartu Keluarga (KK) Asli',
          description: 'Scan atau foto KK',
          required: true,
          uploadedFileName: 'Scan_KK_Asli.pdf',
          uploadedFileSize: '1.2 MB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=60',
        },
        {
          id: 'doc-2',
          name: 'Akta Kelahiran',
          description: 'Scan Akta Kelahiran',
          required: true,
          uploadedFileName: 'Akta_Kelahiran.pdf',
          uploadedFileSize: '900 KB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        },
      ];
    } else if (category === 'Kartu Keluarga') {
      title = serviceType === 'KK_BARU'
        ? 'Penerbitan Kartu Keluarga (KK) Baru'
        : 'Perubahan Elemen Data Kartu Keluarga (KK)';
      mockDocs = [
        {
          id: 'doc-1',
          name: 'Buku Nikah / Akta Perkawinan',
          description: 'Buku nikah asli',
          required: true,
          uploadedFileName: 'Buku_Nikah_Asli.pdf',
          uploadedFileSize: '1.5 MB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=60',
        },
        {
          id: 'doc-2',
          name: 'KK Lama Asli',
          description: 'Kartu Keluarga sebelumnya',
          required: true,
          uploadedFileName: 'KK_Lama.pdf',
          uploadedFileSize: '1.1 MB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        },
      ];
    } else {
      title = 'Penerbitan Kutipan Akta Kelahiran';
      mockDocs = [
        {
          id: 'doc-1',
          name: 'Surat Keterangan Kelahiran RS/Bidan',
          description: 'Surat lahir asli',
          required: true,
          uploadedFileName: 'Surat_Kelahiran_RS.pdf',
          uploadedFileSize: '850 KB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=60',
        },
        {
          id: 'doc-2',
          name: 'Buku Nikah Orang Tua',
          description: 'Legalisir buku nikah',
          required: true,
          uploadedFileName: 'Buku_Nikah_Ortu.pdf',
          uploadedFileSize: '1.3 MB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        },
      ];
    }

    const newApp: ApplicationRecord = {
      id: `adm-${Date.now()}`,
      registrationNumber: regNum,
      serviceType,
      serviceCategory: category,
      serviceTitle: title,
      fullName: fullName.trim(),
      nik: nik.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gender,
      birthPlace: birthPlace.trim() || 'Subang',
      birthDate,
      address: address.trim(),
      rtRw: rtRw.trim() || '01/01',
      kelurahan: kelurahan.trim() || 'Karanganyar',
      kecamatan: kecamatan.trim() || 'Subang',
      kabupatenKota: 'Kabupaten Subang',
      provinsi: 'Jawa Barat',
      notes: notes.trim() || 'Diinput manual oleh Petugas Loket Disdukcapil.',
      documents: mockDocs,
      status: 'DIPROSES',
      submittedAt: nowStr,
      updatedAt: nowStr,
      pickupEstimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickupLocation: 'Loket 2 Pelayanan Mandiri Disdukcapil',
    };

    onCreate(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-yellow-400 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-800 border-2 border-yellow-400 text-yellow-300">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-white">
                INPUT PERMOHONAN BARU OLEH PETUGAS (CRUD - CREATE)
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Disdukcapil Kabupaten Subang • Pendaftaran berkas loket oleh admin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Category Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Pilih Kategori Dokumen Adminduk <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('KTP-el')}
                className={`p-2.5 rounded-xl border text-center font-bold transition ${
                  category === 'KTP-el'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-400'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                KTP-el
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('Kartu Keluarga')}
                className={`p-2.5 rounded-xl border text-center font-bold transition ${
                  category === 'Kartu Keluarga'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-400'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Kartu Keluarga
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('Akta Kelahiran')}
                className={`p-2.5 rounded-xl border text-center font-bold transition ${
                  category === 'Akta Kelahiran'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Akta Kelahiran
              </button>
            </div>
          </div>

          {/* Sub Service Type */}
          {category === 'KTP-el' && (
            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="ktpType"
                  checked={serviceType === 'KTP_BARU'}
                  onChange={() => setServiceType('KTP_BARU')}
                />
                <span>KTP-el Pemula (17 Tahun)</span>
              </label>
              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="ktpType"
                  checked={serviceType === 'KTP_PENGGANTIAN'}
                  onChange={() => setServiceType('KTP_PENGGANTIAN')}
                />
                <span>Penggantian KTP-el</span>
              </label>
            </div>
          )}

          {category === 'Kartu Keluarga' && (
            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="kkType"
                  checked={serviceType === 'KK_BARU'}
                  onChange={() => setServiceType('KK_BARU')}
                />
                <span>Penerbitan KK Baru</span>
              </label>
              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="kkType"
                  checked={serviceType === 'KK_PERUBAHAN'}
                  onChange={() => setServiceType('KK_PERUBAHAN')}
                />
                <span>Perubahan Elemen Data KK</span>
              </label>
            </div>
          )}

          {/* Applicant Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="create-app-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Ridwan Kamil"
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
                id="create-app-nik"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="3201xxxxxxxxxxxx"
                className={`w-full p-2.5 rounded-xl border font-mono ${
                  errors.nik ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.nik && <span className="text-rose-500 text-[11px] mt-1 block">{errors.nik}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nomor WhatsApp / HP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="create-app-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className={`w-full p-2.5 rounded-xl border ${
                  errors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.phone && <span className="text-rose-500 text-[11px] mt-1 block">{errors.phone}</span>}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Pemohon</label>
              <input
                type="email"
                id="create-app-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pemohon@email.com"
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Gender & Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="Kota Kelahiran..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Alamat Lengkap Pemohon <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              id="create-app-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, Nomor Rumah, RT/RW..."
              className={`w-full p-2.5 rounded-xl border ${
                errors.address ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
              }`}
            />
            {errors.address && <span className="text-rose-500 text-[11px] mt-1 block">{errors.address}</span>}
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Catatan Khusus Loket</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan petugas atau pemohon..."
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          {/* Footer */}
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
              id="btn-submit-create-app"
              className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-yellow-300 font-extrabold border-2 border-yellow-400 shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-yellow-300" />
              <span>Simpan & Buat Permohonan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
