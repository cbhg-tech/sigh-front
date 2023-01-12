import { MdInfo } from 'react-icons/md';

type IProps = {
  variant?: 'warning' | 'error';
  title: string;
  message: string;
};

const AlertStyleVariant = {
  warning: 'bg-light-warning-container text-light-on-warning-container',
  error: 'bg-light-error-container text-light-on-error-container',
};

export function Alert({ variant = 'warning', title, message }: IProps) {
  return (
    <div
      className={`rounded-2xl w-full p-4 mb-4 flex gap-4 items-start ${AlertStyleVariant[variant]}`}
    >
      <MdInfo className="text-2xl" />
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-base">{message}</p>
      </div>
    </div>
  );
}
