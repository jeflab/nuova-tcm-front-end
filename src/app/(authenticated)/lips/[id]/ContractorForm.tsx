"use client";

import {FieldError} from "@/ui/form/FieldError";
import Form from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {
  upperCaseNormalizer,
  upperCaseWordsNormalizer,
} from "@/ui/form/normalizers";
import {fiscalCodeValidator} from "@/ui/form/validators";
import {faSave, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  FormGroup,
  FormLabel,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";

export function ContractorForm() {
  return (
    <>
      <ModalBody>
        <Form
          id="contractor-form"
          onSubmit={(values) => {
            console.log(values);
          }}
          className="vstack gap-3"
        >
          <FormGroup controlId="fiscalCode">
            <FormLabel>Codice Fiscale</FormLabel>
            <InputField
              type="text"
              placeholder="Codice Fiscale"
              validation={{
                required: "Inserisci il codice fiscale del contraente",
                validate: (value) =>
                  fiscalCodeValidator(value) || "Codice fiscale non valido",
              }}
              normalize={upperCaseNormalizer}
            />
            <FieldError />
          </FormGroup>
          <FormGroup controlId="name">
            <FormLabel>Nome</FormLabel>
            <InputField
              type="text"
              placeholder="Nome"
              validation={{required: "Inserisci il nome del contraente"}}
              normalize={upperCaseWordsNormalizer}
            />
            <FieldError />
          </FormGroup>
          <FormGroup controlId="surname">
            <FormLabel>Cognome</FormLabel>
            <InputField
              type="text"
              placeholder="Cognome"
              validation={{required: "Inserisci il cognome del contraente"}}
              normalize={upperCaseWordsNormalizer}
            />
            <FieldError />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel">
          <FontAwesomeIcon icon={faXmark} /> Annulla
        </Button>
        <Button type="submit" variant="primary" form="contractor-form">
          <FontAwesomeIcon icon={faSave} /> Salva
        </Button>
      </ModalFooter>
    </>
  );
}
