import { IUser } from '../../../types/User';

interface IProps {
  user: IUser;
}

const USER_NOT_FOUND_IMG =
  'https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/1A1A1A/external-user-user-tanah-basah-glyph-tanah-basah-4.png';

export function UserCard({ user }: IProps) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <img
        className="w-14 h-14 rounded-full object-cover"
        src={user.photoUrl || USER_NOT_FOUND_IMG}
        alt="Foto de perfil do usuário"
      />
      <div>
        <p className="text-xl text-light-on-surface">{user.name}</p>
        <p className="text-light-on-surface-variant">{user.related?.name}</p>
      </div>
    </div>
  );
}
