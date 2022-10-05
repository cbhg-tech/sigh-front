import React, { SelectHTMLAttributes, useEffect, useRef } from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';

import { MdErrorOutline } from 'react-icons/md';

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  hint?: string;
  icon?: React.ComponentType<IconBaseProps>;
  children?: React.ReactNode;
}

export function Select({
  name,
  label,
  hint,
  children,
  icon: Icon,
  ...rest
}: IProps) {
  const inputRef = useRef<HTMLSelectElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <div className="w-full mb-3">
      <div
        className={`box-border flex gap-2 items-start justify-between w-full py-2 px-4 duration-200 border h-14 text-light-on-surface border-light-outline focus-within:border-light-primary bg-light-surface rounded ${
          error && 'border-light-error'
        }`}
      >
        {Icon && (
          <div className="mt-1">
            <Icon size={20} />
          </div>
        )}
        <div className="relative flex-1 h-full">
          <select
            className="w-full h-full ml-[-0.25rem] bg-transparent outline-none resize-none placeholder:text-transparent appearance-none"
            defaultValue={defaultValue}
            ref={inputRef}
            {...rest}
          >
            {children}
          </select>
          <label
            className={`absolute max-w-full text-left top-2 left-2 line-clamp-1  ${
              Icon ? 'has-icon-animation' : 'has-not-icon-animation'
            }`}
            htmlFor={name}
          >
            {label}
          </label>
          {error && (
            <div className="absolute top-2 right-2">
              <MdErrorOutline className="text-light-error" size={20} />
            </div>
          )}
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
