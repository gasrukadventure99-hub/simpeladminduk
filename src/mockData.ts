import { ApplicationRecord } from './types';
import { generateRealisticDocumentSvg } from './utils/documentVisuals';

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'adm-001',
    userId: 'user-001',
    registrationNumber: 'REG-2026-KTP-4819',
    serviceType: 'KTP_BARU',
    serviceCategory: 'KTP-el',
    serviceTitle: 'Perekaman KTP-el Pemula (Usia 17 Tahun)',
    fullName: 'Bima Satria Wicaksono',
    nik: '3201121508070003',
    phone: '0812-3456-7890',
    email: 'bima.satria@example.com',
    gender: 'Laki-laki',
    birthPlace: 'Subang',
    birthDate: '2007-08-15',
    address: 'Jl. Pejuang 45 No. 14, RT 03 / RW 07',
    rtRw: '03/07',
    kelurahan: 'Karanganyar',
    kecamatan: 'Subang',
    kabupatenKota: 'Kabupaten Subang',
    provinsi: 'Jawa Barat',
    notes: 'Pemohon baru genap 17 tahun, membawa pengantar RT/RW.',
    documents: [
      {
        id: 'doc-1',
        name: 'Kartu Keluarga (KK) Asli',
        description: 'Scan atau foto jelas KK yang memuat data pemohon',
        required: true,
        uploadedFileName: 'KK_Keluarga_Wicaksono.pdf',
        uploadedFileSize: '1.40 MB',
        uploadedAt: '2026-09-10 09:30',
        mockPreviewUrl: generateRealisticDocumentSvg('Kartu Keluarga (KK) Asli', 'Bima Satria Wicaksono', '3201121508070003')
      },
      {
        id: 'doc-2',
        name: 'Akta Kelahiran',
        description: 'Scan Akta Kelahiran pemohon',
        required: true,
        uploadedFileName: 'Akta_Lahir_Bima.pdf',
        uploadedFileSize: '850 KB',
        uploadedAt: '2026-09-10 09:32',
        mockPreviewUrl: generateRealisticDocumentSvg('Akta Kelahiran', 'Bima Satria Wicaksono', '3201121508070003')
      },
      {
        id: 'doc-3',
        name: 'Pas Foto Formal (3x4 Background Merah)',
        description: 'Format JPG/PNG latar belakang merah/biru',
        required: true,
        uploadedFileName: 'Pasfoto_Bima_3x4.jpg',
        uploadedFileSize: '420 KB',
        uploadedAt: '2026-09-10 09:35',
        mockPreviewUrl: generateRealisticDocumentSvg('Pas Foto Formal (3x4 Background Merah)', 'Bima Satria Wicaksono', '3201121508070003')
      }
    ],
    status: 'DISETUJUI',
    submittedAt: '2026-09-10 09:40',
    updatedAt: '2026-09-11 14:20',
    processedBy: 'Drs. Hendra Irawan (NIP. 197805122005011004)',
    approvalNotes: 'Berkas lengkap dan data biometrik tervalidasi. Fisik KTP-el telah dicetak.',
    pickupEstimatedDate: '2026-09-15',
    pickupLocation: 'Loket 2 - Dinas Kependudukan dan Pencatatan Sipil Kabupaten Subang'
  },
  {
    id: 'adm-002',
    userId: 'user-002',
    registrationNumber: 'REG-2026-KK-9214',
    serviceType: 'KK_PERUBAHAN',
    serviceCategory: 'Kartu Keluarga',
    serviceTitle: 'Perubahan Data KK (Penambahan Anggota Baru)',
    fullName: 'Siti Nurhaliza',
    nik: '3201125203920005',
    phone: '0857-1122-3344',
    email: 'siti.nurhaliza@example.com',
    gender: 'Perempuan',
    birthPlace: 'Subang',
    birthDate: '1992-03-12',
    address: 'Komplek Griya Indah Blok C3 No. 8',
    rtRw: '02/05',
    kelurahan: 'Cigadung',
    kecamatan: 'Subang',
    kabupatenKota: 'Kabupaten Subang',
    provinsi: 'Jawa Barat',
    notes: 'Penambahan anak pertama bernama Rayhan Pratama.',
    documents: [
      {
        id: 'doc-kk-1',
        name: 'Kartu Keluarga (KK) Lama Asli',
        description: 'Scan lembar KK lama',
        required: true,
        uploadedFileName: 'KK_Lama_SitiNurhaliza.pdf',
        uploadedFileSize: '2.10 MB',
        uploadedAt: '2026-09-12 10:15',
        mockPreviewUrl: generateRealisticDocumentSvg('Kartu Keluarga (KK) Lama Asli', 'Siti Nurhaliza', '3201125203920005')
      },
      {
        id: 'doc-kk-2',
        name: 'Buku Nikah / Akta Perkawinan',
        description: 'Scan halaman identitas dan legalisasi',
        required: true,
        uploadedFileName: 'Buku_Nikah_Hal_1-4.pdf',
        uploadedFileSize: '3.00 MB',
        uploadedAt: '2026-09-12 10:18',
        mockPreviewUrl: generateRealisticDocumentSvg('Buku Nikah / Akta Perkawinan', 'Siti Nurhaliza', '3201125203920005')
      },
      {
        id: 'doc-kk-3',
        name: 'Surat Keterangan Lahir dari RS/Bidan',
        description: 'Bukti kelahiran anak dari faskes resmi',
        required: true,
        uploadedFileName: 'SKL_RSIA_Bunda.jpg',
        uploadedFileSize: '1.10 MB',
        uploadedAt: '2026-09-12 10:20',
        mockPreviewUrl: generateRealisticDocumentSvg('Surat Keterangan Lahir dari RS/Bidan', 'Siti Nurhaliza', '3201125203920005')
      }
    ],
    status: 'DIPROSES',
    submittedAt: '2026-09-12 10:25',
    updatedAt: '2026-09-12 13:00',
    processedBy: 'Petugas Verifikasi Tim C',
    approvalNotes: '',
    pickupEstimatedDate: '2026-09-16',
    pickupLocation: 'Pengiriman via PDF Tanda Tangan Elektronik (TTE) & Cetak Mandiri'
  },
  {
    id: 'adm-003',
    userId: 'user-003',
    registrationNumber: 'REG-2026-AKT-1048',
    serviceType: 'AKTA_KELAHIRAN',
    serviceCategory: 'Akta Kelahiran',
    serviceTitle: 'Penerbitan Akta Kelahiran Baru',
    fullName: 'Ahmad Fauzi Ridwan',
    nik: '3201122106880001',
    phone: '0813-8899-7711',
    email: 'ahmad.fauzi@example.com',
    gender: 'Laki-laki',
    birthPlace: 'Bandung',
    birthDate: '1988-06-21',
    address: 'Jl. Otto Iskandardinata No. 45',
    rtRw: '05/02',
    kelurahan: 'Soklat',
    kecamatan: 'Subang',
    kabupatenKota: 'Kabupaten Subang',
    provinsi: 'Jawa Barat',
    childName: 'Anindya Kirana Fauzi',
    childBirthDate: '2026-08-20',
    fatherName: 'Ahmad Fauzi Ridwan',
    motherName: 'Dewi Lestari',
    notes: 'Anak lahir di RSUD Kabupaten Subang, proses bersamaan dengan update KK.',
    documents: [
      {
        id: 'doc-akt-1',
        name: 'Surat Kelahiran dari RS / Bidan',
        description: 'Asli surat keterangan lahir',
        required: true,
        uploadedFileName: 'Surat_Kelahiran_RSUD.pdf',
        uploadedFileSize: '920 KB',
        uploadedAt: '2026-09-11 11:00',
        mockPreviewUrl: generateRealisticDocumentSvg('Surat Kelahiran dari RS / Bidan', 'Ahmad Fauzi Ridwan', '3201122106880001')
      },
      {
        id: 'doc-akt-2',
        name: 'Buku Nikah Orang Tua',
        description: 'Legalisir KUA atau scan asli',
        required: true,
        uploadedFileName: 'Buku_Nikah_Legalisir.pdf',
        uploadedFileSize: '2.40 MB',
        uploadedAt: '2026-09-11 11:05',
        mockPreviewUrl: generateRealisticDocumentSvg('Buku Nikah Orang Tua', 'Ahmad Fauzi Ridwan', '3201122106880001')
      },
      {
        id: 'doc-akt-3',
        name: 'Kartu Keluarga (KK)',
        description: 'KK Orang Tua',
        required: true,
        uploadedFileName: 'KK_Keluarga_Fauzi.pdf',
        uploadedFileSize: '1.20 MB',
        uploadedAt: '2026-09-11 11:10',
        mockPreviewUrl: generateRealisticDocumentSvg('Kartu Keluarga (KK)', 'Ahmad Fauzi Ridwan', '3201122106880001')
      },
      {
        id: 'doc-akt-4',
        name: 'KTP-el Kedua Saksi Kelahiran',
        description: 'Foto/Scan KTP saksi 1 dan saksi 2',
        required: true,
        uploadedFileName: 'KTP_Saksi_1_dan_2.jpg',
        uploadedFileSize: '780 KB',
        uploadedAt: '2026-09-11 11:12',
        mockPreviewUrl: generateRealisticDocumentSvg('KTP-el Kedua Saksi Kelahiran', 'Ahmad Fauzi Ridwan', '3201122106880001')
      }
    ],
    status: 'DIPROSES',
    submittedAt: '2026-09-11 11:15',
    updatedAt: '2026-09-11 15:30',
    processedBy: 'Sri Wahyuni, S.AP (Petugas Akta)',
    pickupEstimatedDate: '2026-09-17',
    pickupLocation: 'Penerbitan Digital PDF TTE Siap Unduh'
  },
  {
    id: 'adm-004',
    userId: 'user-004',
    registrationNumber: 'REG-2026-KTP-3312',
    serviceType: 'KTP_PENGGANTIAN',
    serviceCategory: 'KTP-el',
    serviceTitle: 'Penggantian KTP-el (Rusak / Chip Eror)',
    fullName: 'Rizky Ramadhan',
    nik: '3201120904950007',
    phone: '0821-9988-7766',
    email: 'rizky.ramadhan@example.com',
    gender: 'Laki-laki',
    birthPlace: 'Subang',
    birthDate: '1995-04-09',
    address: 'Jl. Letjen Suprapto No. 88',
    rtRw: '01/01',
    kelurahan: 'Pasirkareumbi',
    kecamatan: 'Subang',
    kabupatenKota: 'Kabupaten Subang',
    provinsi: 'Jawa Barat',
    reason: 'KTP patah terbagi dua dan lapisan laminasi mengelupas.',
    documents: [
      {
        id: 'doc-ktp-r1',
        name: 'Foto Fisik KTP-el Lama yang Rusak',
        description: 'Tampak jelas bagian depan dan belakang yang rusak',
        required: true,
        uploadedFileName: 'Foto_KTP_Rusak.jpg',
        uploadedFileSize: '650 KB',
        uploadedAt: '2026-09-08 14:10',
        mockPreviewUrl: generateRealisticDocumentSvg('Foto Fisik KTP-el Lama yang Rusak', 'Rizky Ramadhan', '3201120904950007')
      },
      {
        id: 'doc-ktp-r2',
        name: 'Kartu Keluarga (KK)',
        description: 'Scan KK asli',
        required: true,
        uploadedFileName: 'Scan_KK_Terbaru.pdf',
        uploadedFileSize: '1.50 MB',
        uploadedAt: '2026-09-08 14:12',
        mockPreviewUrl: generateRealisticDocumentSvg('Kartu Keluarga (KK)', 'Rizky Ramadhan', '3201120904950007')
      }
    ],
    status: 'DITOLAK',
    submittedAt: '2026-09-08 14:20',
    updatedAt: '2026-09-09 10:45',
    processedBy: 'Drs. Hendra Irawan (NIP. 197805122005011004)',
    rejectionReason: 'Lampiran foto KTP rusak terlalu buram dan NIK tidak terbaca. Harap unggah ulang foto fisik KTP dengan pencahayaan cukup serta sertakan fotokopi KK yang jelas.',
    pickupEstimatedDate: '-'
  },
  {
    id: 'adm-005',
    userId: 'user-005',
    registrationNumber: 'REG-2026-KK-7703',
    serviceType: 'KK_BARU',
    serviceCategory: 'Kartu Keluarga',
    serviceTitle: 'Penerbitan KK Baru Pasangan Baru Menikah',
    fullName: 'Dimas Wicaksono & Ratna Sari',
    nik: '3201121010970002',
    phone: '0878-3344-5566',
    email: 'dimas.ratna@example.com',
    gender: 'Laki-laki',
    birthPlace: 'Cianjur',
    birthDate: '1997-10-10',
    address: 'Perumahan Tamansari Blok D No. 12',
    rtRw: '04/06',
    kelurahan: 'Dangdeur',
    kecamatan: 'Subang',
    kabupatenKota: 'Kabupaten Subang',
    provinsi: 'Jawa Barat',
    notes: 'Pisah KK dari orang tua masing-masing karena sudah melangsungkan pernikahan sah.',
    documents: [
      {
        id: 'doc-kk-n1',
        name: 'Buku Nikah Asli (Suami & Istri)',
        description: 'Scan lengkap seluruh lembar',
        required: true,
        uploadedFileName: 'Buku_Nikah_Dimas_Ratna.pdf',
        uploadedFileSize: '3.40 MB',
        uploadedAt: '2026-09-07 08:30',
        mockPreviewUrl: generateRealisticDocumentSvg('Buku Nikah Asli (Suami & Istri)', 'Dimas Wicaksono & Ratna Sari', '3201121010970002')
      },
      {
        id: 'doc-kk-n2',
        name: 'KK Asli Orang Tua Suami & Istri',
        description: 'Untuk penarikan biodata',
        required: true,
        uploadedFileName: 'KK_Ortu_Kedua_Pihak.pdf',
        uploadedFileSize: '2.80 MB',
        uploadedAt: '2026-09-07 08:35',
        mockPreviewUrl: generateRealisticDocumentSvg('KK Asli Orang Tua Suami & Istri', 'Dimas Wicaksono & Ratna Sari', '3201121010970002')
      },
      {
        id: 'doc-kk-n3',
        name: 'KTP-el Suami & Istri',
        description: 'Scan KTP kedua belah pihak',
        required: true,
        uploadedFileName: 'KTP_Suami_Istri.jpg',
        uploadedFileSize: '900 KB',
        uploadedAt: '2026-09-07 08:38',
        mockPreviewUrl: generateRealisticDocumentSvg('KTP-el Suami & Istri', 'Dimas Wicaksono & Ratna Sari', '3201121010970002')
      }
    ],
    status: 'DISETUJUI',
    submittedAt: '2026-09-07 08:45',
    updatedAt: '2026-09-08 11:30',
    processedBy: 'Hj. Mardiah, S.Sos (Kasie Identitas Penduduk)',
    approvalNotes: 'KK Baru telah terbit dengan No. KK 3201121009260001. Dokumen format PDF bertanda tangan digital QR Code resmi BSrE.',
    pickupEstimatedDate: '2026-09-09',
    pickupLocation: 'Layanan Mandiri Cetak PDF Ber-TTE / Loket Dukcapil'
  }
];

