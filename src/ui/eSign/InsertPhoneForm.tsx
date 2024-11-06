import {normalizeError} from "@/helpers/errors";
import {Profile} from "@/models/account";
import {PersonalData} from "@/models/entities/personalData";
import {cns} from "@/helpers/cns";
import {updateAgentPhone, updateContractorPhone} from "@/ui/eSign/actions";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {faCheck, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button, FormGroup, FormLabel, Stack} from "react-bootstrap";
import invariant from "tiny-invariant";

export interface InsertPhoneFormData {
  phone: string;
}

interface InsertPhoneFormProps {
  closeEditNumberForm: () => void;
  defaultValues: InsertPhoneFormData;
  lipId: number;
  onCancel: () => void;
  onNumberUpdated?: () => void;
  personalData?: PersonalData;
  profile: Profile;
}

export function InsertPhoneForm({
  closeEditNumberForm,
  defaultValues,
  lipId,
  onCancel,
  onNumberUpdated,
  personalData,
  profile,
}: InsertPhoneFormProps) {
  return (
    <Form
      onSubmit={async (values) => {
        if (personalData) {
          const updateContractorPhoneResponse = await updateContractorPhone(
            personalData.id,
            lipId,
            values.phone,
          );
          if (updateContractorPhoneResponse?.status !== "success") {
            throw {
              root: {
                type: "server",
                message: normalizeError(updateContractorPhoneResponse).message,
              },
            };
          }
          onNumberUpdated?.();
          closeEditNumberForm();
        } else {
          invariant(profile.agent?.id, "Agent ID is missing");
          const updateAgentPhoneResponse = await updateAgentPhone(
            profile.agent.id,
            values.phone,
          );

          if (updateAgentPhoneResponse?.status !== "success") {
            throw {
              root: {
                type: "server",
                message: normalizeError(updateAgentPhoneResponse).message,
              },
            };
          }

          onNumberUpdated?.();
          closeEditNumberForm();
        }
      }}
      defaultValues={defaultValues}
      className="vstack gap-3"
    >
      {personalData ? (
        <h3>Inserisci il numero di cellulare del tuo Contraente</h3>
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
      <Stack direction="horizontal" gap={2}>
        <SubmitButton>
          {(isLoggingIn) => (
            <>
              <FontAwesomeIcon
                icon={isLoggingIn ? faSpinner : faCheck}
                className={cns("me-2", isLoggingIn && "fa-spin")}
              />
              Conferma
            </>
          )}
        </SubmitButton>
        <Button variant="cancel" type="button" onClick={onCancel}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
      </Stack>
    </Form>
  );
}
