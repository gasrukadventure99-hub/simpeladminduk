// Utility to generate realistic Indonesian Civil Registration (Adminduk) document visuals
// and handle preview rendering for user-uploaded files (images and PDFs)

export function getDocumentCategoryKey(docName: string): string {
  const lower = docName.toLowerCase();
  if (lower.includes('kartu keluarga') || lower.includes(' kk')) return 'KK';
  if (lower.includes('ktp') || lower.includes('identitas')) return 'KTP';
  if (lower.includes('akta kelahiran') || lower.includes('kenal lahir')) return 'AKTA_LAHIR';
  if (lower.includes('pas foto') || lower.includes('foto 3x4') || lower.includes('pasfoto')) return 'PAS_FOTO';
  if (lower.includes('buku nikah') || lower.includes('perkawinan')) return 'BUKU_NIKAH';
  if (lower.includes('kehilangan') || lower.includes('polisi') || lower.includes('sktlk')) return 'KEHILANGAN';
  if (lower.includes('surat keterangan lahir') || lower.includes('skl') || lower.includes('faskes') || lower.includes('bidan')) return 'SKL';
  return 'DEFAULT';
}

/**
 * Generates an ultra-crisp, realistic SVG Data URL for any adminduk requirement
 * so the preview strictly matches what the document is supposed to be.
 */
