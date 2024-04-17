import {saveCompanyPrivacyConsent} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import styles from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsManagement.module.scss";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {Form} from "@/ui/form/Form";
import {faClipboardCheck} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from "react-bootstrap";
import invariant from "tiny-invariant";

const consentOptions = [
  {
    label: "Consenso per la comunicazione di dati personali a terzi",
    value: "consent1",
  },
  {
    label: "Consenso per l'uso dei dati per marketing diretto",
    value: "consent2",
  },
  {
    label: "Consenso per l'uso dei dati per profilazione",
    value: "consent3",
  },
  {
    label: "Consenso per l'uso dei dati per marketing via email",
    value: "consent4",
  },
] as const;
type ConsentOptions = (typeof consentOptions)[number]["value"];

interface CompanyPrivacyProps {
  lipId: number;
  show: boolean;
  onHide: () => void;
}

export function CompanyPrivacy({lipId, onHide, show}: CompanyPrivacyProps) {
  return (
    <Modal
      backdrop="static"
      className={styles.modal}
      fullscreen="xl-down"
      size="xl"
      onHide={onHide}
      keyboard={false}
      show={show}
    >
      <ModalHeader closeButton>
        <Modal.Title>Privacy di compagnia</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <div>
          <h3>Prodotto</h3>
          <p className="mb-0">
            Il contraente dichiara di aver ricevuto e letto il documento di cui
            sopra e di accettare le condizioni ivi contenute.
          </p>
        </div>
        <hr />
        <div>
          <h3>Marketing</h3>
          <p className="mb-0">
            Il contraente dichiara di aver ricevuto e letto il documento di cui
            sopra e di accettare le condizioni ivi contenute.
          </p>
        </div>
        <hr />
        <Form
          onSubmit={async (values) => {
            invariant(lipId, "lipId is required");
            const updatedContractor = await saveCompanyPrivacyConsent(
              values,
              lipId,
            );

            if (updatedContractor.status === "failed") {
              throw {
                root: {
                  type: "server",
                  message: updatedContractor.message,
                },
              };
            }

            onHide();
          }}
          defaultValues={{flags: [] as ConsentOptions[]}}
        >
          <FormGroup controlId="flags" className="mb-3">
            <CheckGroup
              type="checkbox"
              options={consentOptions}
              validationStyle={false}
            />
          </FormGroup>
          <Button type="submit">
            <FontAwesomeIcon icon={faClipboardCheck} /> Salva consensi
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
