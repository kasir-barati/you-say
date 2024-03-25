import { PrimaryButton } from '../buttons/primary-button.component';
import { Form } from '../form/form.component';
import { Input } from '../input/input.component';
import { Label } from '../label/label.component';

interface SignInFormProps {
  closeModalHandler: () => void;
}

export function SignInForm({
  closeModalHandler,
}: Readonly<SignInFormProps>) {
  return (
    <Form
      dataTest="sing-in-form"
      onSubmit={closeModalHandler}
      className="flex flex-col gap-2 text-left"
    >
      <Label
        htmlFor="sign-in-email-input"
        data-test="sign-in-email-label"
      >
        Email
      </Label>
      <Input
        id="sign-in-email-input"
        type="email"
        dataTest="sign-in-email-input"
        placeholder="sara@example.com"
      />
      <PrimaryButton
        data-test="continue-sign-in-button"
        className="mt-5"
        type="submit"
      >
        Continue
      </PrimaryButton>
    </Form>
  );
}