export function generateRealisticDocumentSvg(
  docName: string, 
  applicantName: string = 'BIMA SATRIA WICAKSONO',
  nik: string = '3213011508070003'
): string {
  const category = getDocumentCategoryKey(docName);
  const cleanName = (applicantName || 'WARGA KABUPATEN SUBANG').toUpperCase();
  const cleanNik = nik && nik.length === 16 ? nik : '3213011508070003';
  const nowYear = new Date().getFullYear();

  let svgContent = '';

  if (category === 'KK') {
    // Indonesian Kartu Keluarga format
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 580" width="850" height="580" style="background:#fefbf4; font-family:sans-serif;">
      <!-- Outer Border -->
      <rect x="15" y="15" width="820" height="550" fill="#fdfbf7" stroke="#1e3a8a" stroke-width="4" rx="6" />
      <rect x="22" y="22" width="806" height="536" fill="none" stroke="#2563eb" stroke-width="1.5" />
      
      <!-- Watermark Background -->
      <text x="425" y="320" font-size="64" fill="#93c5fd" opacity="0.12" text-anchor="middle" font-weight="900" transform="rotate(-15 425 320)">KABUPATEN SUBANG</text>
      
      <!-- Header -->
      <text x="425" y="60" font-size="20" font-weight="900" fill="#1e3a8a" text-anchor="middle" letter-spacing="3">REPUBLIK INDONESIA</text>
      <text x="425" y="88" font-size="24" font-weight="900" fill="#1e293b" text-anchor="middle" letter-spacing="2">KARTU KELUARGA</text>
      <text x="425" y="115" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">No. 3213012809120004</text>
      
      <!-- Family Info Box -->
      <g font-size="11" fill="#334155">
        <text x="45" y="145" font-weight="bold">Nama Kepala Keluarga</text>
        <text x="180" y="145">: ${cleanName}</text>
        
        <text x="45" y="165" font-weight="bold">Alamat</text>
        <text x="180" y="165">: JL. RAYA SUBANG NO. 45</text>
        
        <text x="45" y="185" font-weight="bold">RT / RW</text>
        <text x="180" y="185">: 003 / 007</text>
        
        <text x="45" y="205" font-weight="bold">Desa / Kelurahan</text>
        <text x="180" y="205">: KARANGANYAR</text>
        
        <text x="520" y="145" font-weight="bold">Kecamatan</text>
        <text x="630" y="145">: SUBANG</text>
        
        <text x="520" y="165" font-weight="bold">Kabupaten / Kota</text>
        <text x="630" y="165">: KABUPATEN SUBANG</text>
        
        <text x="520" y="185" font-weight="bold">Kode Pos</text>
        <text x="630" y="185">: 41211</text>
        
        <text x="520" y="205" font-weight="bold">Provinsi</text>
        <text x="630" y="205">: JAWA BARAT</text>
      </g>
      
      <!-- Table 1 -->
      <rect x="40" y="225" width="770" height="24" fill="#1e3a8a" />
      <g font-size="10" font-weight="bold" fill="#ffffff">
        <text x="50" y="241">No</text>
        <text x="80" y="241">Nama Lengkap</text>
        <text x="260" y="241">NIK</text>
        <text x="400" y="241">Jenis Kelamin</text>
        <text x="490" y="241">Tempat Lahir</text>
        <text x="590" y="241">Tanggal Lahir</text>
        <text x="700" y="241">Agama</text>
      </g>
      
      <!-- Row 1 -->
      <rect x="40" y="249" width="770" height="26" fill="#f8fafc" stroke="#cbd5e1" />
      <g font-size="10" fill="#0f172a">
        <text x="54" y="266">1</text>
        <text x="80" y="266" font-weight="bold">${cleanName}</text>
        <text x="260" y="266" font-family="monospace">${cleanNik}</text>
        <text x="400" y="266">LAKI-LAKI</text>
        <text x="490" y="266">SUBANG</text>
        <text x="590" y="266">15-08-1988</text>
        <text x="700" y="266">ISLAM</text>
      </g>
      
      <!-- Row 2 -->
      <rect x="40" y="275" width="770" height="26" fill="#ffffff" stroke="#cbd5e1" />
      <g font-size="10" fill="#0f172a">
        <text x="54" y="292">2</text>
        <text x="80" y="292" font-weight="bold">SITI NUR AISYAH</text>
        <text x="260" y="292" font-family="monospace">3213015509900002</text>
        <text x="400" y="292">PEREMPUAN</text>
        <text x="490" y="292">SUBANG</text>
        <text x="590" y="292">15-09-1990</text>
        <text x="700" y="292">ISLAM</text>
      </g>
      
      <!-- Row 3 -->
      <rect x="40" y="301" width="770" height="26" fill="#f8fafc" stroke="#cbd5e1" />
      <g font-size="10" fill="#0f172a">
        <text x="54" y="318">3</text>
        <text x="80" y="318" font-weight="bold">RAYHAN PRATAMA</text>
        <text x="260" y="318" font-family="monospace">3213011204220001</text>
        <text x="400" y="318">LAKI-LAKI</text>
        <text x="490" y="318">SUBANG</text>
        <text x="590" y="318">12-04-2022</text>
        <text x="700" y="318">ISLAM</text>
      </g>

      <!-- Table 2 (Pendidikan, Pekerjaan, Status) -->
      <rect x="40" y="335" width="770" height="22" fill="#2563eb" />
      <g font-size="9" font-weight="bold" fill="#ffffff">
        <text x="50" y="350">No</text>
        <text x="80" y="350">Pendidikan</text>
        <text x="200" y="350">Jenis Pekerjaan</text>
        <text x="350" y="350">Status Perkawinan</text>
        <text x="500" y="350">Status Hubungan</text>
        <text x="630" y="350">Kewarganegaraan</text>
      </g>
      <rect x="40" y="357" width="770" height="24" fill="#ffffff" stroke="#cbd5e1" />
      <g font-size="9" fill="#0f172a">
        <text x="54" y="373">1</text>
        <text x="80" y="373">STRATA I (S1)</text>
        <text x="200" y="373">KARYAWAN SWASTA</text>
        <text x="350" y="373">KAWIN</text>
        <text x="500" y="373">KEPALA KELUARGA</text>
        <text x="630" y="373">WNI</text>
      </g>

      <!-- Footer & Signatures -->
      <g font-size="10" fill="#0f172a">
        <text x="80" y="430" text-anchor="middle">KEPALA KELUARGA</text>
        <line x1="30" y1="490" x2="130" y2="490" stroke="#000" stroke-width="1" />
        <text x="80" y="505" font-weight="bold" text-anchor="middle">${cleanName}</text>
        
        <text x="680" y="420" text-anchor="middle">SUBANG, 10 JANUARI ${nowYear}</text>
        <text x="680" y="435" text-anchor="middle" font-weight="bold">KEPALA DINAS KEPENDUDUKAN</text>
        <text x="680" y="448" text-anchor="middle" font-weight="bold">DAN PENCATATAN SIPIL</text>
        
        <!-- BSrE QR Code Simulation -->
        <rect x="650" y="455" width="60" height="60" fill="#ffffff" stroke="#1e3a8a" stroke-width="2" />
        <rect x="656" y="461" width="16" height="16" fill="#1e3a8a" />
        <rect x="688" y="461" width="16" height="16" fill="#1e3a8a" />
        <rect x="656" y="493" width="16" height="16" fill="#1e3a8a" />
        <circle cx="680" cy="485" r="4" fill="#1e3a8a" />
        
        <text x="680" y="530" font-size="9" text-anchor="middle" font-weight="bold">Drs. H. SUMASNA, M.Si</text>
        <text x="680" y="542" font-size="8" text-anchor="middle" fill="#64748b">NIP. 19680814 199303 1 005</text>
      </g>
    </svg>`;
  } 
  else if (category === 'KTP') {
    // Indonesian e-KTP card format
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 405" width="640" height="405" style="background:#67e8f9; font-family:sans-serif;">
      <!-- Card Body with Guilloche Pattern -->
      <defs>
        <linearGradient id="ktpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="50%" stop-color="#7dd3fc" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="640" height="405" rx="20" fill="url(#ktpGrad)" stroke="#0369a1" stroke-width="3" />
      
      <!-- Top Title -->
      <text x="320" y="38" font-size="16" font-weight="900" fill="#0c4a6e" text-anchor="middle" letter-spacing="2">PROVINSI JAWA BARAT</text>
      <text x="320" y="60" font-size="18" font-weight="900" fill="#082f49" text-anchor="middle" letter-spacing="1">KABUPATEN SUBANG</text>
      
      <!-- NIK Bar -->
      <text x="45" y="96" font-size="13" font-weight="bold" fill="#082f49">NIK</text>
      <text x="140" y="96" font-size="20" font-weight="900" fill="#082f49" font-family="monospace" letter-spacing="2">: ${cleanNik}</text>
      
      <!-- Field List -->
      <g font-size="11" fill="#082f49" font-weight="bold">
        <text x="45" y="125">Nama</text>
        <text x="175" y="125">: ${cleanName}</text>
        
        <text x="45" y="148">Tempat/Tgl Lahir</text>
        <text x="175" y="148">: SUBANG, 15-08-2007</text>
        
        <text x="45" y="171">Jenis Kelamin</text>
        <text x="175" y="171">: LAKI-LAKI</text>
        <text x="330" y="171">Gol. Darah : O</text>
        
        <text x="45" y="194">Alamat</text>
        <text x="175" y="194">: JL. PEJUANG 45 NO. 14</text>
        
        <text x="70" y="217">RT/RW</text>
        <text x="175" y="217">: 003 / 007</text>
        
        <text x="70" y="240">Kel/Desa</text>
        <text x="175" y="240">: KARANGANYAR</text>
        
        <text x="70" y="263">Kecamatan</text>
        <text x="175" y="263">: SUBANG</text>
        
        <text x="45" y="286">Agama</text>
        <text x="175" y="286">: ISLAM</text>
        
        <text x="45" y="309">Status Perkawinan</text>
        <text x="175" y="309">: BELUM KAWIN</text>
        
        <text x="45" y="332">Pekerjaan</text>
        <text x="175" y="332">: PELAJAR / MAHASISWA</text>
        
        <text x="45" y="355">Kewarganegaraan</text>
        <text x="175" y="355">: WNI</text>
        
        <text x="45" y="378">Berlaku Hingga</text>
        <text x="175" y="378">: SEUMUR HIDUP</text>
      </g>
      
      <!-- Photo Area (3x4 aspect on right side) -->
      <rect x="470" y="105" width="130" height="170" rx="8" fill="#b91c1c" stroke="#ffffff" stroke-width="3" />
      <!-- Silhouette in photo -->
      <circle cx="535" cy="165" r="34" fill="#f8fafc" />
      <path d="M495 270 C495 210, 575 210, 575 270 Z" fill="#f8fafc" />
      
      <!-- Hologram Chip Icon -->
      <rect x="520" y="72" width="30" height="24" rx="4" fill="#fbbf24" stroke="#d97706" />
      <line x1="520" y1="84" x2="550" y2="84" stroke="#d97706" />
      <line x1="535" y1="72" x2="535" y2="96" stroke="#d97706" />
      
      <!-- Signature Area -->
      <g fill="#082f49" text-anchor="middle">
        <text x="535" y="300" font-size="10" font-weight="bold">SUBANG</text>
        <text x="535" y="315" font-size="9">10-09-2024</text>
        <!-- Signature scribble -->
        <path d="M490 350 Q520 330 535 345 T580 340" fill="none" stroke="#082f49" stroke-width="2.5" />
      </g>
    </svg>`;
  }
  else if (category === 'AKTA_LAHIR') {
    // Official Akta Kelahiran
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" style="background:#fefbf4; font-family:sans-serif;">
      <!-- Green/Gold Ornate Border -->
      <rect x="20" y="20" width="560" height="760" fill="#fdfbf7" stroke="#065f46" stroke-width="5" rx="8" />
      <rect x="28" y="28" width="544" height="744" fill="none" stroke="#d97706" stroke-width="2" />
      
      <!-- Top Crest & Header -->
      <circle cx="300" cy="75" r="30" fill="#fef3c7" stroke="#b45309" stroke-width="2" />
      <text x="300" y="82" font-size="20" font-weight="bold" fill="#b45309" text-anchor="middle">★</text>
      
      <text x="300" y="130" font-size="16" font-weight="900" fill="#065f46" text-anchor="middle" letter-spacing="3">REPUBLIK INDONESIA</text>
      <text x="300" y="152" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL</text>
      <text x="300" y="170" font-size="13" font-weight="bold" fill="#065f46" text-anchor="middle">KABUPATEN SUBANG</text>
      
      <line x1="80" y1="185" x2="520" y2="185" stroke="#d97706" stroke-width="1.5" />
      
      <text x="300" y="215" font-size="20" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="2">KUTIPAN AKTA KELAHIRAN</text>
      <text x="300" y="235" font-size="11" font-weight="bold" fill="#64748b" text-anchor="middle">WARGA NEGARA INDONESIA</text>
      <text x="300" y="255" font-size="12" font-family="monospace" fill="#0f172a" text-anchor="middle">Nomor: 3213-LT-15082007-0042</text>
      
      <!-- Body Text -->
      <g font-size="12" fill="#1e293b" line-height="1.6">
        <text x="60" y="295">Bahwa di : <tspan font-weight="bold">SUBANG</tspan></text>
        <text x="60" y="325">Pada tanggal : <tspan font-weight="bold">LIMA BELAS AGUSTUS DUA RIBU TUJUH (15-08-2007)</tspan></text>
        <text x="60" y="355">Telah lahir seorang anak bernama :</text>
        
        <rect x="60" y="375" width="480" height="40" fill="#ecfdf5" stroke="#10b981" rx="6" />
        <text x="300" y="401" font-size="17" font-weight="900" fill="#065f46" text-anchor="middle">${cleanName}</text>
        
        <text x="60" y="445">Anak ke : <tspan font-weight="bold">PERTAMA (1)</tspan>, LAKI-LAKI</text>
        <text x="60" y="475">Dari orang tua suami-istri sah :</text>
        <text x="60" y="505" font-weight="bold">AYAH : WICAKSONO HARYADI</text>
        <text x="60" y="535" font-weight="bold">IBU  : ENDANG SULISTYOWATI</text>
      </g>
      
      <line x1="80" y1="575" x2="520" y2="575" stroke="#cbd5e1" stroke-width="1" />
      
      <!-- Footer Authority -->
      <g font-size="11" fill="#0f172a">
        <text x="400" y="615" text-anchor="middle">Diterbitkan di Subang</text>
        <text x="400" y="632" text-anchor="middle">Pada tanggal 20 Agustus 2007</text>
        <text x="400" y="652" text-anchor="middle" font-weight="bold">KEPALA DINAS KEPENDUDUKAN</text>
        <text x="400" y="667" text-anchor="middle" font-weight="bold">DAN PENCATATAN SIPIL</text>
        
        <!-- Red Seal -->
        <circle cx="200" cy="670" r="45" fill="none" stroke="#dc2626" stroke-width="3" stroke-dasharray="4 2" />
        <text x="200" y="665" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">DISDUKCAPIL</text>
        <text x="200" y="678" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">KAB. SUBANG</text>
        
        <!-- TTE BSrE QR -->
        <rect x="375" y="680" width="50" height="50" fill="#ffffff" stroke="#065f46" stroke-width="2" />
        <rect x="380" y="685" width="12" height="12" fill="#065f46" />
        <rect x="408" y="685" width="12" height="12" fill="#065f46" />
        <rect x="380" y="713" width="12" height="12" fill="#065f46" />
        
        <text x="400" y="750" font-size="10" font-weight="bold" text-anchor="middle">Drs. H. SUMASNA, M.Si</text>
      </g>
    </svg>`;
  }
  else if (category === 'PAS_FOTO') {
    // Official 3x4 Red Background Passport Photo
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 600" width="450" height="600" style="background:#dc2626; font-family:sans-serif;">
      <!-- Solid Studio Red Background -->
      <rect x="0" y="0" width="450" height="600" fill="#b91c1c" />
      
      <!-- Studio Lighting Vignette -->
      <circle cx="225" cy="240" r="220" fill="#ef4444" opacity="0.4" />
      
      <!-- Person Silhouette -->
      <!-- Head -->
      <circle cx="225" cy="220" r="85" fill="#f8fafc" />
      <!-- Hair/Silhouette -->
      <path d="M140 210 Q225 100 310 210 Q225 140 140 210 Z" fill="#0f172a" />
      
      <!-- Formal Shirt & Blazer -->
      <path d="M70 600 C70 420, 380 420, 380 600 Z" fill="#0f172a" />
      <!-- White Shirt Collar -->
      <polygon points="225,410 180,340 270,340" fill="#ffffff" />
      <!-- Tie -->
      <polygon points="225,370 215,410 225,580 235,410" fill="#1e3a8a" />
      
      <!-- Frame Overlay -->
      <rect x="10" y="10" width="430" height="580" fill="none" stroke="#ffffff" stroke-width="3" rx="8" />
      
      <!-- Official Watermark Stamp -->
      <rect x="40" y="530" width="370" height="35" rx="6" fill="#0f172a" opacity="0.85" />
      <text x="225" y="552" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">
        PAS FOTO RESMI 3x4 • DISDUKCAPIL SUBANG
      </text>
    </svg>`;
  }
  else if (category === 'BUKU_NIKAH') {
    // Official Buku Nikah KUA
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 500" width="650" height="500" style="background:#064e3b; font-family:sans-serif;">
      <!-- Green Cover with Golden Ornaments -->
      <rect x="15" y="15" width="620" height="470" rx="14" fill="#064e3b" stroke="#f59e0b" stroke-width="4" />
      <rect x="25" y="25" width="600" height="450" rx="10" fill="none" stroke="#d97706" stroke-width="1.5" />
      
      <circle cx="325" cy="110" r="42" fill="#047857" stroke="#f59e0b" stroke-width="2" />
      <text x="325" y="118" font-size="24" fill="#fef08a" text-anchor="middle">★</text>
      
      <text x="325" y="180" font-size="16" font-weight="bold" fill="#fef08a" text-anchor="middle" letter-spacing="2">KEMENTERIAN AGAMA REPUBLIK INDONESIA</text>
      <text x="325" y="215" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">KUTIPAN AKTA NIKAH</text>
      
      <!-- Inner White Document Plate -->
      <rect x="55" y="240" width="540" height="205" rx="8" fill="#fdfbf7" stroke="#d97706" stroke-width="2" />
      <g font-size="11" fill="#0f172a">
        <text x="75" y="275" font-weight="bold">Kantor Urusan Agama (KUA)</text>
        <text x="250" y="275">: KECAMATAN SUBANG, KABUPATEN SUBANG</text>
        
        <text x="75" y="300" font-weight="bold">Nomor Akta Nikah</text>
        <text x="250" y="300" font-family="monospace">: 0412 / 045 / IX / 2024</text>
        
        <text x="75" y="325" font-weight="bold">Nama Suami</text>
        <text x="250" y="325" font-weight="bold">: ${cleanName}</text>
        
        <text x="75" y="350" font-weight="bold">Nama Istri</text>
        <text x="250" y="350" font-weight="bold">: SITI NURHALIZA</text>
        
        <text x="75" y="375" font-weight="bold">Hari / Tanggal Akad</text>
        <text x="250" y="375">: AHAD, 12 SEPTEMBER 2024</text>
      </g>
      
      <!-- KUA Gold Stamp -->
      <circle cx="510" cy="385" r="30" fill="none" stroke="#d97706" stroke-width="2" />
      <text x="510" y="388" font-size="7" font-weight="bold" fill="#d97706" text-anchor="middle">LEGALISIR KUA</text>
    </svg>`;
  }
  else if (category === 'KEHILANGAN') {
    // Official Police Loss Report (SKTLK)
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" style="background:#ffffff; font-family:sans-serif;">
      <rect x="20" y="20" width="560" height="760" fill="#ffffff" stroke="#334155" stroke-width="2" />
      
      <!-- Kop Surat Polri -->
      <g font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">
        <text x="300" y="55">KEPOLISIAN NEGARA REPUBLIK INDONESIA</text>
        <text x="300" y="72">DAERAH JAWA BARAT</text>
        <text x="300" y="89">RESOR SUBANG</text>
        <text x="300" y="106" font-size="9" font-weight="normal">Jl. Mayjen Sutoyo No. 29, Karanganyar, Subang 41211</text>
      </g>
      <line x1="50" y1="115" x2="550" y2="115" stroke="#000000" stroke-width="2" />
      <line x1="50" y1="118" x2="550" y2="118" stroke="#000000" stroke-width="0.8" />
      
      <!-- Title -->
      <text x="300" y="150" font-size="14" font-weight="900" fill="#0f172a" text-anchor="middle" text-decoration="underline">
        SURAT TANDA PENERIMAAN LAPORAN KEHILANGAN
      </text>
      <text x="300" y="170" font-size="11" font-family="monospace" fill="#334155" text-anchor="middle">
        Nomor: STPLK / B / 842 / IX / 2026 / SPKT / POLRES SUBANG
      </text>
      
      <!-- Content -->
      <g font-size="11" fill="#1e293b">
        <text x="60" y="210">Yang bertanda tangan di bawah ini Kepala Sentra Pelayanan Kepolisian Terpadu menerangkan bahwa:</text>
        
        <text x="80" y="245" font-weight="bold">Nama</text>
        <text x="210" y="245">: ${cleanName}</text>
        
        <text x="80" y="270" font-weight="bold">NIK</text>
        <text x="210" y="270" font-family="monospace">: ${cleanNik}</text>
        
        <text x="80" y="295" font-weight="bold">Tempat/Tgl Lahir</text>
        <text x="210" y="295">: Subang, 12-04-1995</text>
        
        <text x="80" y="320" font-weight="bold">Alamat</text>
        <text x="210" y="320">: Jl. Pejuang No. 14, RT 03/07 Karanganyar Subang</text>
        
        <text x="60" y="365">Benar telah melaporkan kehilangan dokumen berharga berupa:</text>
        
        <rect x="60" y="380" width="480" height="60" fill="#f8fafc" stroke="#94a3b8" rx="4" />
        <text x="80" y="405" font-weight="bold" fill="#b91c1c">1 (Satu) Lembar Fisik KTP-el Asli atas nama ${cleanName}</text>
        <text x="80" y="425" fill="#475569">Hilang di sekitar area Jl. Otto Iskandardinata Subang pada tanggal 05 September 2026.</text>
        
        <text x="60" y="475">Surat keterangan ini diterbitkan guna keperluan pengajuan penggantian KTP-el baru ke Disdukcapil.</text>
      </g>
      
      <!-- Footer Signature & Police Stamp -->
      <g font-size="11" fill="#0f172a">
        <text x="400" y="580" text-anchor="middle">Subang, 06 September 2026</text>
        <text x="400" y="600" text-anchor="middle" font-weight="bold">a.n. KEPALA KEPOLISIAN RESOR SUBANG</text>
        <text x="400" y="615" text-anchor="middle">KA SPKT</text>
        
        <!-- Blue Police Round Stamp -->
        <circle cx="340" cy="650" r="40" fill="none" stroke="#1d4ed8" stroke-width="2.5" />
        <text x="340" y="653" font-size="7" font-weight="bold" fill="#1d4ed8" text-anchor="middle">POLRES SUBANG</text>
        
        <text x="400" y="700" font-weight="bold" text-anchor="middle">IPDA H. BUDIMAN, S.H.</text>
        <text x="400" y="715" font-size="10" text-anchor="middle" fill="#64748b">NRP. 82040912</text>
      </g>
    </svg>`;
  }
  else if (category === 'SKL') {
    // Official Birth Certificate from Hospital / Midwife
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 780" width="600" height="780" style="background:#ffffff; font-family:sans-serif;">
      <rect x="20" y="20" width="560" height="740" fill="#ffffff" stroke="#047857" stroke-width="2" />
      
      <!-- Kop Rumah Sakit -->
      <text x="300" y="60" font-size="16" font-weight="900" fill="#065f46" text-anchor="middle">RUMAH SAKIT UMUM DAERAH KABUPATEN SUBANG</text>
      <text x="300" y="78" font-size="10" fill="#334155" text-anchor="middle">INSTALASI MATERNAL &amp; PERINATAL • KEBIDANAN</text>
      <text x="300" y="94" font-size="9" fill="#64748b" text-anchor="middle">Jl. Brigjen Katamso No. 37, Subang - Jawa Barat</text>
      <line x1="50" y1="105" x2="550" y2="105" stroke="#047857" stroke-width="2" />
      
      <!-- Title -->
      <text x="300" y="145" font-size="15" font-weight="900" fill="#0f172a" text-anchor="middle" text-decoration="underline">
        SURAT KETERANGAN KELAHIRAN (SKL)
      </text>
      <text x="300" y="165" font-size="10" font-family="monospace" fill="#475569" text-anchor="middle">
        Nomor : 445 / 0912 / SKL-RSUD / IX / 2026
      </text>
      
      <g font-size="11" fill="#1e293b">
        <text x="60" y="205">Menerangkan dengan sebenarnya bahwa telah lahir seorang anak:</text>
        
        <text x="80" y="240" font-weight="bold">Nama Bayi</text>
        <text x="210" y="240" font-weight="bold" fill="#047857">: RAYHAN PRATAMA</text>
        
        <text x="80" y="265" font-weight="bold">Jenis Kelamin</text>
        <text x="210" y="265">: Laki-laki</text>
        
        <text x="80" y="290" font-weight="bold">Hari / Tanggal Lahir</text>
        <text x="210" y="290">: Rabu, 02 September 2026</text>
        
        <text x="80" y="315" font-weight="bold">Pukul / Jam</text>
        <text x="210" y="315">: 08:35 WIB</text>
        
        <text x="80" y="340" font-weight="bold">Berat &amp; Panjang Lahir</text>
        <text x="210" y="340">: 3.300 Gram / 49 cm</text>
        
        <text x="80" y="365" font-weight="bold">Anak ke-</text>
        <text x="210" y="365">: 1 (Satu)</text>
        
        <text x="60" y="415">Dari pasangan suami istri sah:</text>
        <text x="80" y="445" font-weight="bold">Nama Ibu</text>
        <text x="210" y="445">: Ny. Siti Nurhaliza (NIK: 3201125203920005)</text>
        
        <text x="80" y="470" font-weight="bold">Nama Ayah</text>
        <text x="210" y="470">: Tn. ${cleanName} (NIK: ${cleanNik})</text>
      </g>
      
      <!-- Footer Signature -->
      <g font-size="11" fill="#0f172a">
        <text x="400" y="580" text-anchor="middle">Subang, 03 September 2026</text>
        <text x="400" y="600" text-anchor="middle" font-weight="bold">Dokter / Bidan Penolong Persalinan</text>
        
        <!-- Hospital Green Stamp -->
        <circle cx="340" cy="650" r="38" fill="none" stroke="#047857" stroke-width="2.5" />
        <text x="340" y="653" font-size="7" font-weight="bold" fill="#047857" text-anchor="middle">RSUD SUBANG</text>
        
        <text x="400" y="700" font-weight="bold" text-anchor="middle">dr. Sarah Amalia, Sp.OG</text>
        <text x="400" y="715" font-size="10" text-anchor="middle" fill="#64748b">SIP. 446/102/DINKES/2023</text>
      </g>
    </svg>`;
  }
  else {
    // Default Official Document Preview
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750" style="background:#ffffff; font-family:sans-serif;">
      <rect x="20" y="20" width="560" height="710" fill="#ffffff" stroke="#0284c7" stroke-width="2" rx="6" />
      
      <text x="300" y="65" font-size="15" font-weight="900" fill="#0369a1" text-anchor="middle">PEMERINTAH KABUPATEN SUBANG</text>
      <text x="300" y="85" font-size="12" font-weight="bold" fill="#0284c7" text-anchor="middle">DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL</text>
      <line x1="50" y1="100" x2="550" y2="100" stroke="#0284c7" stroke-width="2" />
      
      <rect x="50" y="130" width="500" height="45" rx="8" fill="#f0f9ff" stroke="#bae6fd" />
      <text x="300" y="158" font-size="13" font-weight="bold" fill="#0369a1" text-anchor="middle">${docName.toUpperCase()}</text>
      
      <g font-size="11" fill="#1e293b">
        <text x="70" y="220" font-weight="bold">Pemohon</text>
        <text x="180" y="220">: ${cleanName}</text>
        
        <text x="70" y="245" font-weight="bold">NIK</text>
        <text x="180" y="245" font-family="monospace">: ${cleanNik}</text>
        
        <text x="70" y="270" font-weight="bold">Waktu Verifikasi</text>
        <text x="180" y="270">: 2026-09-19 09:15 WIB</text>
        
        <text x="70" y="295" font-weight="bold">Status Berkas</text>
        <text x="180" y="295" fill="#047857" font-weight="bold">: TERVERIFIKASI SISTEM SI-ADMINDUK</text>
      </g>
      
      <rect x="70" y="330" width="460" height="240" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4" />
      <text x="300" y="440" font-size="12" fill="#64748b" text-anchor="middle">Lampiran Berkas Resmi Terlampir &amp; Sah</text>
      <text x="300" y="465" font-size="10" font-family="monospace" fill="#94a3b8" text-anchor="middle">HASH INTEGRITAS: SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}</text>
      
      <text x="300" y="650" font-size="10" fill="#64748b" text-anchor="middle">Dokumen ini terintegrasi dalam sistem pelayanan adminduk Disdukcapil Subang.</text>
    </svg>`;
  }

  // Encode as valid data URI
  const encodedSvg = encodeURIComponent(svgContent.trim());
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}