export const SERVICE_DEFINITIONS: {
  type: ApplicationRecord['serviceType'];
  category: ApplicationRecord['serviceCategory'];
  title: string;
  description: string;
  requirements: Array<{ id: string; name: string; description: string; required: boolean }>;
}[] = [
  {
    type: 'KTP_BARU',
    category: 'KTP-el',
    title: 'Pembuatan KTP-el Baru (Pemula)',
    description: 'Bagi WNI yang telah berusia 17 tahun, sudah menikah, atau pernah menikah dan belum pernah memiliki KTP-el.',
    requirements: [
      { id: 'req-1', name: 'Fotokopi / Scan Kartu Keluarga (KK)', description: 'KK aktif yang mencantumkan nama pemohon', required: true },
      { id: 'req-2', name: 'Akta Kelahiran / Surat Kenal Lahir', description: 'Scan akta kelahiran asli yang jelas', required: true },
      { id: 'req-3', name: 'Pas Foto 3x4 (Background Merah/Biru)', description: 'Tahun kelahiran ganjil merah, genap biru', required: true }
    ]
  },
  {
    type: 'KTP_PENGGANTIAN',
    category: 'KTP-el',
    title: 'Penggantian KTP-el (Rusak / Hilang / Ubah Data)',
    description: 'Penerbitan ulang fisik KTP-el karena kondisi fisik rusak/patah, hilang, atau terjadi pembaruan elemen data kependudukan.',
    requirements: [
      { id: 'req-1', name: 'Surat Keterangan Kehilangan (Jika Hilang)', description: 'Surat tanda lapor kehilangan dari Kepolisian setempat', required: false },
      { id: 'req-2', name: 'Fisik KTP-el Lama yang Rusak (Jika Rusak)', description: 'Foto kondisi fisik KTP yang rusak/patah', required: false },
      { id: 'req-3', name: 'Kartu Keluarga (KK) Terbaru', description: 'Scan KK yang memuat data terbaru', required: true }
    ]
  },
  {
    type: 'KK_BARU',
    category: 'Kartu Keluarga',
    title: 'Penerbitan Kartu Keluarga (KK) Baru',
    description: 'Bagi pasangan baru menikah yang ingin membentuk KK mandiri terpisah dari orang tua, atau WNI yang baru pindah.',
    requirements: [
      { id: 'req-1', name: 'Buku Nikah / Kutipan Akta Perkawinan', description: 'Scan halaman depan & biodata pasangan', required: true },
      { id: 'req-2', name: 'KK Asli Orang Tua Masing-Masing', description: 'Untuk pemecahan dan pencabutan data', required: true },
      { id: 'req-3', name: 'KTP-el Suami dan Istri', description: 'Foto/Scan KTP-el asli', required: true }
    ]
  },
  {
    type: 'KK_PERUBAHAN',
    category: 'Kartu Keluarga',
    title: 'Perubahan Elemen Data Kartu Keluarga (KK)',
    description: 'Pembaruan data KK karena penambahan anak, pengurangan anggota, perubahan tingkat pendidikan, pekerjaan, atau alamat.',
    requirements: [
      { id: 'req-1', name: 'Kartu Keluarga (KK) Lama Asli', description: 'Scan lembar KK yang akan diubah', required: true },
      { id: 'req-2', name: 'Dokumen Dasar Perubahan Data', description: 'Contoh: Ijazah terakhir, Surat Lahir RS, SK Kematian, dsb.', required: true },
      { id: 'req-3', name: 'KTP-el Kepala Keluarga', description: 'Foto identitas kepala keluarga pemohon', required: true }
    ]
  },
  {
    type: 'AKTA_KELAHIRAN',
    category: 'Akta Kelahiran',
    title: 'Penerbitan Kutipan Akta Kelahiran',
    description: 'Pencatatan kelahiran baru untuk penerbitan Akta Kelahiran dan penerbitan NIK serta update KK sekaligus.',
    requirements: [
      { id: 'req-1', name: 'Surat Keterangan Lahir (Faskes/Bidan/RS)', description: 'Asli surat keterangan lahir resmi', required: true },
      { id: 'req-2', name: 'Buku Nikah / Akta Perkawinan Orang Tua', description: 'Legalisir KUA atau fotokopi jelas', required: true },
      { id: 'req-3', name: 'Kartu Keluarga (KK) Orang Tua', description: 'Scan KK orang tua anak', required: true },
      { id: 'req-4', name: 'KTP-el Kedua Orang Tua & 2 Orang Saksi', description: 'Gabungan scan KTP pemohon dan saksi', required: true }
    ]
  }
];

