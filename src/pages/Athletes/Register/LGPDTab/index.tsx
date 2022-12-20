import { useState } from 'react';
import { Button } from '../../../../components/Inputs/Button';
import { useGlobal } from '../../../../contexts/global.context';
import { Status } from '../../../../enums/Status';

const boxStyle =
  'p-4 rounded border border-light-outline mb-4 text-light-on-surface-variant';
const headerStyle = 'text-2xl text-light-on-surface';

const termsUrl =
  'https://firebasestorage.googleapis.com/v0/b/sigh-f656a.appspot.com/o/Termo%20de%20Uso%20e%20Pol%C3%ADtica%20de%20Privacidade%20-%20CBHG.pdf?alt=media&token=3d87f4ec-2e98-41e0-b140-48b0bdbbb873';

export function LGPDTab() {
  const { user } = useGlobal();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imageUseAccepted, setImageUseAccepted] = useState(false);
  const [dataUse, setDataUse] = useState(false);

  return (
    <div>
      <section className={boxStyle}>
        <h2 className={headerStyle}>Termos e condições de uso</h2>
        <label htmlFor="terms" className="block my-4">
          <input
            type="checkbox"
            id="terms"
            className="mr-2"
            onChange={e => setTermsAccepted(e.target.checked)}
            checked={termsAccepted}
          />
          Li e concordo com o{' '}
          <a
            className="font-bold text-light-surface-tint"
            href={termsUrl}
            target="_blank"
            rel="noreferrer"
          >
            termo de uso e política de privacidade
          </a>
        </label>
      </section>
      <section className={boxStyle}>
        <h2 className={headerStyle}>Uso de imagem</h2>
        <p>
          Ceder, gratuitamente, o direito de uso de imagem, voz, nome, para fins
          publicitários de qualquer espécie, sejam eles para veículos impressos,
          televisão, ou ainda mídias digitais e redes sociais, tais como,
          exemplificativamente, anúncios via posts nos stories, feed ou murais e
          semelhantes, dentre outros por prazo indeterminado.
        </p>
        <p>
          Parágrafo único: nos casos em que o aluno for convidado a participar
          de alguma gravação, este deverá comparecer de forma voluntaria e não
          onerosa, e utilizar vestuário neutro sem a aparição de nenhuma marca.
        </p>
        <label htmlFor="imageUseAllow" className="block my-4">
          <input
            type="radio"
            id="imageUseAllow"
            name="imageUse"
            className="mr-2"
            onChange={e => setImageUseAccepted(true)}
            checked={imageUseAccepted}
          />
          Li e autorizo o uso de imagem
        </label>
        <label htmlFor="imageUseDeny" className="block my-4">
          <input
            type="radio"
            id="imageUseDeny"
            name="imageUse"
            className="mr-2"
            onChange={e => setImageUseAccepted(false)}
            checked={!imageUseAccepted}
          />
          Não autorizo
        </label>
      </section>
      <section className={boxStyle}>
        <h2 className={headerStyle}>Uso de dados</h2>
        <p>
          Declaro e autorizo, com base na lei 13.709/2018 (Lei Geral de Proteção
          de Dados), o uso dos dados coletados na inscrição e no decorrer do
          curso por parte da Instituição responsável.
        </p>
        <label htmlFor="dataUseAllow" className="block my-4">
          <input
            type="radio"
            id="dataUseAllow"
            name="dataUse"
            className="mr-2"
            onChange={e => setDataUse(true)}
            checked={dataUse}
          />
          Li e autorizo o uso de dados
        </label>
        <label htmlFor="dataUseDeny" className="block my-4">
          <input
            type="radio"
            id="dataUseDeny"
            name="dataUse"
            className="mr-2"
            onChange={e => setDataUse(false)}
            checked={!dataUse}
          />
          Não autorizo
        </label>
      </section>
      <div className="col-span-1 lg:col-span-3 mt-4">
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            label="Cancelar"
            variant="primary-border"
          />
          <Button
            type="submit"
            aditionalClasses="w-auto px-2"
            label={user?.status === Status.ACTIVE ? 'Salvar' : 'Próximo passo'}
            variant="primary"
          // isLoading={isLoading}
          // disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
