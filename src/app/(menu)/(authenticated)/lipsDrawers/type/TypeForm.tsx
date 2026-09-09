"use client";

import {useUpdateLipLocalDataMutation} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {
  lipSalesModeOptions,
  lipTypeOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {useDrawerModal} from "@/ui/ModalContext";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  FormGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

export function TypeForm() {
  const {
    data: {lip},
  } = useSuspenseLip();
  const {mutateAsync: updateLip} = useUpdateLipLocalDataMutation();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {type: lip.type, salesMode: lip.salesMode},
  });

  const {closeModal} = useDrawerModal();

  return (
    <>
      <ModalBody>
        <Form
          id="fatca-form"
          onSubmit={async (values) => {
            await updateLip(
              {
                lipId: "new",
                data: {
                  type: values.type,
                  salesMode: values.salesMode,
                },
              },
              {
                onSuccess: () => {
                  closeModal();
                },
              },
            );
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <Col className="d-flex" xs={12} sm={6} md={12} lg={6}>
              <FormGroup controlId="type" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Scegli il tipo di polizza che vuoi creare
                </p>
                <FieldError />
                <CheckGroup
                  type="radio"
                  options={lipTypeOptions}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={12} lg={6}>
              <FormGroup controlId="salesMode" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Scegli come avviene la vendita
                </p>
                <FieldError />
                <CheckGroup
                  type="radio"
                  options={lipSalesModeOptions}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="fatca-form">
          {formMethods.formState.isSubmitting ? (
            <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
          ) : (
            <FontAwesomeIcon icon={faSave} className="me-2" />
          )}
          Salva e prosegui
        </Button>
      </ModalFooter>
    </>
  );
}
