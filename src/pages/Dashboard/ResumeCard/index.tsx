import { IconBaseProps } from 'react-icons';

interface IProps {
  icon: React.ComponentType<IconBaseProps>;
  title: string;
  value: number;
}

export function ResumeCard({ icon: Icon, title, value }: IProps) {
  return (
    <div className="flex w-72 lg:w-full shrink-0 lg:shrink p-6 bg-light-surface rounded-2xl items-center justify-between snap-start snap-always">
      <Icon size="3rem" className="text-light-on-surface-variant" />
      <div className="text-right">
        <p className="text-light-on-surface-variant">{title}</p>
        <p className="text-light-on-surface font-bold text-2xl">{value}</p>
      </div>
    </div>
  );
}
