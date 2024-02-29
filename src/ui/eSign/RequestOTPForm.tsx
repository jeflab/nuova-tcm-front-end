import {Profile} from "@/entities/account";
import {PersonalData} from "@/entities/personalData";
import {cns} from "@/helpers/cns";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {faSignInAlt} from "@fortawesome/pro-duotone-svg-icons/faSignInAlt";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button, FormGroup, FormLabel} from "react-bootstrap";

interface IRequestOTPFormData {
  otp: string;
}
interface IRequestOTPFormErrors {
  otp?: string;
}

interface RequestOTPFormProps {
  onCancel: () => void;
  openEditNumberForm: () => void;
  personalData?: PersonalData;
  profile: Profile;
}

const requestOTPFormDefaultValues = {
  otp: "",
};

export function RequestOTPForm({
  onCancel,
  openEditNumberForm,
  personalData,
  profile,
}: RequestOTPFormProps) {
  // const [
  //   requestOTP,
  //   {
  //     data: openedTransaction,
  //     isLoading: isRequestOTPLoading,
  //     isError: isRequestOTPError,
  //     error: requestOTPError,
  //   },
  // ] = eSignsApi.useCreateFEATransactionMutation();
  // const [
  //   signFEADoc,
  //   {
  //     isLoading: isSignFEADocLoading,
  //     isError: isSignFEADocError,
  //     error: signFEADocError,
  //   },
  // ] = eSignsApi.useSignFEADocMutation();

  // if (isRequestOTPLoading) {
  //   return (
  //     <Alert color="info" className="mb-0">
  //       <IconSpinner className="icon-spin" /> Invio OTP in corso...
  //     </Alert>
  //   );
  // } else if (isRequestOTPError) {
  //   return (
  //     <>
  //       <Alert color="danger">{requestOTPError?.message}</Alert>
  //       <div className="text-center">
  //         <Button color="secondary" outline type="button" onClick={onCancel}>
  //           Chiudi
  //         </Button>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <Form
      onSubmit={(values) => {
        console.log(values);
        // await signFEADoc({
        //   OTP: values.otp,
        //   pdfType,
        //   referenceId,
        //   ...(inPlaceOfContractor && {contractorId: inPlaceOfContractor?.id}),
        //   transactionId: openedTransaction.transactionId[0],
        //   ...additionalParams,
        // });
        onCancel();
      }}
      defaultValues={requestOTPFormDefaultValues}
      className="vstack gap-3"
    >
      <FormGroup controlId="otp" as={BorderFeedback}>
        <FormLabel>
          Firma Elettronica
          <br />
          Inserire il codice OTP ricevuto tramite SMS
        </FormLabel>
        <HelpText>
          <div className="mb-2">
            Abbiamo inviato il codice OTP a{" "}
            {profile.agent?.name ?? profile.contractor?.name}{" "}
            {profile.agent?.surname ?? profile.contractor?.surname}
            <br />
            al seguente numero {profile.user.phone}
          </div>
          {personalData ? (
            <div>
              Per modificare il numero di cellulare del tuo cliente{" "}
              <Button
                variant="link"
                onClick={openEditNumberForm}
                className="p-0"
                style={{
                  fontSize: "98%",
                  verticalAlign: "baseline",
                }}
              >
                clicca qui
              </Button>
            </div>
          ) : (
            <p>
              Per modificare il numero di cellulare consulta{" "}
              <a href="/user/profile">'Gestione del profilo'</a>
              <Button
                variant="link"
                onClick={openEditNumberForm}
                className="p-0"
                style={{
                  fontSize: "98%",
                  verticalAlign: "baseline",
                }}
              >
                Test cambia numero agente
              </Button>
            </p>
          )}
        </HelpText>
        <FieldError />
        <InputField
          type="text"
          placeholder="Codice OTP monouso"
          validation={{
            required: "Inserisci l'OTP che hai ricevuto sul tuo cellulare",
          }}
          normalize={onlyNumbersNormalizer}
        />
      </FormGroup>
      <FieldError
        name="root"
        as={Alert}
        variant="danger"
        className="mb-0 w-100"
      />
      <div>
        <SubmitButton>
          {(isLoggingIn) => (
            <>
              <FontAwesomeIcon
                icon={isLoggingIn ? faSpinner : faSignInAlt}
                className={cns("me-2", isLoggingIn && "fa-spin")}
              />
              Conferma
            </>
          )}
        </SubmitButton>{" "}
        <Button variant="cancel" type="button" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </Form>
  );
}
