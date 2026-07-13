import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { FileUploadFieldProps } from '../type';

export default function FileUploadField({ files, onFilesChange }: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="field">
      <Label>デザインデータ・イメージ画像</Label>
      <div
        className={`upload-box${files.length ? ' has-files' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        {files.length
          ? `${files.length}件のファイルを選択中(クリックして変更)`
          : 'クリックしてファイルを選択(画像・PDFなど、5点まで)'}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => onFilesChange(Array.from(e.target.files || []).slice(0, 5))}
      />
      {files.length > 0 && (
        <div className="file-chip-list">
          {files.map((f) => (
            <span className="file-chip" key={f.name}>
              {f.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
