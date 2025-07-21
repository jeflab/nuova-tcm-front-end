import {
  IdType,
  idTypeOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {dbDateString} from "@/helpers/dates";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {InputField} from "@/ui/form/InputField";
import {SelectField} from "@/ui/form/SelectField";
import {Col, FormGroup, FormLabel} from "react-bootstrap";

export interface IdentityDocumentFormValues {
  idType: IdType;
  number: string;
  issuedBy: string;
  issuedByOrg: string;
  issuedDate: Date;
  expiringDate: Date;
}

export function getIdentityDocumentDefaultValues(
  defaultValues?: IdentityDocumentFormValues,
  onlyIdentityCard?: boolean,
) {
  return {
    idType:
      defaultValues?.idType ??
      ((onlyIdentityCard ? "identity_card" : "") as IdType),
    number: defaultValues?.number ?? "",
    issuedBy: defaultValues?.issuedBy ?? "",
    issuedByOrg: defaultValues?.issuedByOrg ?? "",
    issuedDate: defaultValues?.issuedDate
      ? dbDateString(defaultValues.issuedDate)
      : "",
    expiringDate: defaultValues?.expiringDate
      ? dbDateString(defaultValues.expiringDate)
      : "",
  };
}

interface IdentityDocumentFormProps {
  name?: string;
  onlyIdentityCard?: boolean;
}

export function IdentityDocumentForm({
  name,
  onlyIdentityCard,
}: IdentityDocumentFormProps) {
  const namePrefix = name ? `${name}.` : "";
  const typeOptionsAvailable = onlyIdentityCard
    ? [idTypeOptions.find((type) => type.value === "identity_card")!]
    : idTypeOptions;

  return (
    <>
      <Col className="d-flex" xs={12}>
        <FormGroup controlId={`${namePrefix}idType`} as={BorderFeedback}>
          <FormLabel>Tipo di documento</FormLabel>
          <FieldError />
          <SelectField
            options={typeOptionsAvailable}
            placeholder="Seleziona il tipo di documento"
            validation={{
              required: "Seleziona il tipo di documento",
            }}
            readOnly={onlyIdentityCard}
            disabled={onlyIdentityCard}
          />
        </FormGroup>
      </Col>
      <Col className="d-flex" xs={12} sm={4}>
        <FormGroup controlId={`${namePrefix}number`} as={BorderFeedback}>
          <FormLabel>Numero documento</FormLabel>
          <FieldError />
          <InputField
            type="text"
            placeholder="Numero documento"
            validation={{
              required: "Inserisci il numero del documento",
            }}
          />
        </FormGroup>
      </Col>
      <Col className="d-flex" xs={12} sm={4}>
        <FormGroup controlId={`${namePrefix}issuedByOrg`} as={BorderFeedback}>
          <FormLabel>Rilasciato da</FormLabel>
          <FieldError />
          <InputField
            type="text"
            placeholder="Rilasciato da"
            validation={{
              required: "Inserisci l'ente di rilascio",
            }}
          />
        </FormGroup>
      </Col>
      <Col className="d-flex" xs={12} sm={4}>
        <FormGroup controlId={`${namePrefix}issuedBy`} as={BorderFeedback}>
          <FormLabel>Luogo di rilascio</FormLabel>
          <FieldError />
          <InputField
            type="text"
            placeholder="Luogo di rilascio"
            validation={{
              required: "Inserisci il luogo di rilascio",
            }}
          />
        </FormGroup>
      </Col>
      <Col className="d-flex" xs={12} sm={6}>
        <FormGroup controlId={`${namePrefix}issuedDate`} as={BorderFeedback}>
          <FormLabel>Data di rilascio</FormLabel>
          <FieldError />
          <InputField
            type="date"
            placeholder="Data di rilascio"
            max={dbDateString()}
            validation={{
              required: "Inserisci la data di rilascio",
              max: {
                value: dbDateString(),
                message: "La data di rilascio non può essere nel futuro",
              },
            }}
          />
        </FormGroup>
      </Col>
      <Col className="d-flex" xs={12} sm={6}>
        <FormGroup controlId={`${namePrefix}expiringDate`} as={BorderFeedback}>
          <FormLabel>Data di scadenza</FormLabel>
          <FieldError />
          <InputField
            type="date"
            placeholder="Data di scadenza"
            min={dbDateString()}
            validation={{
              min: {
                value: dbDateString(),
                message: "La data di scadenza non può essere nel passato",
              },
              required: "Inserisci la data di scadenza",
            }}
          />
        </FormGroup>
      </Col>
    </>
  );
}
