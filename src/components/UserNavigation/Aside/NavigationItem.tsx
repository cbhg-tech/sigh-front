import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBaseProps } from "react-icons";

const BTN_STYLE = "flex items-center p-4 rounded-full gap-3";
const BTN_STYLE_IS_ACTIVE = (isActive: boolean) =>
  isActive
    ? `${BTN_STYLE} text-light-on-secondary-container bg-light-secondary-container`
    : `${BTN_STYLE} text-light-on-surface-variant bg-transparent`;

interface IProps {
  icon: React.ComponentType<IconBaseProps>;
  label: string;
  href: string;
}

const NavigationItem = ({ href, icon: Icon, label }: IProps) => {
  const pathname = usePathname();

  const isActive = !!pathname?.includes(href);

  return (
    <Link href={href} className={BTN_STYLE_IS_ACTIVE(isActive)}>
      <Icon size={24} className="text-light-on-secondary-container" />
      <p className="flex-1 font-bold">{label}</p>
    </Link>
  );
};

export { NavigationItem };
