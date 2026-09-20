import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Download, ExternalLink, FileText, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

export interface DocumentPreviewData {
  title: string;
  url: string;
  fileName?: string;
  size?: string;
  fileType?: string;
  isPdf?: boolean;
}

interface DocumentPreviewModalProps {
  data: DocumentPreviewData | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ data, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  if (!data) return null;

  const isDataUrl = data.url.startsWith('data:');
  const isSvg = data.url.startsWith('data:image/svg+xml');
  const isImage = data.url.startsWith('data:image/') || isSvg;
  const isRealPdf = !isImage && (
    data.url.startsWith('data:application/pdf') ||
    data.fileType === 'application/pdf' ||
    Boolean(data.isPdf && !isSvg)
  );

  const handleZoomIn = () => setZoomLevel(prev => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = data.url;
    a.download = data.fileName || `${data.title.replace(/\s+/g, '_')}.${isRealPdf ? 'pdf' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    if (isDataUrl) {
      const win = window.open();
      if (win) {
        if (isRealPdf) {
          win.document.write(`<iframe src="${data.url}" style="width:100%;height:100%;border:none;"></iframe>`);
        } else {
          win.document.write(`<img src="${data.url}" style="max-width:100%;margin:auto;display:block;" />`);
        }
      }
    } else {
      window.open(data.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-lg bg-white/10 text-white shrink-0">
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                  {data.title}
                </h4>
                {isRealPdf ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    PDF DOKUMEN
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    LAMPIRAN RESMI
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {data.fileName || 'Berkas Lampiran'} • Ukuran: <span className="text-sky-300 font-semibold">{data.size || 'Ukuran Terverifikasi'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            {/* Toolbar Buttons for visual documents */}
            {!isRealPdf && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 rounded-lg p-1 mr-2 border border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-slate-400 px-1">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                  title="Putar 90 Derajat"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1 transition shadow-xs"
              title="Unduh Berkas Ini"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600 hover:text-white text-slate-300 transition ml-1"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="p-4 sm:p-6 bg-slate-100 flex-1 overflow-auto flex items-center justify-center min-h-[340px] max-h-[65vh]">
          {isRealPdf ? (
            <div className="w-full h-full min-h-[420px] flex flex-col rounded-xl overflow-hidden border border-slate-300 bg-white shadow-sm">
              {/* PDF Embed / Object */}
              <object
                data={data.url}
                type="application/pdf"
                className="w-full h-[450px] border-none bg-slate-50"
              >
                <iframe
                  src={data.url}
                  title={data.title}
                  className="w-full h-[450px] border-none bg-slate-50"
                />
              </object>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Pratinjau Dokumen PDF Resmi Disdukcapil</span>
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  Buka di Tab Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md bg-white p-2 flex items-center justify-center max-w-full">
              <img
                src={data.url}
                alt={data.title}
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                  maxHeight: '55vh',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Berkas Sesuai Persyaratan & Terbaca Jelas
            </span>
            <span className="text-slate-500 hidden sm:inline">
              Maksimal batas ukuran 5.0 MB
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
