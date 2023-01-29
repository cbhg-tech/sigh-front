import { Button } from "@/components/Inputs/Button";
import { Textfield } from "@/components/Inputs/Textfield";
import { OnBoardingContainer } from "@/components/layouts/OnBoarding.layout";

export default function ForgotPasswordPage() {
  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Informe seu email para recuperar a senha
        </p>
        <form>
          <Textfield type="email" id="email" label="Email" />
          <Button type="submit">Recuperar</Button>
        </form>
      </div>
    </OnBoardingContainer>
  );
}
