"use client";

import {
  updateAccount,
  updatePassword,
} from "@/app/(menu)/(authenticated)/profile/actions";
import {cns} from "@/helpers/cns";
import {normalizeError} from "@/helpers/errors";
import {User} from "@/models/entities/user";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {emailNormalizer, onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {ReverseFormGroup} from "@/ui/form/ReverseFormGroup";
import {emailValidator} from "@/ui/form/validators/email";
import {password} from "@/ui/form/validators/password";
import {IconStack} from "@/ui/IconStack";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {
  faSave,
  faSpinner,
  faUserPen,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {faLock, faPen} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

interface AccountProfileProps {
  user: User;
}

export function AccountProfile({user}: AccountProfileProps) {
  const [animateContainer] = useAutoAnimate();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState<
    "close" | "open" | "success"
  >("close");
  const updateProfileFormMethods = useForm({
    defaultValues: {
      fiscalCode: user.fiscalCode,
      email: user.email,
      phone: user.phone ?? "",
    },
  });

  const updatePasswordFormMethods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  return (
    <Card>
      <CardHeader>Account</CardHeader>
      <CardBody>
        <div ref={animateContainer}>
          <Form
            id="update-profile"
            formMethods={updateProfileFormMethods}
            onSubmit={async (values) => {
              const updateAccountResponse = await updateAccount(values);

              if (updateAccountResponse?.status !== "success") {
                throw {
                  root: {
                    type: "server",
                    message: normalizeError(updateAccountResponse).message,
                  },
                };
              }

              setIsUpdateMode(false);
            }}
          >
            <Row as="dl" xs={1} sm={3}>
              <Col>
                <dt id="fiscal-code-label">Codice fiscale:</dt>
                <dd>{user.fiscalCode}</dd>
              </Col>
              <Col>
                <dt>E-Mail:</dt>
                {isUpdateMode ? (
                  <dd>
                    <InputField
                      type="email"
                      name="email"
                      placeholder="E-Mail"
                      normalize={emailNormalizer}
                      validation={{
                        validate: {
                          required: (value) => {
                            if (!value) {
                              return "Inserisci la tua e-mail";
                            }
                          },
                          pattern: (value) => {
                            if (!emailValidator(value)) {
                              return "L'e-mail inserita non è valida";
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
            <FieldError name="root" as={Alert} variant="danger" />
          </Form>
          {isPasswordMode === "open" && (
            <Form
              id="update-password"
              formMethods={updatePasswordFormMethods}
              onSubmit={async (values) => {
                if (values.newPassword !== values.repeatNewPassword) {
                  throw {
                    repeatNewPassword: {
                      type: "custom",
                      message: "Le password non corrispondono",
                    },
                  };
                }
                const updatePasswordResponse = await updatePassword(values);

                if (updatePasswordResponse?.status !== "success") {
                  throw {
                    root: {
                      type: "server",
                      message: normalizeError(updatePasswordResponse).message,
                    },
                  };
                }

                setIsPasswordMode("success");
              }}
            >
              <Row as="dl" xs={1} sm={3}>
                <Col>
                  <FormGroup as={ReverseFormGroup} controlId="oldPassword">
                    <FormLabel>Vecchia password</FormLabel>
                    <FieldError />
                    <InputField
                      type="password"
                      name="oldPassword"
                      placeholder="Vecchia password"
                      validation={{
                        required: "Inserisci la tua vecchia password",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup as={ReverseFormGroup} controlId="newPassword">
                    <FormLabel>Nuova password</FormLabel>
                    <HelpText>
                      La password deve contenere almeno 12 caratteri, di cui
                      almeno una lettera maiuscola, una lettera minuscola, un
                      numero e un carattere speciale.
                    </HelpText>
                    <FieldError />
                    <InputField
                      type="password"
                      name="newPassword"
                      placeholder="Nuova password"
                      validation={{
                        validate: {
                          required: (value) => {
                            if (!value) {
                              return "Inserisci la tua nuova password";
                            }
                          },
                          pattern: (value) => {
                            if (value && !password(value)) {
                              return "La password deve non rispetta i requisiti minimi di sicurezza";
                            }
                          },
                        },
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup
                    as={ReverseFormGroup}
                    controlId="repeatNewPassword"
                  >
                    <FormLabel>Ripeti nuova password</FormLabel>
                    <FieldError />
                    <InputField
                      type="password"
                      name="repeatNewPassword"
                      placeholder="Ripeti nuova password"
                      validation={{
                        required: "Ripeti la tua nuova password",
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FieldError name="root" as={Alert} variant="danger" />
            </Form>
          )}
          {isPasswordMode === "success" && (
            <Alert variant="success" dismissible>
              Password modificata con successo
            </Alert>
          )}
          {isUpdateMode && (
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Button type="submit" form="update-profile">
                <FontAwesomeIcon
                  icon={
                    updateProfileFormMethods.formState.isSubmitting
                      ? faSpinner
                      : faSave
                  }
                  className={cns(
                    "me-2",
                    updateProfileFormMethods.formState.isSubmitting &&
                      "fa-spin",
                  )}
                />
                Salva profilo
              </Button>
              <Button
                type="button"
                variant="cancel"
                onClick={() => {
                  setIsUpdateMode(false);
                  updateProfileFormMethods.reset();
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="me-2" />
                Annulla
              </Button>
            </div>
          )}
          {isPasswordMode === "open" && (
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Button type="submit" form="update-password">
                <FontAwesomeIcon
                  icon={
                    updatePasswordFormMethods.formState.isSubmitting
                      ? faSpinner
                      : faSave
                  }
                  className={cns(
                    "me-2",
                    updatePasswordFormMethods.formState.isSubmitting &&
                      "fa-spin",
                  )}
                />
                Salva password
              </Button>
              <Button
                type="button"
                variant="cancel"
                onClick={() => {
                  setIsPasswordMode("close");
                  updatePasswordFormMethods.reset();
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="me-2" />
                Annulla
              </Button>
            </div>
          )}
          {!isUpdateMode && ["close", "success"].includes(isPasswordMode) && (
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Button
                type="button"
                onClick={() => {
                  setIsUpdateMode(true);
                  setIsPasswordMode("close");
                }}
              >
                <FontAwesomeIcon icon={faUserPen} className="me-2" />
                Modifica profilo
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsPasswordMode("open");
                }}
              >
                <IconStack className="me-2">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="fa-stack-2x"
                    opacity={0.4}
                  />
                  <FontAwesomeIcon
                    icon={faPen}
                    className="fa-stack-1x"
                    transform="down-7 right-16"
                  />
                </IconStack>
                Modifica password
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
