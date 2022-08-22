import UserImg from '../../../assets/user-img.jpg';

export function UserCard() {
  return (
    <div className="flex gap-4 items-center mb-4">
      <img
        className="w-14 h-14 rounded-full object-cover"
        src={UserImg}
        alt="Foto de perfil do usuário"
      />
      <div>
        <p className="text-xl text-light-on-surface">Nome do atleta</p>
        <p className="text-light-on-surface-variant">Clube do atleta</p>
      </div>
    </div>
  );
}