import { UserAccount, WhatsAppNotification } from './types';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-001',
    role: 'PEMOHON',
    nik: '3201121508070003',
    fullName: 'Bima Satria Wicaksono',
    email: 'bima.satria@example.com',
    phone: '0812-3456-7890',
    address: 'Jl. Pejuang 45 No. 14, RT 03 / RW 07, Subang',
    password: 'password123',
    registeredAt: '2026-09-01 08:00'
  },
  {
    id: 'user-002',
    role: 'PEMOHON',
    nik: '3201125203920005',
    fullName: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@example.com',
    phone: '0857-1122-3344',
    address: 'Komplek Griya Indah Blok C3 No. 8, Cigadung, Subang',
    password: 'password123',
    registeredAt: '2026-09-02 09:30'
  },
  {
    id: 'user-003',
    role: 'PEMOHON',
    nik: '3201122106880001',
    fullName: 'Ahmad Fauzi Ridwan',
    email: 'ahmad.fauzi@example.com',
    phone: '0813-8899-7711',
    address: 'Jl. Otto Iskandardinata No. 45, Soklat, Subang',
    password: 'password123',
    registeredAt: '2026-09-03 10:15'
  },
  {
    id: 'user-004',
    role: 'PEMOHON',
    nik: '3201120904950007',
    fullName: 'Rizky Ramadhan',
    email: 'rizky.ramadhan@example.com',
    phone: '0821-9988-7766',
    address: 'Jl. Letjen Suprapto No. 88, Pasirkareumbi, Subang',
    password: 'password123',
    registeredAt: '2026-09-04 11:20'
  },
  {
    id: 'admin-001',
    role: 'ADMIN',
    fullName: 'Drs. Hendra Irawan',
    nip: '197805122005011004',
    email: 'admin@dukcapil.subang.go.id',
    phone: '0811-9876-5432',
    department: 'Seksi Identitas Penduduk Disdukcapil Subang',
    password: 'admin',
    registeredAt: '2025-01-01 00:00'
  }
];

