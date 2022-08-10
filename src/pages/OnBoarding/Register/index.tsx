import { Form } from '@unform/web';
import dayjs from 'dayjs';
import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';

export function RegisterPage() {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Cadastro de atletas do hóquei brasileiro
        </p>
        <Form onSubmit={data => console.log(data)}>
          <Textfield type="text" name="name" label="Nome completo" />
          <Textfield type="email" name="email" label="Email" />
          <Textfield
            type="date"
            name="birthday"
            label="Data de nascimento"
            max={today}
          />
          <Select name="club" label="Clube atual">
            <option value="rio hockei">Rio hockei</option>
            <option value="deodoro">Deodoro</option>
          </Select>
          <Textfield type="password" name="password" label="Senha" />
          <Button type="submit" label="Criar conta" />
        </Form>
        <p className="text-xs text-light-on-surface text-center">
          * Caso ainda não tenha um clube e deseja conhecer e praticar este
          esporte, acesse nosso site e saiba como jogar hóquei no Brasil. Saiba
          mais!
        </p>
      </div>
    </OnBoardingContainer>
  );
}
