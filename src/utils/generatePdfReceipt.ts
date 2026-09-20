import { jsPDF } from 'jspdf';
import { ApplicationRecord } from '../types';

/**
 * Generate and trigger download of official PDF receipt for an ApplicationRecord
 */
export function generatePdfReceipt(app: ApplicationRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const leftMargin = 15;
  const rightMargin = 195;
  const contentWidth = rightMargin - leftMargin;
  let y = 14;

  // 1. HEADER / KOP SURAT PEMERINTAH KABUPATEN SUBANG
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('PEMERINTAH KABUPATEN SUBANG', pageWidth / 2, y, { align: 'center' });
  y += 5.5;

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138); // Blue 900
  doc.text('DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text('Simpel Adminduk (Sistem Pelayanan Administrasi Kependudukan) Online Mandiri', pageWidth / 2, y, { align: 'center' });
  y += 4;

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Jl. Raya Dangdeur KM. 2 Subang • Website: disdukcapil.subangkab.go.id • Helpdesk: 1500-537', pageWidth / 2, y, { align: 'center' });
  y += 3.5;

  // Double Divider Line (Thick + Thin)
  doc.setDrawColor(30, 58, 138); // Blue 900
  doc.setLineWidth(0.8);
  doc.line(leftMargin, y, rightMargin, y);
  y += 1;
  doc.setDrawColor(234, 179, 8); // Yellow 500 accent
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, rightMargin, y);
  y += 6;

  // 2. BANNER KOTAK RESI RESMI
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.roundedRect(leftMargin, y, contentWidth, 20, 2.5, 2.5, 'FD');

  // Left text: No. Registrasi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('BUKTI TANDA TERIMA PENDAFTARAN ONLINE RESMI', leftMargin + 4, y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text(app.registrationNumber, leftMargin + 4, y + 14);

  // Right: Status Badge
  const statusX = rightMargin - 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('STATUS BERKAS:', statusX, y + 6, { align: 'right' });

  let statusBg = [254, 243, 199]; // Amber 100
  let statusText = [180, 83, 9]; // Amber 700
  let statusLabel = 'SEDANG DIPROSES';

  if (app.status === 'DISETUJUI') {
    statusBg = [209, 250, 229]; // Emerald 100
    statusText = [4, 120, 87]; // Emerald 700
    statusLabel = 'DISETUJUI / SELESAI';
  } else if (app.status === 'DITOLAK') {
    statusBg = [254, 226, 226]; // Rose 100
    statusText = [185, 28, 28]; // Rose 700
    statusLabel = 'DITOLAK (PERBAIKAN)';
  }

  // Draw status badge
  const badgeWidth = 46;
  const badgeX = rightMargin - badgeWidth - 4;
  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.setDrawColor(statusText[0], statusText[1], statusText[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(badgeX, y + 8, badgeWidth, 7, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(statusText[0], statusText[1], statusText[2]);
  doc.text(statusLabel, badgeX + badgeWidth / 2, y + 13, { align: 'center' });

  y += 24;

  // Helper row drawer
  const drawSectionHeader = (title: string) => {
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.setDrawColor(199, 210, 254);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, y, contentWidth, 5.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text(title, leftMargin + 3, y + 4);
    y += 7.5;
  };

  const drawField = (label: string, value: string, col: 1 | 2 = 1, currentY = y) => {
    const startX = col === 1 ? leftMargin + 2 : leftMargin + (contentWidth / 2) + 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label, startX, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(value || '-', startX + 38, currentY);
  };

  // 3. INFORMASI LAYANAN
  drawSectionHeader('A. INFORMASI LAYANAN KEPENDUDUKAN');
  drawField('Jenis Layanan:', app.serviceTitle, 1, y);
  drawField('Waktu Masuk:', `${app.submittedAt} WIB`, 2, y);
  y += 5;
  drawField('Kategori Dokumen:', app.serviceCategory, 1, y);
  drawField('Pembaruan Terakhir:', `${app.updatedAt} WIB`, 2, y);
  y += 7;

  // 4. DATA IDENTITAS PEMOHON
  drawSectionHeader('B. DATA IDENTITAS PEMOHON');
  drawField('Nama Lengkap:', app.fullName, 1, y);
  drawField('NIK Pemohon:', app.nik, 2, y);
  y += 5;
  drawField('Nomor HP / WhatsApp:', app.phone, 1, y);
  drawField('Jenis Kelamin:', app.gender, 2, y);
  y += 5;
  drawField('Tempat / Tgl Lahir:', `${app.birthPlace || 'Subang'}, ${app.birthDate || '-'}`, 1, y);
  drawField('Email Terdaftar:', app.email || '-', 2, y);
  y += 5;

  // Full Address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Alamat KTP Lengkap:', leftMargin + 2, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const fullAddress = `${app.address}, RT/RW ${app.rtRw}, Kel/Desa ${app.kelurahan}, Kec. ${app.kecamatan}, ${app.kabupatenKota}, ${app.provinsi}`;
  const splitAddress = doc.splitTextToSize(fullAddress, contentWidth - 42);
  doc.text(splitAddress, leftMargin + 40, y);
  y += (splitAddress.length * 4) + 2;

  // Child details if Akta Kelahiran
  if (app.childName) {
    y += 1;
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(leftMargin + 2, y - 1, contentWidth - 4, 10, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(3, 105, 161);
    doc.text('DATA KELAHIRAN ANAK (AKTA KELAHIRAN):', leftMargin + 4, y + 2.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Nama Anak: ${app.childName} • Tgl Lahir: ${app.childBirthDate || '-'} • Orang Tua: ${app.fatherName || '-'} & ${app.motherName || '-'}`, leftMargin + 4, y + 6.5);
    y += 12;
  }

  // 5. DOKUMEN PERSYARATAN TERUNGGAH
  y += 1;
  drawSectionHeader('C. DOKUMEN PERSYARATAN YANG TELAH DIUNGGAH');
  if (app.documents && app.documents.length > 0) {
    app.documents.forEach((docItem) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105); // Green check
      doc.text('[✓]', leftMargin + 3, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(docItem.name, leftMargin + 9, y);

      doc.setTextColor(100, 116, 139);
      doc.text(`(${docItem.uploadedFileName || 'Terverifikasi secara digital'})`, leftMargin + 70, y);
      y += 4.5;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Tidak ada lampiran dokumen tambahan.', leftMargin + 4, y);
    y += 4.5;
  }
  y += 2;

  // 6. CATATAN PETUGAS / PANDUAN PENGAMBILAN DOKUMEN
  drawSectionHeader('D. PANDUAN PENGAMBILAN & CATATAN VERIFIKASI');
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(leftMargin, y, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('Petunjuk Pengambilan:', leftMargin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const pickupGuide = app.status === 'DITOLAK'
    ? `Perbaikan Berkas: ${app.rejectionReason || 'Silakan unggah ulang berkas sesuai catatan petugas verifikator.'}`
    : `${app.pickupLocation || 'Loket Pelayanan Disdukcapil Kab. Subang'}. Bawa resi ini beserta dokumen fisik asli untuk pencocokan berkas saat pengambilan.`;
  const splitGuide = doc.splitTextToSize(pickupGuide, contentWidth - 6);
  doc.text(splitGuide, leftMargin + 3, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text(`Estimasi Tanggal Pengambilan: ${app.pickupEstimatedDate || '3 Hari Kerja Setelah Verifikasi Disetujui'}`, leftMargin + 3, y + 15);

  y += 23;

  // 7. KOTAK VALIDASI DIGITAL & STEMPEL RESMI
  doc.setDrawColor(203, 213, 225);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(leftMargin, y, rightMargin, y);
  doc.setLineDashPattern([], 0);
  y += 4;

  // Left: QR / Barcode Security Simulation
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(leftMargin, y, 22, 22, 1, 1, 'FD');
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 41, 59);
  doc.text('[QR-CODE]', leftMargin + 4, y + 8);
  doc.text('TTE-BSrE', leftMargin + 4, y + 12);
  doc.text('VERIFIED', leftMargin + 3.5, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('Verifikasi Sertifikasi Elektronik (BSrE)', leftMargin + 26, y + 5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Security Hash: SEC-${app.registrationNumber.replace(/[^0-9]/g, '')}-SUBANG`, leftMargin + 26, y + 9.5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Dokumen ini sah dan terdaftar resmi di basis data SIAK Kemendagri & Disdukcapil Kabupaten Subang.', leftMargin + 26, y + 14);
  doc.text('Telah ditandatangani secara elektronik (TTE) sehingga tidak memerlukan tanda tangan basah.', leftMargin + 26, y + 18);

  // Right: Petugas info
  const rightColX = rightMargin - 45;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Subang, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), rightColX, y + 5);
  doc.text('Petugas Pelayanan:', rightColX, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text(app.processedBy || 'Seksi Pelayanan Adminduk', rightColX, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('NIP. 19820415 200801 1 009', rightColX, y + 18.5);

  y += 26;

  // 8. FOOTER RESMI
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const printTimestamp = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' });
  doc.text(`Dicetak secara otomatis oleh Simpel Adminduk (Sistem Pelayanan Administrasi Kependudukan) Kabupaten Subang pada: ${printTimestamp} WIB`, pageWidth / 2, 288, { align: 'center' });

  // Save the document directly as PDF file
  const sanitizedFilename = `Resi_Pendaftaran_${app.registrationNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(sanitizedFilename);
}
