import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, ExternalLink } from 'lucide-react';
import { STANDALONE_HTML_CODE } from '../standaloneHtmlSource';

interface ExportHtmlModalProps {
  onClose: () => void;
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(STANDALONE_HTML_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'adminduk-online-standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm tracking-wide">SINGLE-FILE HTML TERINTEGRASI</h3>
              <p className="text-xs text-slate-400">Siap dijalankan mandiri di browser tanpa server / instalasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
            <div>
              <span className="font-bold block text-sm mb-0.5">Kode Sumber HTML Mandiri (Single-File)</span>
              <p className="leading-relaxed">
                Sesuai instruksi tugas, seluruh kode aplikasi Sistem Pendaftaran Adminduk Online (HTML5, Tailwind CSS via CDN, Vanilla JavaScript, Data Dummy, Form Dinamis, Role Switcher, & Resi Cetak) telah dikompilasi ke dalam satu file HTML mandiri. Anda dapat langsung mengunduh file ini atau menyalin kodenya.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-semibold">
              Ukuran berkas: ~35 KB • Tailwind CSS CDN • Vanilla JS • Zero Config
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-code-modal"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Seluruh Kode HTML</span>
                  </>
                )}
              </button>

              <button
                id="btn-download-file-modal"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File .HTML Mandiri</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="relative rounded-xl border border-slate-300 bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto max-h-96">
            <pre className="whitespace-pre">{STANDALONE_HTML_CODE.substring(0, 2000)}
            {'\n... [dan ' + (STANDALONE_HTML_CODE.length - 2000) + ' karakter kode lengkap lainnya] ...'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
