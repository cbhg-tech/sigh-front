import React, { TextareaHTMLAttributes } from 'react';

import { MdErrorOutline } from 'react-icons/md';
import { IconBaseProps } from 'react-icons';

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  icon?: React.ComponentType<IconBaseProps>;
}

export function MultineTextfieldBare({
  name,
  hint,
  error,
  label,
  icon: Icon,
  ...rest
}: IProps) {
  return (
    <div className="w-full mb-2">
      <div
        className={`box-border flex gap-2 items-start justify-between w-full pt-3 pb-1 px-4 duration-200 border border-light-outline h-40 text-light-on-surface focus-within:border-light-primary bg-light-surface rounded ${
          error ? 'border-light-error' : 'border-light-outline'
        }`}
      >
        {Icon && (
          <div className="mt-1">
            <Icon className="" size={20} />
          </div>
        )}
        <div className="relative flex-1 h-full">
          <textarea
            id={name}
            placeholder={label}
            {...rest}
            className="w-full h-full pt-2 bg-transparent outline-none resize-none placeholder:text-transparent"
          />
          <label
            className={`absolute max-w-full text-left top-1 left-2 line-clamp-1 ${
              Icon ? 'has-icon-animation' : 'has-not-icon-animation'
            }`}
            htmlFor={name}
          >
            {label}
          </label>
        </div>
        <div className="w-5 mt-1">
          {error && <MdErrorOutline className=" text-light-error" size={20} />}
        </div>
      </div>

      {error && (
        <span className="flex items-center ml-4 text-sm text-light-error">
          {error}
        </span>
      )}

      {hint && !error && (
        <span className="flex items-center ml-4 text-sm text-light-on-surface-variant">
          {hint}
        </span>
      )}
    </div>
  );
}
