import { PrimaryButton } from '../buttons/primary-button.component';
import { Form } from '../form/form.component';
import { Input } from '../input/input.component';
import { Label } from '../label/label.component';

interface SubscriptionFormProps {
  closeModalHandler: () => void;
}

export function SubscriptionForm({
  closeModalHandler,
}: Readonly<SubscriptionFormProps>) {
  return (
    <Form
      onSubmit={closeModalHandler}
      dataTest="subscription-form"
      className="flex flex-col gap-4 text-left"
    >
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="sign-up-first-name-input"
          dataTest="sign-up-first-name-label"
        >
          Name
        </Label>
        <Input
          id="sign-up-first-name-input"
          type="text"
          dataTest="sign-up-first-name-input"
          placeholder="Michael Junior"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="sign-up-email-input"
          dataTest="sign-up-email-label"
        >
          Email
        </Label>
        <Input
          id="sign-up-email-input"
          type="email"
          dataTest="sign-up-email-input"
          placeholder="michael.junior@example.com"
        />
      </div>
      <PrimaryButton
        data-test="continue-sign-in-button"
        className="mt-5"
        type="submit"
      >
        Subscribe
      </PrimaryButton>
    </Form>
  );
}
