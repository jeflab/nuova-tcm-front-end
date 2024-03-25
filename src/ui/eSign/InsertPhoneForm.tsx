import {Profile} from "@/models/account";
import {PersonalData} from "@/models/entities/personalData";
import {cns} from "@/helpers/cns";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {faSignInAlt} from "@fortawesome/pro-duotone-svg-icons/faSignInAlt";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button, FormGroup, FormLabel} from "react-bootstrap";

export interface InsertPhoneFormData {
  phone: string;
}

interface InsertPhoneFormProps {
  closeEditNumberForm: () => void;
  defaultValues: InsertPhoneFormData;
  onCancel: () => void;
  personalData?: PersonalData;
  profile: Profile;
}

export function InsertPhoneForm({
  closeEditNumberForm,
  defaultValues,
  onCancel,
  personalData,
  profile,
}: InsertPhoneFormProps) {
  return (
    <Form
      onSubmit={(values) => {
        if (personalData) {
          console.log(
            `Aggiorno il personalData ${personalData.name} ${personalData.surname} con il numero di cellulare ${values.phone}`,
          );
        } else {
          console.log(
            `Aggiorno il profilo ${profile.agent?.name ?? profile.contractor?.name} ${profile.agent?.surname ?? profile.contractor?.surname} con il numero di cellulare ${values.phone}`,
          );
        }
      }}
      defaultValues={defaultValues}
      className="vstack gap-3"
    >
      {personalData ? (
        <h3>Inserisci il numero di cellulare del tuo cliente</h3>
      ) : (
        <h3>Inserisci il tuo numero di cellulare</h3>
      )}
      <p>in questo modo potremo inviare l'OTP per firmare il documento</p>
      <FormGroup controlId="phone" as={BorderFeedback}>
        <FormLabel>Numero di cellulare</FormLabel>
        <FieldError />
        <InputField
          type="tel"
          placeholder="Numero di cellulare"
          validation={{
            required: "Inserisci il Cellulare del Contraente",
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
