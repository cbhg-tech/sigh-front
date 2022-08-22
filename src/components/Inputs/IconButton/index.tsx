import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<IconBaseProps>;
  size?: string;
}

export function IconButton({ icon: Icon, size = '2rem', ...rest }: IProps) {
  return (
    <button
      className="duration-200 bg-transparent border-none text-light-on-surface-variant hover:cursor-pointer hover:brightness-90"
      type="button"
      {...rest}
    >
      <Icon size={size} />
    </button>
  );
}
