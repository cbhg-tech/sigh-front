import { IconBaseProps } from 'react-icons';
import { NavLink } from 'react-router-dom';

interface IProps {
  icon: React.ComponentType<IconBaseProps>;
  label: string;
  href: string;
  closeModal: () => void;
  end?: boolean;
}

const BTN_STYLE = 'flex items-center p-4 rounded-full gap-3';
const BTN_STYLE_IS_ACTIVE = (isActive: boolean) =>
  isActive
    ? `${BTN_STYLE} text-light-on-secondary-container bg-light-secondary-container`
    : `${BTN_STYLE} text-light-on-surface-variant bg-transparent`;

export function ListItem({
  icon: Icon,
  label,
  href,
  closeModal,
  end = false,
}: IProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => BTN_STYLE_IS_ACTIVE(isActive)}
      onClick={() => closeModal()}
      end={end}
    >
      <Icon size={24} className="text-light-on-secondary-container" />
      <p className="font-bold">{label}</p>
    </NavLink>
  );
}
