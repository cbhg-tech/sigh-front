import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdOutlineMenu } from 'react-icons/md';

import CBHGLogo from '../../../assets/cbhg-logo.png';
import { useGlobal } from '../../../contexts/global.context';
import { useLogout } from '../../../dataAccess/hooks/auth/useLogout';
import { Button } from '../../Inputs/Button';
import { IconButton } from '../../Inputs/IconButton';

interface IProps {
  toogleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}

const USER_NOT_FOUND_IMG =
  'https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/1A1A1A/external-user-user-tanah-basah-glyph-tanah-basah-4.png';

export function Header({ toogleSideMenu, title }: IProps) {
  const { mutateAsync } = useLogout();
  const { user } = useGlobal();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const DROPDOWN_IS_OPEN_STYLE = isDropdownOpen
    ? 'translate-y-16'
    : '-translate-y-96';

  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(() => setIsDropdownOpen(false), 5000);
    }
  }, [isDropdownOpen]);

  return (
    <header className="flex items-center justify-between px-4 col-span-5 bg-light-surface-1">
      <div className="flex items-center lg:hidden">
        <IconButton
          icon={MdOutlineMenu}
          size="2.25rem"
          onClick={() => toogleSideMenu(true)}
        />
      </div>
      <img
        className="w-20 object-contain hidden lg:block"
        src={CBHGLogo}
        alt="Logo da Federação nacional de hoquei sobre grama"
      />
      <h1 className="text-xl text-light-on-surface-variant">{title}</h1>

      <button
        type="button"
        onClick={() => setIsDropdownOpen(val => !val)}
        className="w-auto h-9 rounded-full flex gap-4 items-center text-light-on-surface-variant"
      >
        {user?.name}
        <img
          src={user?.photoUrl || USER_NOT_FOUND_IMG}
          alt={user?.name}
          className="w-9 h-9 rounded-full object-cover"
        />
      </button>

      <div
        className={`w-full lg:w-56 bg-light-surface-variant rounded-3xl duration-200 ease-in-out absolute right-0 lg:right-4 shadow-2xl p-4 ${DROPDOWN_IS_OPEN_STYLE}`}
      >
        <Button onClick={() => mutateAsync()} label="Sair da conta" />
      </div>
    </header>
  );
}
