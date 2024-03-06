import {Profile} from "@/entities/account";
import {PDFType} from "@/entities/esign";
import {PersonalData} from "@/entities/personalData";
import {cns} from "@/helpers/cns";
import {signFEADoc} from "@/ui/eSign/actions";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {
  faClose,
  faRotate,
  faSignature,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button, FormGroup, FormLabel, Stack} from "react-bootstrap";

interface RequestOTPFormProps {
  lipId: number;
  onCancel: () => void;
  onEsignComplete?: () => void;
  openEditNumberForm: () => void;
  pdfType: PDFType;
  personalData?: PersonalData;
  profile: Profile;
  transactionId: string;
}

const requestOTPFormDefaultValues = {
  otp: "",
};

export function RequestOTPForm({
  lipId,
  onCancel,
  onEsignComplete,
  openEditNumberForm,
  pdfType,
  personalData,
  profile,
  transactionId,
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

  return (
    <Form
      onSubmit={async (values) => {
        const response = await signFEADoc({
          OTP: values.otp,
          pdfType,
          lipId,
          transactionId,
        });

        if (response.status === "failed") {
          throw {
            root: {
              type: "server",
              message: response.message,
            },
          };
        }
        onEsignComplete?.();
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
      <Stack direction="horizontal" gap={2}>
        <SubmitButton>
          {(isLoggingIn) => (
            <>
              <FontAwesomeIcon
                icon={isLoggingIn ? faSpinner : faSignature}
                className={cns("me-2", isLoggingIn && "fa-spin")}
              />
              Conferma
            </>
          )}
        </SubmitButton>
        <Button variant="secondary" type="button" onClick={onCancel}>
          <FontAwesomeIcon icon={faRotate} /> Invia di nuovo
        </Button>
        <Button variant="cancel" type="button" onClick={onCancel}>
          <FontAwesomeIcon icon={faClose} /> Annulla
        </Button>
      </Stack>
    </Form>
  );
}
