interface IProps {
  label: string;
}

export function ListSubtitle({ label }: IProps) {
  return (
    <div className="py-5 px-4 text-light-on-surface-variant">
      <p className="font-bold">{label}</p>
    </div>
  );
}