export const INITIAL_WHATSAPP_NOTIFICATIONS: WhatsAppNotification[] = [
  {
    id: 'wa-001',
    applicationId: 'adm-001',
    registrationNumber: 'REG-2026-KTP-4819',
    recipientPhone: '0812-3456-7890',
    recipientName: 'Bima Satria Wicaksono',
    type: 'STATUS_APPROVED',
    message: 'Yth. Bpk/Ibu BIMA SATRIA WICAKSONO,\n\nPermohonan Adminduk Anda No. *REG-2026-KTP-4819* (Perekaman KTP-el Pemula) telah *DISETUJUI* oleh Petugas Disdukcapil Kabupaten Subang.\n\nDokumen fisik telah dicetak dan siap diambil di: *Loket 2 Disdukcapil Kabupaten Subang* mulai tanggal 15 September 2026.\n\nHarap membawa bukti resi pendaftaran dan KK asli saat pengambilan.\n\n_Dinas Kependudukan dan Pencatatan Sipil Kabupaten Subang_',
    sentAt: '2026-09-11 14:21',
    status: 'DIBACA'
  },
  {
    id: 'wa-002',
    applicationId: 'adm-004',
    registrationNumber: 'REG-2026-KTP-3312',
    recipientPhone: '0821-9988-7766',
    recipientName: 'Rizky Ramadhan',
    type: 'STATUS_REJECTED',
    message: 'Yth. Bpk/Ibu RIZKY RAMADHAN,\n\nMohon maaf, permohonan Adminduk No. *REG-2026-KTP-3312* (Penggantian KTP-el) berstatus *DITOLAK / PERLU REVISI*.\n\n*Alasan:* Lampiran foto KTP rusak terlalu buram dan NIK tidak terbaca. Harap unggah ulang foto fisik KTP dengan pencahayaan cukup serta sertakan fotokopi KK yang jelas.\n\nSilakan login ke portal SI-ADMINDUK untuk memperbaiki berkas Anda.\n\n_Dinas Kependudukan dan Pencatatan Sipil Kabupaten Subang_',
    sentAt: '2026-09-09 10:46',
    status: 'DIBACA'
  },
  {
    id: 'wa-003',
    applicationId: 'adm-002',
    registrationNumber: 'REG-2026-KK-9214',
    recipientPhone: '0857-1122-3344',
    recipientName: 'Siti Nurhaliza',
    type: 'REGISTRATION_CONFIRMATION',
    message: 'Yth. Bpk/Ibu SITI NURHALIZA,\n\nBerkas permohonan Adminduk Anda No. *REG-2026-KK-9214* telah *BERHASIL DITERIMA* oleh sistem online Disdukcapil Kabupaten Subang.\n\nStatus saat ini: *SEDANG DIPROSES / ANTREAN VERIFIKASI*.\nAnda dapat memantau perkembangan berkas melalui portal SI-ADMINDUK kapan saja.\n\n_Dinas Kependudukan dan Pencatatan Sipil Kabupaten Subang_',
    sentAt: '2026-09-12 10:26',
    status: 'TERKIRIM'
  }
];
