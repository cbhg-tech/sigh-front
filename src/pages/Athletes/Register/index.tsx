import { MdOutlineCloudUpload } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Badge } from '../../../components/Badge';
import { useGlobal } from '../../../contexts/global.context';
import { usePutUser } from '../../../dataAccess/hooks/user/usePutUser';
import { Status } from '../../../enums/Status';
import { UploadFile } from '../../../utils/uploadFile';
import { BasicData } from './BasicData';
import { DocumentationUpload } from './DocumentationUpload';
import { HospitalData } from './HospitalData';
import { LGPDTab } from './LGPDTab';
import {
  AthletesRegisterProvider,
  useAthletesRegister,
} from './register.context';

const BTN_STYLE =
  'p-4 rounded-2xl font-medium w-auto whitespace-nowrap snap-start snap-always';
const DEACTIVE_BTN_STYLE = 'bg-light-surface text-light-surface-tint';
const ACTIVE_BTN_STYLE =
  'bg-light-secondary-container text-light-on-secondary-container';

const USER_NOT_FOUND_IMG =
  'https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/1A1A1A/external-user-user-tanah-basah-glyph-tanah-basah-4.png';

export function AthletesRegisterContent() {
  const { activeTab, setActiveTab } = useAthletesRegister();
  const { user } = useGlobal();
  const { mutateAsync, isLoading } = usePutUser();

  async function handleProfilePhotoUpload(file: File) {
    const photoUrl = await UploadFile(`/usersAvatar/${file.name}`, file);

    try {
      await mutateAsync({
        ...user,
        photoUrl,
      });
    } catch (err) {
      toast.error('Erro ao atualizar foto de perfil');
    }
  }

  const activeTabStyle = (tabIndex: number) =>
    activeTab === tabIndex ? ACTIVE_BTN_STYLE : DEACTIVE_BTN_STYLE;

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
        <div className="w-24 h-24 rounded-full">
          {!isLoading && (
            <label
              htmlFor="userAvatar"
              className="relative cursor-pointer group"
            >
              <input
                id="userAvatar"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={e => handleProfilePhotoUpload(e.target.files![0])}
              />
              <div className="absolute z-10 top-4 left-0 w-24 h-24 rounded-full bg-black/20 backdrop-blur flex flex-col justify-center items-center text-white duration-200 opacity-0 group-hover:opacity-100">
                <MdOutlineCloudUpload size="2rem" />
                <p className="text-xs">Alterar foto</p>
              </div>
              <img
                src={user?.photoUrl || USER_NOT_FOUND_IMG}
                alt={user?.name}
                className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
              />
            </label>
          )}
          {isLoading && (
            <div className="w-24 h-24 rounded-full bg-light-secondary-container animate-pulse" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl text-light-on-surface-variant">
            {user?.name}
          </h2>

          <p className="text-2xl text-light-on-surface-variant">
            {user?.related?.name}
          </p>

          <div>
            {user?.status === Status.ACTIVE && (
              <Badge type="primary">Ativo</Badge>
            )}
            {user?.status === Status.PENDING && (
              <Badge type="warning">Pendente</Badge>
            )}
            {user?.status === Status.REJECTED && (
              <Badge type="error">Rejeitado</Badge>
            )}
            {user?.status === Status.INACTIVE && (
              <Badge type="error">Inativo</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8 flex flex-nowrap overflow-x-auto scroll-smooth snap-x snap-mandatory">
        <button
          type="button"
          className={`${BTN_STYLE} ${activeTabStyle(0)}`}
          onClick={() => setActiveTab(0)}
        >
          Dados básicos
        </button>
        <button
          type="button"
          className={`${BTN_STYLE} ${activeTabStyle(1)}`}
          onClick={() => setActiveTab(1)}
        >
          Documentação
        </button>
        <button
          type="button"
          className={`${BTN_STYLE} ${activeTabStyle(2)}`}
          onClick={() => setActiveTab(2)}
        >
          Dados hospitalares
        </button>
        <button
          type="button"
          className={`${BTN_STYLE} ${activeTabStyle(3)}`}
          onClick={() => setActiveTab(3)}
        >
          Finalizar registro
        </button>
      </div>
      <div>
        {activeTab === 0 && <BasicData />}
        {activeTab === 1 && <DocumentationUpload />}
        {activeTab === 2 && <HospitalData />}
        {activeTab === 3 && <LGPDTab />}
      </div>
    </div>
  );
}

export function AthletesRegisterPage() {
  return (
    <AthletesRegisterProvider>
      <AthletesRegisterContent />
    </AthletesRegisterProvider>
  );
}
