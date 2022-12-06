import { InputHTMLAttributes, useState } from 'react';
import { ref, getDownloadURL, getBlob } from 'firebase/storage';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { MdFileDownload } from 'react-icons/md';
import { IconButton } from '../IconButton';
import { storage } from '../../../app/FirebaseConfig';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  hint?: string;
  url?: string;
}

export function FileInput({ name, label, hint, url, ...rest }: IProps) {
  const [showInput, setShowInput] = useState(!url);

  const handleDownload = (url: string) => {
    fetch(url).then(response => {
      response.blob().then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file.';
        a.click();
      });
      // window.location.href = response.url;
    });
  };

  return (
    <div className="flex-1">
      {!showInput && (
        <div className="flex gap-4">
          <p className="block leading-10 max-w-prose line-clamp-1">{url}</p>
          {url && (
            <IconButton
              icon={MdFileDownload}
              onClick={e => handleDownload(url)}
              className="text-light-surface-tint"
            />
          )}
          <IconButton
            icon={IoCloseCircleOutline}
            onClick={() => setShowInput(true)}
            className="text-light-error"
          />
        </div>
      )}

      {showInput && (
        <label
          htmlFor={name}
          className="text-light-on-surface-variant block flex-1"
        >
          {label}
          {hint && (
            <p className="flex items-center mb-2 text-sm text-light-on-surface-variant">
              {hint}
            </p>
          )}
          <input
            type="file"
            className="block w-full mt-2 text-sm text-light-on-surface-variant file:mr-4 file:p-2 file:rounded-full file:border-0 file:text-sm file:font-semibold
      file:bg-light-tertiary file:text-light-on-tertiary
      hover:file:brightness-90 duration-200"
            id={name}
            {...rest}
          />
        </label>
      )}
    </div>
  );
}
