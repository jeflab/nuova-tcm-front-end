import {Profile} from "@/models/account";
import {PDFType} from "@/models/entities/esign";
import {PersonalData} from "@/models/entities/personalData";
import {cns} from "@/helpers/cns";
import {Tag} from "@/services/const";
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
import {useForm} from "react-hook-form";

interface RequestOTPFormProps<TPayload> {
  lipId: number;
  onCancel: () => void;
  onEsignComplete?: (
    response: Extract<
      Awaited<ReturnType<typeof signFEADoc>>,
      {status: "success"}
    >,
  ) => void;
  openEditNumberForm: () => void;
  payload: TPayload;
  pdfType: PDFType;
  personalData?: PersonalData;
  profile: Profile;
  resendOTP?: () => void;
  transactionId: string;
  tagToRevalidate?: Tag;
}

const requestOTPFormDefaultValues = {
  otp: "",
};

export function RequestOTPForm<TPayload>({
  lipId,
  onCancel,
  onEsignComplete,
  openEditNumberForm,
  payload,
  pdfType,
  personalData,
  profile,
  resendOTP,
  transactionId,
  tagToRevalidate,
}: RequestOTPFormProps<TPayload>) {
  const formMethods = useForm({
    defaultValues: requestOTPFormDefaultValues,
  });

  return (
    <Form
      onSubmit={async (values) => {
        const response = await signFEADoc({
          contractorId: personalData?.id,
          lipId,
          OTP: values.otp,
          payload,
          pdfType,
          transactionId,
          tagToRevalidate,
        });

        if (response.status === "failed") {
          throw {
            root: {
              type: "server",
              message: response.message,
            },
          };
        }

        onEsignComplete?.(response);
      }}
      formMethods={formMethods}
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
            {personalData?.name ?? profile.agent?.name}{" "}
            {personalData?.surname ?? profile.agent?.surname}
            <br />
            al seguente numero {personalData?.phone ?? profile.user.phone}
          </div>
          {personalData ? (
            <div>
              Per modificare il numero di cellulare del tuo Contraente{" "}
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
                Test cambia numero Intermediario
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
          autoFocus
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
          <FontAwesomeIcon
            icon={formMethods.formState.isSubmitting ? faSpinner : faSignature}
            className={cns(
              "me-2",
              formMethods.formState.isSubmitting && "fa-spin",
            )}
          />
          Conferma
        </SubmitButton>
        <Button
          variant="secondary"
          type="button"
          disabled={formMethods.formState.isSubmitting}
          onClick={resendOTP}
        >
          <FontAwesomeIcon icon={faRotate} /> Invia di nuovo
        </Button>
        <Button
          variant="cancel"
          type="button"
          disabled={formMethods.formState.isSubmitting}
          onClick={onCancel}
        >
          <FontAwesomeIcon icon={faClose} /> Annulla
        </Button>
      </Stack>
    </Form>
  );
}
