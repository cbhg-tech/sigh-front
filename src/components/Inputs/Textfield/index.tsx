import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import { IconBaseProps } from 'react-icons';
import { MdErrorOutline } from 'react-icons/md';
import { useField } from '@unform/core';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  hint?: string;
  icon?: React.ComponentType<IconBaseProps>;
  mask?: (value: string) => string;
}

export function Textfield({
  name,
  label,
  hint,
  mask,
  icon: Icon,
  ...rest
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputMask = (value: string) => {
    if (inputRef.current && mask) {
      inputRef.current.value = mask(value);
    }
  };

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
        className={`box-border flex gap-2 items-center justify-between w-full py-2 px-4 duration-200 border h-14 text-light-on-surface focus-within:border-light-primary bg-light-surface rounded ${
          error ? 'border-light-error' : 'border-light-outline'
        }`}
      >
        {Icon && (
          <div>
            <Icon size={20} />
          </div>
        )}
        <div className="relative flex-1 h-full">
          <input
            className="w-full h-full bg-transparent outline-none placeholder:invisible"
            placeholder={label}
            onChange={o => handleInputMask(o.target.value)}
            defaultValue={defaultValue}
            ref={inputRef}
            id={name}
            type="text"
            {...rest}
          />
          <label
            className={`absolute max-w-full text-left top-2 left-2 line-clamp-1  ${
              Icon ? 'has-icon-animation' : 'has-not-icon-animation'
            }`}
            htmlFor={name}
          >
            {label}
          </label>
        </div>
        {error && (
          <div className="w-5">
            <MdErrorOutline className="text-light-error" size={20} />
          </div>
        )}
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
