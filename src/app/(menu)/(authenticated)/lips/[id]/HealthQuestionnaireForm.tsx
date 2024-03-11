"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {YesNoAnswer} from "@/helpers/TypesHelper";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Alert,
  Button,
  Col,
  FormGroup,
  FormLabel,
  InputGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

const healthQuestionnaireDefaultValues = {
  weight: "",
  height: "",
  hospitalization: "" as YesNoAnswer,
  diseases: "" as YesNoAnswer,
  drugTherapy: "" as YesNoAnswer,
  symptomatology: "" as YesNoAnswer,
  professionalRisk: "" as YesNoAnswer,
  sportRisk: "" as YesNoAnswer,
  cancer: "" as YesNoAnswer,
  nervousSystemDiseases: "" as YesNoAnswer,
  invalidityPension: "" as YesNoAnswer,
  physicalImpairment: "" as YesNoAnswer,
};
export function HealthQuestionnaireForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: healthQuestionnaireDefaultValues,
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateHealthQuestionnaire = useDrawerStore(
    (state) => state.updateHealthQuestionnaireData,
  );

  const hasCancerCoverage = useDrawerStore(
    (state) => state.lipData.quote?.cancer.enabled,
  );

  const hasTpiOrTpdCoverage = useDrawerStore(
    (state) =>
      state.lipData.quote?.tpd.enabled || state.lipData.quote?.tpi.enabled,
  );

  return (
    <>
      <ModalBody>
        <Alert variant="info">
          <p>
            Gentile Cliente,
            <br />
            per la corretta compilazione del questionario sullo stato di salute
            si comunica che la Legge n. 193 del 7.12.2023 (di seguito la
            “Legge”) ha introdotto il “
            <strong>diritto all’oblio oncologico</strong>”.
          </p>
          <p>
            In sede di stipula o rinnovo dei contratti di assicurazione non è
            ammesso chiedere informazioni sul precedente stato di salute
            dell’Assicurando/Assicurato che in passato sia stato affetto da
            patologie oncologiche per le quali sia considerato guarito.
          </p>
          <p>
            Secondo la Legge,{" "}
            <u>
              si considera guarita da una patologia oncologica la persona che
            </u>
            , alla data della richiesta di informazioni sul suo stato di salute,{" "}
            <u>
              abbia concluso da più di dieci anni il trattamento attivo, senza
              episodi di recidiva.
            </u>
          </p>
          <p>
            Tale periodo è ridotto a cinque anni se la patologia oncologica sia
            insorta prima del ventunesimo anno di età.
          </p>
          <p>
            Di conseguenza, chi è stato affetto da una patologia oncologica e ha
            concluso il trattamento attivo da più di 10 anni (ovvero 5 anni se
            la patologia è insorta prima del 21° anno di età), senza episodi di
            recidiva, secondo la Legge NON è tenuto a fornire alcuna
            informazione relativa alla precedente patologia oncologica.
          </p>
          <p>
            In ogni caso, qualora le informazioni relative ai casi previsti
            dalla Legge venissero erroneamente riportate
            dall’Assicurando/Assicurato durante la fase assuntiva o fossero
            state fornite precedentemente, le stesse non potranno e non dovranno
            essere utilizzate dalla Compagnia per la determinazione delle
            condizioni contrattuali.
          </p>
        </Alert>
        <Form
          id="healt-questionnaire-form"
          onSubmit={(values) => {
            updateHealthQuestionnaire(values);
            closeModal();
          }}
          formMethods={formMethods}
        >
          <Row className="row-gap-3">
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="height" as={BorderFeedback}>
                <FormLabel>Altezza</FormLabel>
                <FieldError />
                <InputGroup>
                  <InputField
                    type="number"
                    min={60}
                    max={250}
                    step={1}
                    validation={{
                      required: "Inserisci l'altezza dell'Assicurato",
                      max: {value: 250, message: "Altezza massima 250 cm"},
                      min: {value: 60, message: "Altezza minima 60 cm"},
                    }}
                  />
                  <InputGroup.Text>cm</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="weight" as={BorderFeedback}>
                <FormLabel>Peso</FormLabel>
                <HelpText>
                  Se incinta, si prega di indicare il peso immediatamente
                  precedente la gravidanza.
                </HelpText>
                <FieldError />
                <InputGroup>
                  <InputField
                    type="number"
                    min={30}
                    max={250}
                    step={1}
                    validation={{
                      required: "Inserisci ll peso dell'Assicurato",
                      max: {value: 250, message: "Peso massimo 250 kg"},
                      min: {value: 30, message: "Peso minimo 30 kg"},
                    }}
                  />
                  <InputGroup.Text>kg</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="hospitalization" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Negli ultimi 5 anni ha subito ricoveri o interventi chirurgici
                  oppure è attualmente in attesa di ricovero, di intervento, di
                  accertamenti diagnostici o di ricevere i referti di esami
                  effettuati recentemente?
                </p>
                <HelpText>
                  <p>
                    I seguenti interventi non sono da dichiarare:
                    appendicectomia, erniotomia addominali/inguinali,
                    adenoidectomia, tonsillectomia, safenectomia, varicectomia
                    degli arti inferiori, varicocele, deviazioni del setto
                    nasale, meniscectomia o rottura legamenti del ginocchio,
                    fratture senza complicazioni, parto senza complicanze,
                    estrazione dentale, chirurgia estetica.
                  </p>
                  <p className="mb-0">
                    Esempio di accertamenti diagnostici: risonanza magnetica,
                    ecografia, TAC, scintigrafia, radiografia, ecocardiogramma,
                    elettrocardiogramma, biopsia, mammografia, densitometria
                    ossea).
                  </p>
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="diseases" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Negli ultimi 10 anni ha sofferto di una delle seguenti
                  patologie:
                </p>
                <HelpText>
                  tumore, cancro (compresi leucemia, linfoma e mieloma);
                  infarto, ictus, attacco ischemico transitorio, aritmie o altre
                  malattie cardiovascolari o cerebrovascolari; epatite, cirrosi
                  o altre malattie del fegato; diabete, insufficienza renale,
                  rene policistico o altre malattie dell’apparato urogenitale;
                  insufficienza respiratoria cronica, enfisema,
                  broncopneumopatia cronica ostruttiva; infezione da HIV; abuso
                  di alcool, droghe o sostanze stupefacenti?
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="drugTherapy" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Negli ultimi 5 anni ha sofferto di malattie per cui le è stata
                  necessaria una terapia farmacologica per un periodo
                  continuativo di oltre 21 giorni?
                </p>
                <HelpText>
                  I seguenti farmaci non sono da dichiarare: anticoncezionali,
                  antistaminici, farmaci per la tiroide, farmaci per la
                  ipercolesterolemia, farmaci per la pressione con valori medi
                  della pressione inferiori a 140/90.
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="symptomatology" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Soffre di una sintomatologia persistente per la quale intende
                  sottoporsi a degli accertamenti sanitari?
                </p>
                <HelpText>
                  Per esempio, ingrossamento delle ghiandole linfatiche,
                  tumefazioni, noduli, rigonfiamenti, dolori toracici, diarrea,
                  stitichezza, sangue nelle urine, tosse, emicranie, sudorazione
                  notturna, perdita di peso involontaria.
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="professionalRisk" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Pratica un’attività professionale che la espone ad un rischio
                  particolare?
                </p>
                <HelpText>
                  Es: addetti a lavori in sotterranea o su piattaforme
                  petrolifere; lavori in altezza superiore a 15m (ad esempio: su
                  impalcature, tetti, ponteggi, antennista, etc.);
                  palombari/sommozzatori, speleologi, paracadutisti; piloti
                  commerciali privati (non di linea); addetti a contatto con
                  alta tensione, radiazioni, gas, acidi, esplosivi, veleni;
                  collaudatori di veicoli; motoveicoli e/o aeromobili; militare;
                  pompiere; agente di polizia?
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="sportRisk" as={BorderFeedback}>
                <p className="mb-2 input-heading">
                  Pratica attività sportive esposte a particolari rischi?
                </p>
                <HelpText>
                  Es: alpinismo oltre i 4000 metri, arrampicata, scalate su
                  ghiaccio, sci d’alpinismo in solitaria o con spedizioni
                  extraeuropee, speleologia, sport aerei (come ad esempio
                  paracadutismo, parapendio, deltaplano, ultraleggeri, aliante,
                  volo acrobatico), sport motoristici (come ad esempio
                  automobilismo, motociclismo e motonautica), sport acquatici
                  (come ad esempio immersioni subacquee, kitesurf), vela
                  d’altura, pugilato e altre forme di boxe, sport estremi in
                  genere (come ad esempio base jumping, rooftopping, parkour,
                  speedflying, canyoning)?
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            {hasCancerCoverage && (
              <Col className="d-flex" xs={12}>
                <FormGroup controlId="cancer" as={BorderFeedback}>
                  <p className="mb-2 input-heading">
                    Nella sua parentela consanguinea (genitori, fratelli,
                    sorelle, nonni) ci sono stati almeno due casi con la stessa
                    diagnosi di cancro o di tumore maligno diagnosticato prima
                    dell'età di 50 anni.
                  </p>
                  <FieldError />
                  <CheckGroup
                    type="radio"
                    inline
                    options={[
                      {label: "Sì", value: "yes"},
                      {label: "No", value: "no"},
                    ]}
                    validation={{
                      required: "Seleziona un'opzione",
                    }}
                  />
                </FormGroup>
              </Col>
            )}
            {hasTpiOrTpdCoverage && (
              <>
                <Col className="d-flex" xs={12}>
                  <FormGroup
                    controlId="nervousSystemDiseases"
                    as={BorderFeedback}
                  >
                    <p className="mb-2 input-heading">
                      Negli ultimi 10 anni ha sofferto di una delle seguenti
                      patologie?
                    </p>
                    <HelpText>
                      Es: malattie del sistema nervoso centrale e/o periferico
                      (come SLA, sclerosi multipla, paralisi ecc.); malattie
                      neurodegenerative (come Parkinson, Sclerosi multipla,
                      Alzheimer); malattie della psiche (come depressione,
                      schizofrenia); malattie osteoarticolari (come artrite,
                      osteoporosi).
                    </HelpText>
                    <FieldError />
                    <CheckGroup
                      type="radio"
                      inline
                      options={[
                        {label: "Sì", value: "yes"},
                        {label: "No", value: "no"},
                      ]}
                      validation={{
                        required: "Seleziona un'opzione",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12}>
                  <FormGroup controlId="invalidityPension" as={BorderFeedback}>
                    <p className="mb-2 input-heading">
                      Le è stata riconosciuta o ha fatto richiesta di una
                      pensione di invalidità e/o di una pensione per incapacità
                      permanente dovuta a malattia o a infortunio?{" "}
                    </p>
                    <FieldError />
                    <CheckGroup
                      type="radio"
                      inline
                      options={[
                        {label: "Sì", value: "yes"},
                        {label: "No", value: "no"},
                      ]}
                      validation={{
                        required: "Seleziona un'opzione",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12}>
                  <FormGroup controlId="physicalImpairment" as={BorderFeedback}>
                    <p className="mb-2 input-heading">
                      È affetto da difetti fisici, malformazioni, disturbi
                      funzionali o cognitivi?
                    </p>
                    <HelpText>
                      I quali richiedono l'utilizzo di ausili e/o l'assistenza
                      di una terza persona per lo svolgimento di attività della
                      vita quotidiana quali vestirsi, lavarsi, cucinare, fare la
                      spesa, alzarsi, spostarsi dentro e fuori la propria
                      abitazione, gestione dei soldi?
                    </HelpText>
                    <FieldError />
                    <CheckGroup
                      type="radio"
                      inline
                      options={[
                        {label: "Sì", value: "yes"},
                        {label: "No", value: "no"},
                      ]}
                      validation={{
                        required: "Seleziona un'opzione",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12}>
                  <Alert variant="info" className="mb-0">
                    Fornire dettagli per ciascuna delle domande a cui ha
                    risposto “Sì” (tipo di malattia, da quando, nome e indirizzo
                    del medico curante/dell’ospedale)
                  </Alert>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="healt-questionnaire-form">
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
