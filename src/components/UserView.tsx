import React, { useState, useMemo, useRef } from 'react';
import { ApplicationRecord, ServiceType, RequiredDocument, UserAccount } from '../types';
import { SERVICE_DEFINITIONS } from '../mockData';
import { generateRealisticDocumentSvg } from '../utils/documentVisuals';
import { DocumentPreviewModal, DocumentPreviewData } from './DocumentPreviewModal';
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, Send, 
  UploadCloud, Check, User, Phone, MapPin, 
  FileCheck, Shield, Sparkles, Printer, ArrowRight, 
  RefreshCw, Info, Calendar, Trash2, Eye, PlusCircle,
  FileCode, Layers, Search, Filter, HardDrive, CheckCheck, X
} from 'lucide-react';

interface UserViewProps {
  applications: ApplicationRecord[];
  onSubmitNewApplication: (newApp: ApplicationRecord) => void;
  onOpenReceipt: (app: ApplicationRecord) => void;
  onOpenDetail: (app: ApplicationRecord) => void;
  currentUser?: UserAccount | null;
  onOpenLogin?: () => void;
  onOpenWhatsAppModal?: () => void;
}

export const UserView: React.FC<UserViewProps> = ({
  applications,
  onSubmitNewApplication,
  onOpenReceipt,
  onOpenDetail,
  currentUser,
  onOpenLogin,
  onOpenWhatsAppModal
}) => {
  // Main Role-Specific Menu Tabs
  const [activeMenu, setActiveMenu] = useState<'FORM' | 'STATUS' | 'RECEIPT'>('FORM');
  
  // Status filter for Dashboard Status
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DIPROSES' | 'DISETUJUI' | 'DITOLAK'>('ALL');
  const [statusSearchTerm, setStatusSearchTerm] = useState('');

  // Selected Service Type
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('KTP_BARU');
  
  // Form Identity State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [nik, setNik] = useState(currentUser?.nik || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [birthPlace, setBirthPlace] = useState('Subang');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [rtRw, setRtRw] = useState('01/02');
  const [kelurahan, setKelurahan] = useState('Karanganyar');
  const [kecamatan, setKecamatan] = useState('Subang');
  const [bloodType, setBloodType] = useState('O');
  const [maritalStatus, setMaritalStatus] = useState('Belum Kawin');
  const [occupation, setOccupation] = useState('Karyawan Swasta');
  const [notes, setNotes] = useState('');

  // Dynamic Service-Specific Fields
  // KTP-el Specific
  const [ktpReason, setKtpReason] = useState('KTP Fisik Rusak / Patah / Chip Terkelupas');
  const [policeReportNumber, setPoliceReportNumber] = useState('');

  // KK Specific
  const [kkReason, setKkReason] = useState('Keluarga Baru (Pernikahan)');
  const [familyHeadName, setFamilyHeadName] = useState('');
  const [familyMemberCount, setFamilyMemberCount] = useState('2');
  const [oldKkNumber, setOldKkNumber] = useState('');

  // Akta Kelahiran Specific
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [childBirthPlace, setChildBirthPlace] = useState('RSUD Kota');
  const [childBirthDate, setChildBirthDate] = useState('');
  const [childBirthTime, setChildBirthTime] = useState('08:30');
  const [birthWeight, setBirthWeight] = useState('3.2');
  const [birthLength, setBirthLength] = useState('49');
  const [fatherName, setFatherName] = useState('');
  const [fatherNik, setFatherNik] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherNik, setMotherNik] = useState('');
  const [marriageCertNumber, setMarriageCertNumber] = useState('');
  const [witnessName1, setWitnessName1] = useState('');
  const [witnessName2, setWitnessName2] = useState('');

  // Uploaded docs mock state with size indicator
  const selectedServiceDef = SERVICE_DEFINITIONS.find(s => s.type === selectedServiceType) || SERVICE_DEFINITIONS[0];
  
  interface UploadedItem {
    fileName: string;
    fileSizeBytes: number;
    fileSizeFormatted: string;
    uploadedAt: string;
    previewUrl: string;
    fileType?: string;
    isPdf?: boolean;
    isValidSize: boolean;
  }

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedItem>>({});
  const [uploadErrors, setUploadErrors] = useState<string | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<DocumentPreviewData | null>(null);
  
  // Hidden file input refs for each req
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Submission result state
  const [justSubmittedApp, setJustSubmittedApp] = useState<ApplicationRecord | null>(null);

  // Sync with currentUser when logged in
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setFullName(currentUser.fullName);
      if (currentUser.nik) setNik(currentUser.nik);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  // Filter strictly to current logged-in pemohon's applications
  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return applications;
    return applications.filter((app) => {
      if (app.userId && app.userId === currentUser.id) return true;
      if (currentUser.nik && app.nik && app.nik.replace(/\s|-/g, '') === currentUser.nik.replace(/\s|-/g, '')) return true;
      if (currentUser.email && app.email && app.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()) return true;
      if (currentUser.phone && app.phone && app.phone.replace(/\s|-/g, '') === currentUser.phone.replace(/\s|-/g, '')) return true;
      if (currentUser.fullName && app.fullName && app.fullName.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase()) return true;
      return false;
    });
  }, [applications, currentUser]);

  // Statistics calculation for user pemohon
  const totalApps = myApplications.length;
  const diprosesCount = myApplications.filter(a => a.status === 'DIPROSES').length;
  const disetujuiCount = myApplications.filter(a => a.status === 'DISETUJUI').length;
  const ditolakCount = myApplications.filter(a => a.status === 'DITOLAK').length;

  // Filtered applications for status tab (only from current pemohon's records)
  const filteredUserApps = useMemo(() => {
    return myApplications.filter(app => {
      const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchSearch = 
        app.registrationNumber.toLowerCase().includes(statusSearchTerm.toLowerCase()) ||
        app.serviceTitle.toLowerCase().includes(statusSearchTerm.toLowerCase()) ||
        app.serviceCategory.toLowerCase().includes(statusSearchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [myApplications, statusFilter, statusSearchTerm]);

  // Handle Real File Selection via input[type=file]
  const handleRealFileSelect = (reqId: string, reqName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileSizeBytes = file.size;
    const sizeInMB = fileSizeBytes / (1024 * 1024);
    const formatted = sizeInMB >= 1 
      ? `${sizeInMB.toFixed(2)} MB` 
      : `${(fileSizeBytes / 1024).toFixed(0)} KB`;
    const isValid = sizeInMB <= 5.0; // Max 5 MB
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    // Read the actual file uploaded by the user so the preview strictly matches
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultDataUrl = uploadEvent.target?.result as string;
      setUploadedDocs(prev => ({
        ...prev,
        [reqId]: {
          fileName: file.name,
          fileSizeBytes,
          fileSizeFormatted: formatted,
          fileType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
          uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          previewUrl: resultDataUrl,
          isPdf,
          isValidSize: isValid
        }
      }));
    };
    reader.readAsDataURL(file);

    if (!isValid) {
      setUploadErrors(`Peringatan: Berkas ${file.name} (${formatted}) melebihi ukuran batas 5.0 MB.`);
    } else {
      setUploadErrors(null);
    }
  };

  // Handle Simulated Fast Upload with realistic size and matching document preview
  const handleSimulateUpload = (reqId: string, reqName: string) => {
    // Generate realistic size between 0.8 MB and 2.4 MB
    const simulatedMB = +(0.8 + Math.random() * 1.6).toFixed(2);
    const fileSizeBytes = Math.round(simulatedMB * 1024 * 1024);
    const isPhoto = reqName.toLowerCase().includes('pas foto') || reqName.toLowerCase().includes('3x4');
    const isPdf = !isPhoto;
    const cleanDocName = reqName.replace(/[^a-zA-Z0-9]/g, '_');
    const simulatedFileName = isPhoto 
      ? `Pasfoto_Formal_3x4_${fullName ? fullName.replace(/\s+/g, '_') : 'Pemohon'}.jpg` 
      : `Scan_Asli_${cleanDocName}.pdf`;

    // Generate authentic document SVG tailored specifically to this requirement
    const svgUrl = generateRealisticDocumentSvg(reqName, fullName || 'Pemohon Adminduk', nik || '3213010101010001');

    setUploadedDocs(prev => ({
      ...prev,
      [reqId]: {
        fileName: simulatedFileName,
        fileSizeBytes,
        fileSizeFormatted: `${simulatedMB} MB`,
        fileType: isPdf ? 'application/pdf' : 'image/jpeg',
        uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        previewUrl: svgUrl,
        isPdf: false,
        isValidSize: true
      }
    }));
    setUploadErrors(null);
  };

  const handleRemoveUploadedDoc = (reqId: string) => {
    setUploadedDocs(prev => {
      const next = { ...prev };
      delete next[reqId];
      return next;
    });
  };

  // Calculate upload metrics
  const totalRequiredCount = selectedServiceDef.requirements.filter(r => r.required).length;
  const uploadedRequiredCount = selectedServiceDef.requirements.filter(r => r.required && uploadedDocs[r.id]).length;
  const uploadedList = Object.values(uploadedDocs) as UploadedItem[];
  const totalUploadedBytes = uploadedList.reduce((sum: number, item: UploadedItem) => sum + item.fileSizeBytes, 0);
  const totalUploadedFormatted = totalUploadedBytes > 0 
    ? `${(totalUploadedBytes / (1024 * 1024)).toFixed(2)} MB` 
    : '0 MB';

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      alert('NIK harus terdiri dari tepat 16 digit angka kependudukan!');
      return;
    }

    // Check required docs
    const missingDocs = selectedServiceDef.requirements.filter(
      r => r.required && !uploadedDocs[r.id]
    );

    if (missingDocs.length > 0) {
      setUploadErrors(`Harap lengkapi dokumen wajib berikut: ${missingDocs.map(d => d.name).join(', ')}`);
      return;
    }

    // Check file sizes
    const oversized = uploadedList.some(doc => !doc.isValidSize);
    if (oversized) {
      setUploadErrors('Terdapat berkas yang melebihi batas ukuran 5.0 MB. Harap perkecil atau ganti berkas.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const categoryCode = selectedServiceDef.category === 'KTP-el' ? 'KTP' : selectedServiceDef.category === 'Kartu Keluarga' ? 'KK' : 'AKT';
    const regNumber = `REG-2026-${categoryCode}-${randomSuffix}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const mappedDocuments: RequiredDocument[] = selectedServiceDef.requirements.map(req => {
      const uploadInfo = uploadedDocs[req.id];
      return {
        id: req.id,
        name: req.name,
        description: req.description,
        required: req.required,
        uploadedFileName: uploadInfo?.fileName || `Dokumen_${req.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        uploadedFileSize: uploadInfo?.fileSizeFormatted || '1.20 MB',
        uploadedAt: nowStr,
        mockPreviewUrl: uploadInfo?.previewUrl || generateRealisticDocumentSvg(req.name, fullName || 'Pemohon Adminduk', nik || '3213010101010001')
      };
    });

    // Compile dynamic notes
    let dynamicNotes = notes;
    if (selectedServiceType === 'KTP_PENGGANTIAN') {
      dynamicNotes = `Alasan Penggantian: ${ktpReason}${policeReportNumber ? ` | No. Laporan Polisi: ${policeReportNumber}` : ''}. ${notes}`;
    } else if (selectedServiceType === 'KK_BARU' || selectedServiceType === 'KK_PERUBAHAN') {
      dynamicNotes = `Keterangan KK: ${kkReason} | Kepala Keluarga: ${familyHeadName || fullName} | Jml Anggota: ${familyMemberCount}${oldKkNumber ? ` | No KK Lama: ${oldKkNumber}` : ''}. ${notes}`;
    }

    const newRecord: ApplicationRecord = {
      id: `adm-${Date.now()}`,
      userId: currentUser?.id,
      registrationNumber: regNumber,
      serviceType: selectedServiceType,
      serviceCategory: selectedServiceDef.category,
      serviceTitle: selectedServiceDef.title,
      fullName,
      nik,
      phone,
      email: email || undefined,
      gender,
      birthPlace,
      birthDate,
      address,
      rtRw,
      kelurahan,
      kecamatan,
      kabupatenKota: 'Kabupaten Subang',
      provinsi: 'Jawa Barat',
      notes: dynamicNotes || undefined,
      reason: selectedServiceType === 'KTP_PENGGANTIAN' ? ktpReason : undefined,
      childName: selectedServiceType === 'AKTA_KELAHIRAN' ? childName : undefined,
      childBirthDate: selectedServiceType === 'AKTA_KELAHIRAN' ? childBirthDate : undefined,
      fatherName: selectedServiceType === 'AKTA_KELAHIRAN' ? fatherName : undefined,
      motherName: selectedServiceType === 'AKTA_KELAHIRAN' ? motherName : undefined,
      documents: mappedDocuments,
      status: 'DIPROSES',
      submittedAt: nowStr,
      updatedAt: nowStr,
      pickupEstimatedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickupLocation: 'Loket Disdukcapil / Layanan Mandiri Digital TTE'
    };

    onSubmitNewApplication(newRecord);
    setJustSubmittedApp(newRecord);
    setActiveMenu('STATUS');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner Pemohon */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Simpel Adminduk • Layanan Mandiri Online
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Portal Simpel Adminduk Subang
          </h2>
          <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">
            Sistem Pelayanan Administrasi Kependudukan: Ajukan permohonan KTP-el, Kartu Keluarga, dan Akta Kelahiran secara mandiri, pantau status verifikasi secara real-time, dan unduh serta cetak resi bukti pendaftaran resmi Disdukcapil Kabupaten Subang.
          </p>
        </div>
      </div>

      {/* QUICK STATUS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { setActiveMenu('STATUS'); setStatusFilter('ALL'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-blue-300 transition"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Total Pengajuan</span>
            <span className="text-2xl font-bold text-slate-900">{totalApps}</span>
            <span className="text-[11px] text-blue-600 font-medium block mt-0.5">Semua berkas</span>
          </div>
        </div>

        <div 
          onClick={() => { setActiveMenu('STATUS'); setStatusFilter('DIPROSES'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-300 transition"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Sedang Diproses</span>
            <span className="text-2xl font-bold text-amber-600">{diprosesCount}</span>
            <span className="text-[11px] text-amber-600/90 font-medium block mt-0.5">Antrean verifikasi</span>
          </div>
        </div>

        <div 
          onClick={() => { setActiveMenu('STATUS'); setStatusFilter('DISETUJUI'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Telah Disetujui</span>
            <span className="text-2xl font-bold text-emerald-600">{disetujuiCount}</span>
            <span className="text-[11px] text-emerald-600/90 font-medium block mt-0.5">Siap diambil / terbit</span>
          </div>
        </div>

        <div 
          onClick={() => { setActiveMenu('STATUS'); setStatusFilter('DITOLAK'); }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-rose-300 transition"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Ditolak / Perbaikan</span>
            <span className="text-2xl font-bold text-rose-600">{ditolakCount}</span>
            <span className="text-[11px] text-rose-600/90 font-medium block mt-0.5">Perlu revisi berkas</span>
          </div>
        </div>
      </div>

      {/* ROLE PEMOHON MENU NAVIGATION TABS - MODERN BLUE WITH CRISP WHITE LIST BORDER */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-2xl border-2 border-white p-2.5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          
          {/* Menu 1: Formulir Dinamis */}
          <button
            id="menu-pemohon-form"
            onClick={() => setActiveMenu('FORM')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeMenu === 'FORM'
                ? 'bg-white text-blue-950 shadow-lg border-2 border-white'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <PlusCircle className={`w-4 h-4 ${activeMenu === 'FORM' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span>Formulir Dinamis Layanan</span>
          </button>

          {/* Menu 2: Dashboard Status Permohonan */}
          <button
            id="menu-pemohon-status"
            onClick={() => setActiveMenu('STATUS')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeMenu === 'STATUS'
                ? 'bg-white text-blue-950 shadow-lg border-2 border-white'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <Clock className={`w-4 h-4 ${activeMenu === 'STATUS' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span>Dashboard Status ({myApplications.length})</span>
          </button>

          {/* Menu 3: Pencetakan Resi Tanda Terima Resmi */}
          <button
            id="menu-pemohon-receipt"
            onClick={() => setActiveMenu('RECEIPT')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition duration-200 ${
              activeMenu === 'RECEIPT'
                ? 'bg-white text-blue-950 shadow-lg border-2 border-white'
                : 'text-white/90 hover:bg-white/15 hover:text-white border border-white/20'
            }`}
          >
            <Printer className={`w-4 h-4 ${activeMenu === 'RECEIPT' ? 'text-blue-700' : 'text-blue-200'}`} />
            <span>Pencetakan Resi ({myApplications.length})</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MENU 1: FORMULIR DINAMIS & MOCKUP UPLOAD DOKUMEN DENGAN INDIKATOR UKURAN */}
      {/* ========================================================================= */}
      {activeMenu === 'FORM' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Bagian 1: Pemilihan Layanan Adminduk Dinamis */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  Pilih Kategori & Jenis Pelayanan Adminduk
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 pl-8">
                Pilih dokumen kependudukan yang diajukan. Formulir identitas dan daftar berkas persyaratan akan beradaptasi secara dinamis.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pl-0 sm:pl-8">
                {SERVICE_DEFINITIONS.map((srv) => {
                  const isSelected = selectedServiceType === srv.type;
                  return (
                    <div
                      key={srv.type}
                      onClick={() => {
                        setSelectedServiceType(srv.type);
                        setUploadedDocs({});
                        setUploadErrors(null);
                      }}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                            {srv.category}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                          {srv.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium flex items-center justify-between">
                        <span>Wajib: {srv.requirements.filter(r => r.required).length} Dokumen</span>
                        <span className="text-blue-600 font-semibold">Pilih Layanan →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bagian 2: Data Pemohon & Field Dinamis Sesuai Layanan */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  Data Identitas Pemohon ({selectedServiceDef.category})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 pl-8">
                Isi data dengan lengkap dan benar sesuai dengan data Kartu Keluarga dan KTP fisik.
              </p>

              <div className="pl-0 sm:pl-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Farhan Alamsyah"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* NIK */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="16 Digit NIK KTP"
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {nik.length}/16 digit kependudukan
                    </span>
                  </div>

                  {/* No Handphone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      No. WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-emerald-600 mt-0.5 block">
                      Notifikasi progres berkas dikirim ke nomor ini
                    </span>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="nama@email.com (opsional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  {/* Tempat Lahir */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      placeholder="Kota Tempat Lahir"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Lahir Pemohon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* RT / RW */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      RT / RW
                    </label>
                    <input
                      type="text"
                      placeholder="01/02"
                      value={rtRw}
                      onChange={(e) => setRtRw(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Kelurahan & Kecamatan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kelurahan / Desa
                    </label>
                    <input
                      type="text"
                      value={kelurahan}
                      onChange={(e) => setKelurahan(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kecamatan
                    </label>
                    <input
                      type="text"
                      value={kecamatan}
                      onChange={(e) => setKecamatan(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alamat Lengkap (Sesuai KTP/KK) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jl. Otista No. 12, Kel. Karanganyar, Kec. Subang"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* DYNAMIC SUB-FORM 1: KTP-EL (PENGGANTIAN RUSAK / HILANG / ELEMEN) */}
                {/* ========================================================================= */}
                {selectedServiceType === 'KTP_PENGGANTIAN' && (
                  <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 mt-4 space-y-3">
                    <h4 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Detail Keterangan Penggantian KTP-el
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-amber-950 mb-1">
                          Alasan Penggantian <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={ktpReason}
                          onChange={(e) => setKtpReason(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white text-slate-900"
                        >
                          <option value="KTP Fisik Rusak / Patah / Chip Terkelupas">KTP Fisik Rusak / Patah / Chip Terkelupas</option>
                          <option value="KTP Hilang (Wajib Lampirkan Surat Kehilangan Polisi)">KTP Hilang (Wajib Lampirkan Surat Kehilangan Polisi)</option>
                          <option value="Perubahan Status Perkawinan / Pekerjaan">Perubahan Status Perkawinan / Pekerjaan</option>
                          <option value="Pindah Datang / Perubahan Alamat Domisili">Pindah Datang / Perubahan Alamat Domisili</option>
                        </select>
                      </div>

                      {ktpReason.includes('Hilang') && (
                        <div>
                          <label className="block text-xs font-semibold text-amber-950 mb-1">
                            No. Surat Tanda Kehilangan Polisi <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: SKTL/142/II/2026/POLSEK"
                            value={policeReportNumber}
                            onChange={(e) => setPoliceReportNumber(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white text-slate-900"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* DYNAMIC SUB-FORM 2: KARTU KELUARGA (KK BARU & PERUBAHAN DATA) */}
                {/* ========================================================================= */}
                {(selectedServiceType === 'KK_BARU' || selectedServiceType === 'KK_PERUBAHAN') && (
                  <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200 mt-4 space-y-3">
                    <h4 className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Detail Pengajuan Kartu Keluarga (KK)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-indigo-950 mb-1">
                          Alasan Pengurusan KK <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={kkReason}
                          onChange={(e) => setKkReason(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-indigo-300 bg-white text-slate-900"
                        >
                          <option value="Keluarga Baru (Pernikahan)">Keluarga Baru (Pernikahan)</option>
                          <option value="Pecah Kartu Keluarga Mandiri">Pecah Kartu Keluarga Mandiri</option>
                          <option value="Penambahan Anggota Keluarga (Kelahiran)">Penambahan Anggota Keluarga (Kelahiran)</option>
                          <option value="Pengurangan Anggota (Kematian / Pindah)">Pengurangan Anggota (Kematian / Pindah)</option>
                          <option value="Perbaikan Data Elemen Anggota Keluarga">Perbaikan Data Elemen Anggota Keluarga</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-indigo-950 mb-1">
                          Nama Kepala Keluarga <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Sesuai kepala keluarga baru"
                          value={familyHeadName}
                          onChange={(e) => setFamilyHeadName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-indigo-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-indigo-950 mb-1">
                          Jumlah Anggota dalam KK Baru
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={15}
                          value={familyMemberCount}
                          onChange={(e) => setFamilyMemberCount(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-indigo-300 bg-white text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-indigo-950 mb-1">
                          Nomor Kartu Keluarga (KK) Asal / Lama
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16 Digit Nomor KK Lama"
                          value={oldKkNumber}
                          onChange={(e) => setOldKkNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-xs p-2 rounded-lg border border-indigo-300 bg-white font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* DYNAMIC SUB-FORM 3: AKTA KELAHIRAN */}
                {/* ========================================================================= */}
                {selectedServiceType === 'AKTA_KELAHIRAN' && (
                  <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 mt-4 space-y-4">
                    <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Data Bayi / Anak yang Didaftarkan Akta Kelahiran
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Nama Lengkap Anak/Bayi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nama lengkap anak"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Jenis Kelamin Anak <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={childGender}
                          onChange={(e) => setChildGender(e.target.value as any)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Tanggal Lahir Anak <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={childBirthDate}
                          onChange={(e) => setChildBirthDate(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Tempat Lahir (RS/Puskesmas/Rumah)
                        </label>
                        <input
                          type="text"
                          value={childBirthPlace}
                          onChange={(e) => setChildBirthPlace(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Berat & Panjang Lahir
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="3.2 kg"
                            value={birthWeight}
                            onChange={(e) => setBirthWeight(e.target.value)}
                            className="w-1/2 text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                          />
                          <input
                            type="text"
                            placeholder="49 cm"
                            value={birthLength}
                            onChange={(e) => setBirthLength(e.target.value)}
                            className="w-1/2 text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Jam Lahir
                        </label>
                        <input
                          type="time"
                          value={childBirthTime}
                          onChange={(e) => setChildBirthTime(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Nama Ayah Kandung <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Sesuai buku nikah"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Nama Ibu Kandung <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Sesuai buku nikah"
                          value={motherName}
                          onChange={(e) => setMotherName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-950 mb-1">
                          Nomor Akta Nikah Orang Tua
                        </label>
                        <input
                          type="text"
                          placeholder="No. Kutipan Akta Nikah KUA"
                          value={marriageCertNumber}
                          onChange={(e) => setMarriageCertNumber(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Catatan Tambahan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Tambahan untuk Petugas Verifikator
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan jika ada keterangan khusus mengenai berkas atau keperluan mendesak..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* Bagian 3: Mockup Upload Dokumen dengan Indikator Ukuran Berkas */}
            {/* ========================================================================= */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    Upload Dokumen Persyaratan & Indikator Ukuran Berkas
                  </h3>
                </div>
                
                {/* Meter Ringkasan Akumulatif */}
                <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-medium">
                  <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                  <span>Total Ukuran: <strong>{totalUploadedFormatted}</strong></span>
                  <span>•</span>
                  <span>Kelengkapan: <strong>{uploadedRequiredCount}/{totalRequiredCount} Wajib</strong></span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 pl-0 sm:pl-8">
                Unggah dokumen persyaratan resmi dalam format <strong>PDF, JPG, atau PNG</strong>. Batas maksimal ukuran adalah <strong>5.0 MB per berkas</strong>. Sistem dilengkapi indikator visual ukuran berkas dan pratinjau dokumen.
              </p>

              {uploadErrors && (
                <div className="mb-4 ml-0 sm:ml-8 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{uploadErrors}</span>
                </div>
              )}

              <div className="pl-0 sm:pl-8 space-y-3.5">
                {selectedServiceDef.requirements.map((req) => {
                  const uploaded = uploadedDocs[req.id];
                  const sizeInMB = uploaded ? (uploaded.fileSizeBytes / (1024 * 1024)) : 0;
                  const percentOfLimit = Math.min(100, Math.round((sizeInMB / 5.0) * 100));
                  const isPdf = uploaded?.isPdf || (uploaded?.fileName && uploaded.fileName.toLowerCase().endsWith('.pdf'));
                  
                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition flex flex-col gap-3 ${
                        uploaded
                          ? uploaded.isValidSize
                            ? 'border-emerald-200 bg-emerald-50/40 shadow-2xs'
                            : 'border-rose-300 bg-rose-50/40 shadow-2xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      {/* Hidden File Input for Real File Chooser */}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        ref={(el) => (fileInputRefs.current[req.id] = el)}
                        onChange={(e) => handleRealFileSelect(req.id, req.name, e)}
                        className="hidden"
                      />

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          
                          {/* Thumbnail / Status Icon */}
                          {uploaded ? (
                            <div 
                              onClick={() => setPreviewDocModal({
                                title: req.name,
                                url: uploaded.previewUrl,
                                fileName: uploaded.fileName,
                                size: uploaded.fileSizeFormatted,
                                fileType: uploaded.fileType,
                                isPdf: uploaded.isPdf
                              })}
                              className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border cursor-pointer relative group flex items-center justify-center transition shadow-2xs ${
                                uploaded.isValidSize ? 'border-emerald-300 bg-white' : 'border-rose-300 bg-rose-50'
                              }`}
                              title="Klik untuk membuka pratinjau dokumen"
                            >
                              {uploaded.previewUrl.startsWith('data:image/') || uploaded.previewUrl.startsWith('data:image/svg+xml') ? (
                                <>
                                  <img 
                                    src={uploaded.previewUrl} 
                                    alt={req.name} 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-rose-600">
                                  <FileText className="w-5 h-5" />
                                  <span className="text-[9px] font-bold tracking-tight mt-0.5">PDF</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl shrink-0 mt-0.5 bg-blue-100 text-blue-700">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900">
                                {req.name}
                              </span>
                              {req.required ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                                  Wajib
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
                                  Opsional
                                </span>
                              )}
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                Batas Maks. 5.0 MB
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{req.description}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end">
                          {uploaded ? (
                            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                              {/* Preview Button */}
                              <button
                                type="button"
                                onClick={() => setPreviewDocModal({
                                  title: req.name,
                                  url: uploaded.previewUrl,
                                  fileName: uploaded.fileName,
                                  size: uploaded.fileSizeFormatted,
                                  fileType: uploaded.fileType,
                                  isPdf: uploaded.isPdf
                                })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 text-xs font-semibold transition shadow-2xs"
                                title="Lihat Pratinjau Dokumen Asli"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Pratinjau Berkas</span>
                              </button>

                              {/* Re-upload / Replace */}
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[req.id]?.click()}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                                title="Ganti Berkas"
                              >
                                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                                <span className="hidden sm:inline">Ganti</span>
                              </button>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveUploadedDoc(req.id)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                                title="Hapus berkas ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {/* Option A: Select Real File */}
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[req.id]?.click()}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 text-blue-800 text-xs font-semibold shadow-2xs transition"
                                title="Pilih berkas dari komputer / ponsel Anda"
                              >
                                <UploadCloud className="w-4 h-4 text-blue-600" />
                                <span>Pilih Berkas</span>
                              </button>

                              {/* Option B: Fast Simulated Upload */}
                              <button
                                type="button"
                                onClick={() => handleSimulateUpload(req.id, req.name)}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs transition"
                                title="Gunakan berkas simulasi resmi yang sesuai"
                              >
                                <span>Simulasi Berkas</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* INDIKATOR UKURAN BERKAS & STATUS METER (JIKA BERKAS DIUNGGAH) */}
                      {uploaded && (
                        <div className="pt-2.5 border-t border-emerald-200/60 mt-1">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                            
                            {/* File Info Chip */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                                {isPdf ? 'PDF' : 'GAMBAR'}
                              </span>
                              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-800 text-[11px] truncate max-w-[220px]">
                                {uploaded.fileName}
                              </span>
                              <span className="text-[11px] text-slate-500 hidden sm:inline">
                                {uploaded.uploadedAt} WIB
                              </span>
                            </div>

                            {/* Size Indicator Bar & Status Badge */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                                <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                                  {uploaded.fileSizeFormatted} / 5.0 MB ({percentOfLimit}%)
                                </span>
                                
                                {/* Visual Progress Bar */}
                                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      !uploaded.isValidSize 
                                        ? 'bg-rose-600' 
                                        : percentOfLimit > 80 
                                        ? 'bg-amber-500' 
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${percentOfLimit}%` }}
                                  />
                                </div>
                              </div>

                              {uploaded.isValidSize ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                                  Ukuran Aman
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold shrink-0">
                                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  Melebihi Batas
                                </span>
                              )}
                            </div>

                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bagian 4: Pernyataan & Tombol Kirim */}
            <div className="pt-6 border-t border-slate-200 pl-0 sm:pl-8 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="declaration-checkbox"
                  required
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="declaration-checkbox" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                  Saya menyatakan bahwa seluruh data formulir dan berkas persyaratan yang saya unggah adalah sah, akurat, dan sesuai dengan ketentuan peraturan perundang-undangan Republik Indonesia.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Data terenkripsi aman dan diproses langsung oleh petugas Dinas Dukcapil.</span>
                </div>

                <button
                  id="btn-submit-application"
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Berkas Permohonan Adminduk</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MENU 2: DASHBOARD STATUS PERMOHONAN (DIPROSES, DISETUJUI, DITOLAK)        */}
      {/* ========================================================================= */}
      {activeMenu === 'STATUS' && (
        <div className="space-y-6">
          
          {/* Flash Alert if Just Submitted */}
          {justSubmittedApp && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-emerald-950">
                    Pengajuan Berhasil Dikirim ke Dinas Dukcapil!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Nomor Registrasi: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">{justSubmittedApp.registrationNumber}</span>. Berkas masuk ke antrean verifikasi petugas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-print-just-submitted"
                  onClick={() => onOpenReceipt(justSubmittedApp)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
                  title="Buka pratinjau resi pendaftaran sebelum mencetak ke printer atau menyimpan ke PDF"
                >
                  <Eye className="w-4 h-4" />
                  <span>Pratinjau & Cetak Resi</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Filter Tabs & Search Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Dashboard Status Permohonan Kependudukan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan riwayat berkas khusus akun pemohon: <strong className="text-blue-900">{currentUser?.fullName || 'Pemohon'}</strong> {currentUser?.nik ? `(NIK: ${currentUser.nik})` : ''}.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari No. Registrasi / Layanan..."
                  value={statusSearchTerm}
                  onChange={(e) => setStatusSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Buttons for Status */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Permohonan ({myApplications.length})
              </button>

              <button
                onClick={() => setStatusFilter('DIPROSES')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === 'DIPROSES'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Diproses ({diprosesCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('DISETUJUI')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === 'DISETUJUI'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Disetujui ({disetujuiCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('DITOLAK')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === 'DITOLAK'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Ditolak / Revisi ({ditolakCount})</span>
              </button>

              <div className="ml-auto">
                <button
                  onClick={() => setActiveMenu('FORM')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Buat Permohonan Baru</span>
                </button>
              </div>
            </div>
          </div>

          {/* List of Filtered Application Records */}
          <div className="space-y-4">
            {filteredUserApps.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-sm text-slate-700">Tidak Ada Permohonan Ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">
                  {statusFilter !== 'ALL' 
                    ? `Tidak ada berkas dengan status "${statusFilter}" pada akun Anda.` 
                    : `Belum ada berkas permohonan yang diajukan oleh akun ${currentUser?.fullName || 'Anda'}.`}
                </p>
                <button
                  onClick={() => setActiveMenu('FORM')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Mulai Ajukan Permohonan Sekarang</span>
                </button>
              </div>
            ) : (
              filteredUserApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-blue-300 hover:shadow-xs transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                          {app.registrationNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {app.submittedAt} WIB
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {app.serviceTitle}
                      </h4>
                      <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-3">
                        <span>Pemohon: <strong>{app.fullName}</strong></span>
                        <span>•</span>
                        <span>NIK: <strong className="font-mono">{app.nik}</strong></span>
                        <span>•</span>
                        <span>{app.documents.length} Berkas Terunggah</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {/* Status Badge */}
                      {app.status === 'DISETUJUI' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          DISETUJUI
                        </span>
                      ) : app.status === 'DITOLAK' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          DITOLAK (PERLU REVISI)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          SEDANG DIPROSES
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                        <button
                          onClick={() => onOpenReceipt(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
                          title="Cetak resi tanda terima resmi"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>Resi</span>
                        </button>
                        <button
                          onClick={() => onOpenDetail(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-2xs"
                        >
                          <span>Detail</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Progress Tracker */}
                  <div className="pt-4">
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      
                      {/* Step 1 */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] mb-1">
                          ✓
                        </div>
                        <span className="font-semibold text-slate-800">Berkas Masuk</span>
                        <span className="text-[10px] text-slate-400">Tersimpan</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] mb-1">
                          2
                        </div>
                        <span className="font-semibold text-slate-800">Verifikasi Berkas</span>
                        <span className="text-[10px] text-slate-400">Pemeriksaan Petugas</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                          app.status === 'DISETUJUI'
                            ? 'bg-blue-600 text-white'
                            : app.status === 'DITOLAK'
                            ? 'bg-rose-200 text-rose-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          3
                        </div>
                        <span className="font-semibold text-slate-800">Validasi & TTE</span>
                        <span className="text-[10px] text-slate-400">
                          {app.status === 'DISETUJUI' ? 'Disahkan' : app.status === 'DITOLAK' ? 'Dibatalkan' : 'Menunggu'}
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                          app.status === 'DISETUJUI'
                            ? 'bg-emerald-600 text-white'
                            : app.status === 'DITOLAK'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {app.status === 'DISETUJUI' ? '✓' : app.status === 'DITOLAK' ? '!' : '4'}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {app.status === 'DISETUJUI' ? 'Siap Diambil' : app.status === 'DITOLAK' ? 'Perlu Perbaikan' : 'Pengambilan'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {app.pickupEstimatedDate || 'Sesuai jadwal'}
                        </span>
                      </div>

                    </div>

                    {/* Rejection Alert Box */}
                    {app.status === 'DITOLAK' && app.rejectionReason && (
                      <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                        <span className="font-bold flex items-center gap-1.5 text-rose-950 mb-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          Catatan Alasan Penolakan Petugas Verifikator:
                        </span>
                        <p className="pl-5 text-rose-800 leading-relaxed font-medium">{app.rejectionReason}</p>
                        <p className="pl-5 text-[11px] text-rose-600 mt-1">
                          Silakan ajukan permohonan baru dengan melampirkan berkas yang telah diperbaiki.
                        </p>
                      </div>
                    )}

                    {/* Approval Information Box */}
                    {app.status === 'DISETUJUI' && (
                      <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-bold flex items-center gap-1.5 text-emerald-950 mb-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            Dokumen Selesai Diverifikasi & Diterbitkan:
                          </span>
                          <p className="pl-5 text-emerald-800">
                            {app.approvalNotes || 'Dokumen telah disahkan dan siap diambil di kantor Disdukcapil.'}
                          </p>
                          <p className="pl-5 text-[11px] text-emerald-700 font-semibold mt-0.5">
                            Lokasi: {app.pickupLocation || 'Loket Pelayanan Disdukcapil'} (Mulai tanggal: {app.pickupEstimatedDate || 'Hari kerja berikutnya'})
                          </p>
                        </div>
                        <button
                          id={`btn-status-receipt-preview-${app.id}`}
                          onClick={() => onOpenReceipt(app)}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
                          title="Buka pratinjau resi pengambilan sebelum dicetak ke printer atau disimpan ke PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau & Cetak Resi</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MENU 3: PENCETAKAN RESI TANDA TERIMA RESMI (SESUAI REVISI USER)          */}
      {/* ========================================================================= */}
      {activeMenu === 'RECEIPT' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-blue-600" />
                  <span>Pencetakan Resi Tanda Terima Pendaftaran Resmi</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Resi resmi permohonan khusus akun pemohon: <strong className="text-blue-900">{currentUser?.fullName || 'Pemohon'}</strong>. Tunjukkan nomor registrasi dan tanda terima sah ini saat pengambilan dokumen.
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {myApplications.length} Dokumen Terdaftar
              </span>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Printer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-sm text-slate-700">Belum Ada Resi Pendaftaran untuk Akun Anda</p>
                <p className="text-xs text-slate-400 mt-1">
                  Belum ada berkas permohonan atas nama akun {currentUser?.fullName || 'Anda'}. Silakan ajukan permohonan terlebih dahulu melalui menu Formulir Dinamis.
                </p>
                <button
                  onClick={() => setActiveMenu('FORM')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Buka Formulir Pendaftaran</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      {/* Letterhead Preview */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                        <div>
                          <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800 block">
                            DINAS KEPENDUDUKAN & PENCATATAN SIPIL
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Tanda Terima Pendaftaran Online
                          </span>
                        </div>
                        {app.status === 'DISETUJUI' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            DISETUJUI
                          </span>
                        ) : app.status === 'DITOLAK' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            DITOLAK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            DIPROSES
                          </span>
                        )}
                      </div>

                      {/* Content Preview */}
                      <div className="py-3 space-y-2 text-xs">
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-500">No. Registrasi:</span>
                          <span className="font-mono font-black text-blue-900 text-sm">
                            {app.registrationNumber}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-500">Layanan:</span>
                          <span className="font-semibold text-slate-800 text-right">
                            {app.serviceTitle}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-500">Nama Pemohon:</span>
                          <span className="font-bold text-slate-900">
                            {app.fullName}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-500">NIK:</span>
                          <span className="font-mono text-slate-700">
                            {app.nik}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-500">Waktu Masuk:</span>
                          <span className="text-slate-600">
                            {app.submittedAt} WIB
                          </span>
                        </div>
                      </div>

                      {/* Barcode & Security Mockup */}
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono my-2">
                        <span>||| | | |||| || | ||||| | ||</span>
                        <span>QR-VERIFIED</span>
                      </div>
                    </div>

                    {/* Print CTA */}
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenDetail(app)}
                        className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                      >
                        Detail Berkas
                      </button>

                      <button
                        id={`btn-open-preview-receipt-${app.id}`}
                        onClick={() => onOpenReceipt(app)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                        title="Buka pratinjau resi pendaftaran sebelum mencetak ke printer atau menyimpan ke PDF"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Pratinjau & Cetak Resi</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN PERSYARATAN REALISTIS & LENGKAP                   */}
      {/* ========================================================================= */}
      <DocumentPreviewModal
        data={previewDocModal}
        onClose={() => setPreviewDocModal(null)}
      />

    </div>
  );
};
