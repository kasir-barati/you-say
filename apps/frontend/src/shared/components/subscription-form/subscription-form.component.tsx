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
          htmlFor="subscription-email-input"
          dataTest="subscription-email-label"
        >
          Email
        </Label>
        <Input
          id="subscription-email-input"
          type="email"
          dataTest="subscription-email-input"
          placeholder="michael.junior@example.com"
        />
      </div>
      <PrimaryButton
        data-test="subscribe-button"
        className="mt-5"
        type="submit"
      >
        Subscribe
      </PrimaryButton>
    </Form>
  );
}
