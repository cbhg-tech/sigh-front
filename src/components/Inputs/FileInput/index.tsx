import { InputHTMLAttributes, useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { IconButton } from '../IconButton';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  hint?: string;
  url?: string;
}

export function FileInput({ name, label, hint, url, ...rest }: IProps) {
  const [showInput, setShowInput] = useState(!url);

  return (
    <div className="flex-1">
      {!showInput && (
        <div className="flex gap-4">
          <p className="block leading-10 max-w-prose line-clamp-1">{url}</p>
          {/* TODO: adicionar botão para baixar documento */}
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
