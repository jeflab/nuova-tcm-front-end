"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  lipSalesModeOptions,
  lipTypeOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
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
  const typeData = useStore((state) => state.preliminaryData.type);
  const salesModeData = useStore((state) => state.preliminaryData.salesMode);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {type: typeData, salesMode: salesModeData},
  });

  const {closeModal} = useDrawerModal();
  const updatePreliminaryData = useStore(
    (state) => state.updatePreliminaryData,
  );

  return (
    <>
      <ModalBody>
        <Form
          id="fatca-form"
          onSubmit={(values) => {
            updatePreliminaryData({
              type: values.type,
              salesMode: values.salesMode,
            });
            closeModal();
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
