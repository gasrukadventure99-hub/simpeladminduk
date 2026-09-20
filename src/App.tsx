import React, { useState, useEffect, useMemo } from 'react';
import { 
  ApplicationRecord, 
  ApplicationStatus, 
  UserRole, 
  UserAccount, 
  WhatsAppNotification 
} from './types';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_ACCOUNTS, 
  INITIAL_WHATSAPP_NOTIFICATIONS 
} from './mockData';
import { Navbar } from './components/Navbar';
import { PublicLanding } from './components/PublicLanding';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ReceiptModal } from './components/ReceiptModal';
import { StatusChangeModal } from './components/StatusChangeModal';
import { DetailModal } from './components/DetailModal';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { CheckCircle2, AlertTriangle, Info, Shield, MessageCircle, LogIn, UserPlus, Database } from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchApplicationsFromSupabase,
  insertApplicationToSupabase,
  updateApplicationStatusInSupabase,
  deleteApplicationFromSupabase,
  fetchAccountsFromSupabase,
  insertAccountToSupabase,
  deleteAccountFromSupabase,
  fetchNotificationsFromSupabase,
  insertNotificationToSupabase,
  supabase
} from './lib/supabase';

const STORAGE_KEY_APPS = 'si_adminduk_applications_v2';
const STORAGE_KEY_ACCOUNTS = 'si_adminduk_accounts_v2';
const STORAGE_KEY_USER = 'si_adminduk_current_user_v2';
const STORAGE_KEY_WA = 'si_adminduk_wa_notifications_v2';

