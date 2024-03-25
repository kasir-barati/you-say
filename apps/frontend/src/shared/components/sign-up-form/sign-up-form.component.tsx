import { RegisterRequestBody } from '@shared';
import { useSignUpMutation } from '../../api/auth.api';
import { useAppDispatch } from '../../store';
import { PrimaryButton } from '../buttons/primary-button.component';
import { Form } from '../form/form.component';
import { Input } from '../input/input.component';
import { Label } from '../label/label.component';
import { addNotification } from '../notification/notification.slice';

interface SingUpFormProps {
  closeModalHandler: () => void;
}

export function SignUpForm({
  closeModalHandler,
}: Readonly<SingUpFormProps>) {
  const [signUpMutation] = useSignUpMutation();
  const dispatch = useAppDispatch();

  // #region handlers
  const signUpHandler = async (formData: RegisterRequestBody) => {
    try {
      await signUpMutation(formData).unwrap();

      dispatch(
        addNotification({
          message: "You're now one of our users!",
          type: 'success',
        }),
      );
    } catch (_error) {
      dispatch(
        addNotification({
          message: 'Something did not work out, try again!',
          type: 'error',
        }),
      );
    } finally {
      closeModalHandler();
    }
  };
  // #endregion

  return (
    <Form<RegisterRequestBody>
      dataTest="sign-up-form"
      onSubmit={signUpHandler}
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
          type="text"
          minLength={2}
          maxLength={128}
          required={true}
          name="firstName"
          placeholder="Michael Junior"
          id="sign-up-first-name-input"
          dataTest="sign-up-first-name-input"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="sign-up-last-name-input"
          dataTest="sign-up-last-name-label"
        >
          Family
        </Label>
        <Input
          type="text"
          minLength={2}
          maxLength={128}
          required={true}
          name="lastName"
          placeholder="Smith"
          id="sign-up-last-name-input"
          dataTest="sign-up-last-name-input"
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
          name="email"
          type="email"
          required={true}
          id="sign-up-email-input"
          dataTest="sign-up-email-input"
          placeholder="michael.junior@example.com"
        />
      </div>
      <PrimaryButton
        type="submit"
        className="mt-5"
        data-test="continue-sign-in-button"
      >
        Sign up
      </PrimaryButton>
    </Form>
  );
}
