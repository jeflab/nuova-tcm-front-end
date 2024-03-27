"use client";

import {updateAccount} from "@/app/(menu)/(authenticated)/profile/actions";
import {cns} from "@/helpers/cns";
import {User} from "@/models/entities/user";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {
  emailNormalizer,
  onlyNumbersNormalizer,
  upperCaseNormalizer,
} from "@/ui/form/normalizers";
import {email} from "@/ui/form/validators/email";
import {fiscalCodeValidator} from "@/ui/form/validators/fiscalCode";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Button, Row, Card, Col, Alert} from "react-bootstrap";
import {useForm} from "react-hook-form";

interface AccountProfileProps {
  user: User;
}

export function AccountProfile({user}: AccountProfileProps) {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const formMethods = useForm({
    defaultValues: {
      fiscalCode: user.fiscalCode,
      email: user.email,
      phone: user.phone ?? "",
    },
  });

  return (
    <Form
      formMethods={formMethods}
      onSubmit={async (values) => {
        const updateAccountResponse = await updateAccount(values);

        if (updateAccountResponse.status === "failed") {
          throw {
            root: {
              type: "server",
              message: updateAccountResponse.message,
            },
          };
        }

        setIsUpdateMode(false);
      }}
    >
      <h3>Account</h3>
      <Card body>
        <Row as="dl" xs={1} sm={3}>
          <Col>
            <dt id="fiscal-code-label">Codice fiscale:</dt>
            {isUpdateMode ? (
              <dd>
                <InputField
                  type="text"
                  name="fiscalCode"
                  placeholder="Codice fiscale"
                  normalize={upperCaseNormalizer}
                  aria-labelledby="fiscal-code-label"
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Inserisci il tuo codice fiscale";
                        }
                      },
                      custom: (value) => {
                        if (!fiscalCodeValidator(value)) {
                          return "Il codice fiscale inserito non è valido";
                        }
                      },
                    },
                  }}
                />
                <FieldError name="fiscalCode" />
              </dd>
            ) : (
              <dd>{user.fiscalCode}</dd>
            )}
          </Col>
          <Col>
            <dt>Email:</dt>
            {isUpdateMode ? (
              <dd>
                <InputField
                  type="email"
                  name="email"
                  placeholder="Email"
                  normalize={emailNormalizer}
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Inserisci la tia email";
                        }
                      },
                      pattern: (value) => {
                        if (!email(value)) {
                          return "L'email inserita non è valida";
                        }
                      },
                    },
                  }}
                />
                <FieldError name="email" />
              </dd>
            ) : (
              <dd>{user.email}</dd>
            )}
          </Col>
          <Col>
            <dt>Numero di cellulare:</dt>
            {isUpdateMode ? (
              <dd>
                <InputField
                  type="tel"
                  name="phone"
                  placeholder="Numero di cellulare"
                  validation={{
                    required: "Inserisci il tuo numero di cellulare",
                  }}
                  normalize={onlyNumbersNormalizer}
                />
                <FieldError name="phone" />
              </dd>
            ) : (
              <dd>{user.phone}</dd>
            )}
          </Col>
        </Row>
        {isUpdateMode ? (
          <>
            <FieldError name="root" as={Alert} variant="danger" />
            <Button type="submit" className="me-2">
              <FontAwesomeIcon
                icon={formMethods.formState.isSubmitting ? faSpinner : faSave}
                className={cns(
                  "me-2",
                  formMethods.formState.isSubmitting && "fa-spin",
                )}
              />
              Salva
            </Button>
            <Button
              type="button"
              variant="cancel"
              onClick={() => {
                setIsUpdateMode(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} className="me-2" />
              Annulla
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setIsUpdateMode(true);
            }}
          >
            Modifica
          </Button>
        )}
      </Card>
    </Form>
  );
}
