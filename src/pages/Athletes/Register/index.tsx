import { Badge } from '../../../components/Badge';
import { BasicData } from './BasicData';
import { DocumentationUpload } from './DocumentationUpload';
import { HospitalData } from './HospitalData';
import {
  AthletesRegisterProvider,
  useAthletesRegister,
} from './register.context';

const BTN_STYLE =
  'p-4 rounded-2xl font-medium w-auto whitespace-nowrap snap-start snap-always';
const DEACTIVE_BTN_STYLE = 'bg-light-surface text-light-surface-tint';
const ACTIVE_BTN_STYLE =
  'bg-light-secondary-container text-light-on-secondary-container';

export function AthletesRegisterContent() {
  const { activeTab, setActiveTab } = useAthletesRegister();

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <div className="flex gap-2 items-center mb-4">
        <div className="w-24 h-24 rounded-full">
          <img
            src="https://picsum.photos/200/200"
            alt=""
            className="w-24 h-24 rounded-full object-cover bg-light-secondary-container"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-4xl text-light-on-surface-variant">
              João Vidal
            </h2>
            <Badge type="error">Pendente</Badge>
          </div>
          <p className="text-2xl text-light-on-surface-variant">
            Rio Hockei Club
          </p>
        </div>
      </div>
      <div className="mb-8 flex flex-nowrap overflow-x-auto scroll-smooth snap-x snap-mandatory">
        <button
          type="button"
          className={`${BTN_STYLE} ${
            activeTab === 0 ? ACTIVE_BTN_STYLE : DEACTIVE_BTN_STYLE
          }`}
          onClick={() => setActiveTab(0)}
        >
          Dados básicos
        </button>
        <button
          type="button"
          className={`${BTN_STYLE} ${
            activeTab === 1 ? ACTIVE_BTN_STYLE : DEACTIVE_BTN_STYLE
          }`}
          onClick={() => setActiveTab(1)}
        >
          Documentação
        </button>
        <button
          type="button"
          className={`${BTN_STYLE} ${
            activeTab === 2 ? ACTIVE_BTN_STYLE : DEACTIVE_BTN_STYLE
          }`}
          onClick={() => setActiveTab(2)}
        >
          Dados hospitalares
        </button>
      </div>
      <div>
        {activeTab === 0 && <BasicData />}
        {activeTab === 1 && <DocumentationUpload />}
        {activeTab === 2 && <HospitalData />}
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