export default function App() {
  // 1. Registered Accounts
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read accounts', e);
    }
    return INITIAL_ACCOUNTS;
  });

  // 2. Current Logged-in User (null if guest)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read current user', e);
    }
    return null;
  });

  // 3. Applications list
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse applications', e);
    }
    return INITIAL_APPLICATIONS;
  });

  // 4. WhatsApp Notifications
  const [whatsappNotifications, setWhatsappNotifications] = useState<WhatsAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse WhatsApp notifications', e);
    }
    return INITIAL_WHATSAPP_NOTIFICATIONS;
  });

  // 5. Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'LOGIN_PEMOHON' | 'LOGIN_ADMIN' | 'REGISTER_PEMOHON'>('LOGIN_PEMOHON');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [activeReceiptApp, setActiveReceiptApp] = useState<ApplicationRecord | null>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<{
    app: ApplicationRecord;
    targetStatus: ApplicationStatus;
  } | null>(null);
  const [activeDetailApp, setActiveDetailApp] = useState<ApplicationRecord | null>(null);
  const [isExportHtmlOpen, setIsExportHtmlOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseConfigVersion, setSupabaseConfigVersion] = useState(0);

  // 6. Toast notifications
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
    waInfo?: boolean;
  } | null>(null);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WA, JSON.stringify(whatsappNotifications));
    } catch (e) {
      console.error(e);
    }
  }, [whatsappNotifications]);

  // =========================================================================
  // SUPABASE CLOUD DATABASE SYNCHRONIZATION & REALTIME LISTENER
  // =========================================================================
  const isSupabaseActive = useMemo(() => {
    // Re-evaluate whenever config version changes
    return isSupabaseConfigured();
  }, [supabaseConfigVersion]);
  const [isSyncingWithSupabase, setIsSyncingWithSupabase] = useState<boolean>(false);

  useEffect(() => {
    if (isSupabaseActive) {
      setIsSyncingWithSupabase(true);
      Promise.all([
        fetchApplicationsFromSupabase(),
        fetchAccountsFromSupabase(),
        fetchNotificationsFromSupabase(),
      ])
        .then(([remoteApps, remoteAccounts, remoteNotifs]) => {
          if (remoteApps && remoteApps.length > 0) {
            setApplications(remoteApps);
          } else if (remoteApps && remoteApps.length === 0 && applications.length > 0) {
            // Seed initial applications if remote table is freshly created
            applications.forEach((app) => insertApplicationToSupabase(app));
          }

          if (remoteAccounts && remoteAccounts.length > 0) {
            setAccounts(remoteAccounts);
          } else if (remoteAccounts && remoteAccounts.length === 0 && accounts.length > 0) {
            accounts.forEach((acc) => insertAccountToSupabase(acc));
          }

          if (remoteNotifs && remoteNotifs.length > 0) {
            setWhatsappNotifications(remoteNotifs);
          }
          setIsSyncingWithSupabase(false);
        })
        .catch((err) => {
          console.warn('[Supabase Sync Error]', err);
          setIsSyncingWithSupabase(false);
        });

      // Realtime subscription for instant multi-device synchronization
      if (supabase) {
        const channel = supabase
          .channel('realtime_adminduk_channel')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'applications' },
            () => {
              fetchApplicationsFromSupabase().then((apps) => {
                if (apps && apps.length > 0) setApplications(apps);
              });
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [isSupabaseActive, supabaseConfigVersion]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success', waInfo = false) => {
    setToastMessage({ text, type, waInfo });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Auth Handlers
  const handleOpenLogin = (mode: 'LOGIN_PEMOHON' | 'LOGIN_ADMIN' | 'REGISTER_PEMOHON' = 'LOGIN_PEMOHON') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    showToast(
      `Selamat datang, ${account.fullName}! Anda berhasil masuk sebagai ${
        account.role === 'ADMIN' ? 'Petugas Verifikator (Admin)' : 'Pemohon (Masyarakat)'
      }.`,
      'success'
    );
  };

  const handleRegisterSuccess = (newAccount: UserAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);

    // Save to Supabase Cloud Database if configured
    if (isSupabaseActive) {
      insertAccountToSupabase(newAccount);
    }

    // Send welcome WhatsApp notification
    const welcomeWa: WhatsAppNotification = {
      id: `wa-${Date.now()}`,
      applicationId: 'reg-welcome',
      registrationNumber: 'REG-USER-BARU',
      recipientPhone: newAccount.phone,
      recipientName: newAccount.fullName,
      message: `Halo ${newAccount.fullName.toUpperCase()},\n\nAkun Anda telah berhasil terdaftar di Sistem Pelayanan Online Administrasi Kependudukan (SI-ADMINDUK).\n\nNIK: ${newAccount.nik}\nEmail: ${newAccount.email}\n\nSekarang Anda dapat mengajukan permohonan KTP-el, KK, dan Akta Kelahiran secara mandiri.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`,
      type: 'REGISTRATION_CONFIRMATION',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'TERKIRIM'
    };

    setWhatsappNotifications((prev) => [welcomeWa, ...prev]);
    if (isSupabaseActive) {
      insertNotificationToSupabase(welcomeWa);
    }

    showToast(`Registrasi akun pemohon berhasil! Pesan konfirmasi dikirim ke WhatsApp Anda.`, 'success', true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah berhasil keluar (logout) dari sistem.', 'info');
  };

  // Applications Handlers
  const handleAddNewApplication = (newApp: ApplicationRecord) => {
    const recordWithUser: ApplicationRecord = {
      ...newApp,
      userId: newApp.userId || currentUser?.id,
    };
    setApplications((prev) => [recordWithUser, ...prev]);

    // Save directly to Supabase Cloud PostgreSQL
    if (isSupabaseActive) {
      insertApplicationToSupabase(recordWithUser);
    }

    // Automated WhatsApp confirmation notification
    const newWa: WhatsAppNotification = {
      id: `wa-${Date.now()}`,
      applicationId: newApp.id,
      registrationNumber: newApp.registrationNumber,
      recipientPhone: newApp.phone,
      recipientName: newApp.fullName,
      message: `Yth. Bpk/Ibu ${newApp.fullName.toUpperCase()},\n\nPermohonan Adminduk Anda No. *${newApp.registrationNumber}* (${newApp.serviceTitle}) telah *BERHASIL DITERIMA* oleh sistem online Disdukcapil.\n\nStatus saat ini: *SEDANG DIPROSES / ANTREAN VERIFIKASI*.\n\nAnda dapat memantau proses berkas dan mencetak tanda terima di portal SI-ADMINDUK.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`,
      type: 'REGISTRATION_CONFIRMATION',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'TERKIRIM'
    };

    setWhatsappNotifications((prev) => [newWa, ...prev]);
    if (isSupabaseActive) {
      insertNotificationToSupabase(newWa);
    }

    showToast(
      `Permohonan ${newApp.serviceTitle} berhasil dikirim! Data tersimpan ${isSupabaseActive ? 'di Cloud Supabase' : 'permanen'} & Notifikasi WA terkirim.`,
      'success',
      true
    );
  };

  const handleOpenReceiptForUser = (app: ApplicationRecord) => {
    if (currentUser?.role === 'PEMOHON') {
      const isOwner =
        (app.userId && app.userId === currentUser.id) ||
        (currentUser.nik && app.nik && app.nik.replace(/\s|-/g, '') === currentUser.nik.replace(/\s|-/g, '')) ||
        (currentUser.phone && app.phone && app.phone.replace(/\s|-/g, '') === currentUser.phone.replace(/\s|-/g, '')) ||
        (currentUser.email && app.email && app.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()) ||
        (currentUser.fullName && app.fullName && app.fullName.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase());

      if (!isOwner) {
        showToast('Akses ditolak: Anda hanya dapat melihat dan mencetak resi permohonan milik Anda sendiri.', 'error');
        return;
      }
    }
    setActiveReceiptApp(app);
  };

  const handleUpdateStatus = (
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
  ) => {
    let targetApp: ApplicationRecord | undefined;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          const updated: ApplicationRecord = {
            ...app,
            status: newStatus,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            processedBy: details.officerName || 'Drs. Hendra Irawan (Disdukcapil)',
            rejectionReason: details.rejectionReason,
            approvalNotes: details.approvalNotes,
            pickupEstimatedDate: details.pickupEstimatedDate,
            pickupLocation: details.pickupLocation,
          };
          targetApp = updated;
          return updated;
        }
        return app;
      })
    );

    // Send WhatsApp notification if checked
    if (details.sendWhatsApp && targetApp) {
      const waMsg = newStatus === 'DISETUJUI'
        ? `Yth. Bpk/Ibu ${targetApp.fullName.toUpperCase()},\n\nPermohonan Adminduk Anda No. *${targetApp.registrationNumber}* (${targetApp.serviceTitle}) telah *DISETUJUI* oleh Petugas Disdukcapil.\n\nDokumen fisik dapat diambil pada: *${details.pickupEstimatedDate || '3 Hari Kerja'}* di *${details.pickupLocation || 'Loket 2 Pelayanan Mandiri'}*.\n\nHarap membawa resi tanda terima pendaftaran saat pengambilan.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`
        : `Yth. Bpk/Ibu ${targetApp.fullName.toUpperCase()},\n\nMohon maaf, permohonan Adminduk No. *${targetApp.registrationNumber}* (${targetApp.serviceTitle}) berstatus *DITOLAK / PERLU REVISI*.\n\n*Alasan Penolakan:* ${details.rejectionReason || 'Dokumen persyaratan kurang lengkap/buram'}.\n\nSilakan login ke portal SI-ADMINDUK untuk memperbaiki berkas.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`;

      const newWa: WhatsAppNotification = {
        id: `wa-${Date.now()}`,
        applicationId: targetApp.id,
        registrationNumber: targetApp.registrationNumber,
        recipientPhone: targetApp.phone,
        recipientName: targetApp.fullName,
        message: waMsg,
        type: newStatus === 'DISETUJUI' ? 'STATUS_APPROVED' : 'STATUS_REJECTED',
        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'TERKIRIM'
      };

      setWhatsappNotifications((prev) => [newWa, ...prev]);
      if (isSupabaseActive) {
        insertNotificationToSupabase(newWa);
      }
    }

    // Persist status change to Supabase Cloud PostgreSQL
    if (isSupabaseActive) {
      updateApplicationStatusInSupabase(applicationId, {
        status: newStatus,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        processedBy: details.officerName || 'Drs. Hendra Irawan (Disdukcapil)',
        rejectionReason: details.rejectionReason,
        approvalNotes: details.approvalNotes,
        pickupEstimatedDate: details.pickupEstimatedDate,
        pickupLocation: details.pickupLocation,
      });
    }

    setStatusChangeTarget(null);

    showToast(
      `Status berkas berhasil diubah menjadi: ${newStatus}${details.sendWhatsApp ? ' & Notifikasi WhatsApp terkirim!' : ''}`,
      newStatus === 'DISETUJUI' ? 'success' : 'info',
      Boolean(details.sendWhatsApp)
    );
  };

  const handleSendManualWa = (notif: WhatsAppNotification) => {
    setWhatsappNotifications((prev) => [notif, ...prev]);
    if (isSupabaseActive) {
      insertNotificationToSupabase(notif);
    }
    showToast(`Pesan WhatsApp manual berhasil dikirim ke ${notif.recipientName} (${notif.recipientPhone})!`, 'success', true);
  };

  // User CRUD Handlers
  const handleCreateUser = (newAccount: UserAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
    if (isSupabaseActive) {
      insertAccountToSupabase(newAccount);
    }
  };

  const handleUpdateUser = (updatedAccount: UserAccount) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );
    if (isSupabaseActive) {
      insertAccountToSupabase(updatedAccount);
    }
    if (currentUser && currentUser.id === updatedAccount.id) {
      setCurrentUser(updatedAccount);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== userId));
    if (isSupabaseActive) {
      deleteAccountFromSupabase(userId);
    }
  };

  // Application CRUD Handlers (Update & Delete)
  const handleUpdateApplication = (updatedApp: ApplicationRecord) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
    if (isSupabaseActive) {
      insertApplicationToSupabase(updatedApp);
    }
  };

  const handleDeleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    if (isSupabaseActive) {
      deleteApplicationFromSupabase(appId);
    }
  };

  const handleResetMockData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data permohonan ke data awal?')) {
      setApplications(INITIAL_APPLICATIONS);
      showToast('Data aplikasi telah dikembalikan ke kondisi dummy awal.', 'info');
    }
  };

  const handleAddRandomMock = () => {
    const randomNames = [
      'Nadia Putri Utami',
      'Hendra Setiawan',
      'Maya Anggraini',
      'Bagus Pratama',
      'Dewi Lestari',
    ];
    const pickedName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomNik = '320112' + Math.floor(1000000000 + Math.random() * 9000000000);
    const services = [
      {
        type: 'KTP_BARU' as const,
        category: 'KTP-el' as const,
        title: 'Pembuatan KTP-el Baru (Pemula 17 Tahun)',
      },
      {
        type: 'KK_PERUBAHAN' as const,
        category: 'Kartu Keluarga' as const,
        title: 'Perubahan Elemen Data Kartu Keluarga (KK)',
      },
      {
        type: 'AKTA_KELAHIRAN' as const,
        category: 'Akta Kelahiran' as const,
        title: 'Penerbitan Kutipan Akta Kelahiran',
      },
    ];
    const pickedService = services[Math.floor(Math.random() * services.length)];
    const code = pickedService.category === 'KTP-el' ? 'KTP' : pickedService.category === 'Kartu Keluarga' ? 'KK' : 'AKT';
    const regNum = `REG-2026-${code}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const phone = '0812-4455-' + Math.floor(1000 + Math.random() * 9000);

    const mockApp: ApplicationRecord = {
      id: `adm-${Date.now()}`,
      registrationNumber: regNum,
      serviceType: pickedService.type,
      serviceCategory: pickedService.category,
      serviceTitle: pickedService.title,
      fullName: pickedName,
      nik: randomNik,
      phone,
      gender: Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan',
      birthPlace: 'Subang',
      birthDate: '1998-07-24',
      address: 'Jl. Otista No. ' + Math.floor(1 + Math.random() * 120),
      rtRw: '02/04',
      kelurahan: 'Karanganyar',
      kecamatan: 'Subang',
      kabupatenKota: 'Kabupaten Subang',
      provinsi: 'Jawa Barat',
      documents: [
        {
          id: 'doc-auto-1',
          name: 'Kartu Keluarga (KK) Asli',
          description: 'Scan KK Pemohon',
          required: true,
          uploadedFileName: 'KK_Scan_Terverifikasi.pdf',
          uploadedFileSize: '1.2 MB',
          uploadedAt: nowStr,
          mockPreviewUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=60',
        },
      ],
      status: 'DIPROSES',
      submittedAt: nowStr,
      updatedAt: nowStr,
      pickupEstimatedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickupLocation: 'Loket Disdukcapil Kota',
    };

    setApplications((prev) => [mockApp, ...prev]);

    // Send WA
    const newWa: WhatsAppNotification = {
      id: `wa-${Date.now()}`,
      applicationId: mockApp.id,
      registrationNumber: mockApp.registrationNumber,
      recipientPhone: mockApp.phone,
      recipientName: mockApp.fullName,
      message: `Yth. Bpk/Ibu ${mockApp.fullName.toUpperCase()},\n\nPermohonan Adminduk Anda No. *${mockApp.registrationNumber}* (${mockApp.serviceTitle}) telah *BERHASIL DITERIMA* oleh sistem online Disdukcapil.\n\nStatus saat ini: *SEDANG DIPROSES / ANTREAN VERIFIKASI*.\n\n_Dinas Kependudukan dan Pencatatan Sipil_`,
      type: 'REGISTRATION_CONFIRMATION',
      sentAt: nowStr,
      status: 'TERKIRIM'
    };
    setWhatsappNotifications((prev) => [newWa, ...prev]);

    showToast(`Permohonan simulasi baru masuk atas nama ${pickedName}!`, 'info', true);
  };

  const pendingCount = applications.filter((a) => a.status === 'DIPROSES').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
                : toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.waInfo ? (
              <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Government Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        pendingCount={pendingCount}
        waUnreadCount={whatsappNotifications.length}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {!currentUser ? (
          /* GUEST / PUBLIC LANDING: Accessible to public, NO ADMIN ACCESS VISIBLE */
          <PublicLanding
            onOpenLogin={handleOpenLogin}
            applications={applications}
            onOpenReceipt={setActiveReceiptApp}
            onOpenDetail={setActiveDetailApp}
          />
        ) : currentUser.role === 'PEMOHON' ? (
          /* ROLE: PEMOHON (MASYARAKAT) - NO ADMIN ACCESS MENU */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border-2 border-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-700 border-2 border-white flex items-center justify-center font-bold text-white shadow-xs">
                  👤
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                    Halo, {currentUser.fullName}!
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500 text-white font-black shadow-xs border border-white/40">Pemohon Terdaftar</span>
                  </h3>
                  <p className="text-xs text-slate-200">
                    NIK: {currentUser.nik} • No. WA: {currentUser.phone} • Kabupaten Subang
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-blue-950 text-xs font-black border-2 border-white transition flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Notifikasi WhatsApp Saya</span>
                </button>
              </div>
            </div>

            <UserView
              applications={applications}
              onSubmitNewApplication={handleAddNewApplication}
              onOpenReceipt={handleOpenReceiptForUser}
              onOpenDetail={setActiveDetailApp}
              currentUser={currentUser}
              onOpenLogin={() => handleOpenLogin('LOGIN_PEMOHON')}
              onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
            />
          </div>
        ) : (
          /* ROLE: ADMIN (PETUGAS) - PORTAL MENU UNLOCKED & ACTIVE */
          <AdminView
            applications={applications}
            onOpenDetail={setActiveDetailApp}
            onOpenStatusChange={(app, targetStatus = 'DISETUJUI') =>
              setStatusChangeTarget({ app, targetStatus })
            }
            onOpenReceipt={setActiveReceiptApp}
            onResetMockData={handleResetMockData}
            onAddRandomMock={handleAddRandomMock}
            onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            isSupabaseActive={isSupabaseActive}
            onLogout={handleLogout}
            accounts={accounts}
            currentUserId={currentUser?.id}
            currentUser={currentUser}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onCreateApplication={handleAddNewApplication}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            onShowToast={(msg, type) => showToast(msg, type || 'info')}
          />
        )}
      </main>

      {/* Global Modals */}

      {/* 1. Auth Modal (Login Pemohon, Register Pemohon, Login Admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        accounts={accounts}
      />

      {/* 2. WhatsApp Notification Center & Simulator */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        notifications={whatsappNotifications}
        applications={applications}
        currentRole={currentUser?.role || null}
        currentUserPhone={currentUser?.phone}
        onSendManualWa={handleSendManualWa}
      />

      {/* 3. Resi / Bukti Pendaftaran */}
      {activeReceiptApp && (
        <ReceiptModal
          application={activeReceiptApp}
          onClose={() => setActiveReceiptApp(null)}
          currentUser={currentUser}
        />
      )}

      {/* 4. Tindak Lanjut Status (Setujui / Tolak dengan Alasan & WhatsApp) */}
      {statusChangeTarget && (
        <StatusChangeModal
          application={statusChangeTarget.app}
          targetStatus={statusChangeTarget.targetStatus}
          onClose={() => setStatusChangeTarget(null)}
          onSave={handleUpdateStatus}
        />
      )}

      {/* 5. Detail Berkas Modal */}
      {activeDetailApp && (
        <DetailModal
          application={activeDetailApp}
          onClose={() => setActiveDetailApp(null)}
          onOpenStatusChange={(app) =>
            setStatusChangeTarget({ app, targetStatus: 'DISETUJUI' })
          }
          onOpenReceipt={(app) => handleOpenReceiptForUser(app)}
        />
      )}

      {/* 6. Single-File HTML Exporter */}
      {isExportHtmlOpen && (
        <ExportHtmlModal onClose={() => setIsExportHtmlOpen(false)} />
      )}

      {/* 7. Supabase Cloud Database Connection Modal (Khusus Role ADMIN) */}
      {currentUser?.role === 'ADMIN' && (
        <SupabaseConfigModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          applications={applications}
          accounts={accounts}
          notifications={whatsappNotifications}
          onConnectionSuccess={(msg) => {
            showToast(msg, 'success');
            setSupabaseConfigVersion((v) => v + 1);
          }}
        />
      )}

      {/* Government Footer - Modern Civic Palette: Putih, Abu muda, Biru primary, Biru muda secondary accent */}
      <footer className="no-print bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-slate-200 border-t-2 border-white/20 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-extrabold text-white text-sm flex items-center justify-center md:justify-start gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              Simpel Adminduk (Sistem Pelayanan Administrasi Kependudukan) Kabupaten Subang
            </h4>
            <p className="mt-1 text-slate-300 text-xs">
              Mewujudkan pelayanan Adminduk yang cepat, transparan, terintegrasi, dan ramah masyarakat.
            </p>
            <p className="text-[11px] text-white font-semibold mt-1">
              Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) • Pemerintah Kabupaten Subang
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-200">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Sesi Aktif:</span>
                <span className="px-2.5 py-1 rounded-md bg-white text-blue-950 font-black border border-white">
                  {currentUser.role === 'ADMIN' ? '🛡️ Petugas Disdukcapil' : '👤 Pemohon Terdaftar'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-rose-300 hover:text-white underline font-bold ml-1 transition"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenLogin('LOGIN_PEMOHON')}
                  className="text-white hover:text-sky-200 font-bold transition"
                >
                  Login Pemohon
                </button>
                <span className="text-white/40">•</span>
                <button
                  onClick={() => handleOpenLogin('REGISTER_PEMOHON')}
                  className="text-sky-300 hover:text-sky-200 font-black transition"
                >
                  Daftar Akun Baru
                </button>
                <span className="text-white/40">•</span>
                <button
                  onClick={() => handleOpenLogin('LOGIN_ADMIN')}
                  className="text-slate-200 hover:text-white font-medium transition"
                >
                  Portal Petugas
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}
