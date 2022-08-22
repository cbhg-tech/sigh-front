interface IProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

const BADGE_STYLE_TYPE = {
  primary: 'text-light-on-primary-container bg-light-primary-container',
  secondary: 'text-light-on-secondary-container bg-light-secondary-container',
  tertiary: 'text-light-on-tertiary-container bg-light-tertiary-container',
  error: 'text-light-on-error-container bg-light-error-container',
};

export function Badge({ children, type = 'primary' }: IProps) {
  return (
    <span
      className={`px-2 py-1 rounded-lg font-bold text-sm ${BADGE_STYLE_TYPE[type]}`}
    >
      {children}
    </span>
  );
}
