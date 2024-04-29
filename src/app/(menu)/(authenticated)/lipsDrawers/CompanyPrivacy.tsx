import {saveCompanyPrivacyConsent} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  consentOptions,
  ConsentOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {cns} from "@/helpers/cns";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {
  faClipboardCheck,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Alert,
  Button,
  FormGroup,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";

interface CompanyPrivacyProps {
  onHide?: () => void;
}

export function CompanyPrivacy({onHide}: CompanyPrivacyProps) {
  const privacyCompany = useDrawerStore((state) =>
    state.lip?.privacyCompany?.at(-1),
  );
  const lip = useDrawerStore((state) => state.lip);
  const closeModalFromStore = useDrawerStore((state) => state.closeModal);

  const formMethods = useForm({
    defaultValues: {flags: privacyCompany?.flags ?? ([] as ConsentOptions[])},
  });

  const closeModal = onHide ?? closeModalFromStore;

  return (
    <>
      <ModalBody>
        <div>
          <h3 className="text-primary">
            Informativa sul trattamento dei dati personali (Regolamento Generale
            UE sulla protezione dei dati n. 679/2016 – Art. 13)
          </h3>
          <p>
            Di seguito potrai trovare le principali informazioni fornite ai
            sensi dell’art. 13 del Regolamento Generale sulla protezione dei
            dati personali n. 679/2016 (“
            <strong>
              <abbr title="General Data Protection Regulation: Regolamento generale sulla protezione dei dati">
                GDPR
              </abbr>
            </strong>
            ”) sui trattamenti dei tuoi dati personali.
            <br />
            Ti ricordiamo di prendere visione della{" "}
            <strong>Informativa estesa</strong> a questo specifico link:{" "}
            <a href="https://lifestarinsurance.com/privacy-policy/">
              https://lifestarinsurance.com/privacy-policy/
            </a>
          </p>
          <h4 className="text-primary">Chi tratta i miei dati personali?</h4>
          <p>
            <strong>Lifestar Insurance Plc</strong>, impresa assicurativa
            iscritta nel Registro delle imprese di Malta al numero C29086,
            Partita IVA: MT17570311, abilitata ad agire in Italia in regime di
            libera prestazione dei servizi (LPS) con iscrizione all’elenco delle
            Imprese LPS presso IVASS n al n [TODO: inserire numero IVASS].
          </p>
          <h4 className="text-primary">
            Come posso contattare LifeStar per esercitare i miei diritti o per
            ottenere informazioni?
          </h4>
          <p>
            Puoi contattare LifeStar Insurance presso la sede sita in
            Testaferrata Street, Ta’ Xbiex XBX 1403 – Malta - Telefono:{" "}
            <a href="tel:+35621342342">+356 21 342342</a> Email:{" "}
            <a href="mailto:info@lifestarinsurance.com">
              info@lifestarinsurance.com
            </a>{" "}
            [TODO: aggiornare link]
          </p>
          <h4 className="text-primary">
            Che tipo di dati personali che mi riguardano sono raccolti e
            trattati?
          </h4>
          <p>
            Raccogliamo e trattiamo i tuoi dati personali comuni, come ad
            esempio: dati anagrafici, di contatto, dati bancari per i pagamenti,
            le tue immagini quanto ti identifichiamo a distanza, etc. Per i
            rapporti assicurativi che riguardano il ramo vita o salute,
            raccogliamo e trattiamo anche tuoi dati personali che rivelano
            informazioni relative al tuo stato di salute. Se utilizzi servizi
            come la firma grafometrica per sottoscrivere le nostre polizze
            trattiamo anche i tuoi dati biometrici, mentre, in alcuni casi,
            trattiamo anche dati idonei a rivelare la tua origine razziale o
            etnica.
            <br />
            Infine, raccogliamo e trattiamo anche tuoi dati personali relativi
            ad eventuali condanne penali, reati o misure di sicurezza solo se
            previsto dalla legge e solo se il trattamento è necessario per
            l’accertamento delle responsabilità in relazione a sinistri o eventi
            attinenti alla vita umana oppure per la prevenzione, l'accertamento
            e il contrasto di frodi o di situazioni di concreto rischio per il
            corretto esercizio dell'attività assicurativa.
          </p>
          <h4 className="text-primary">
            Da quali fonti LifeStar acquisisce i dati personali che mi
            riguardano?
          </h4>
          <p>
            Raccogliamo i tuoi dati personali – di regola - direttamente presso
            di te oppure dal Contraente che stipula a tuo favore una polizza.
            Raccogliamo i tuoi dati personali anche avvalendoci di banche dati,
            elenchi e registri pubblici legittimamente accessibili (es:
            consultazione delle centrali-rischi private o di banche dati di
            informazione commerciale), da altri operatori assicurativi (quali
            agenti, broker di assicurazione, imprese di assicurazione ecc.); da
            soggetti pubblici; da dispositivi elettronici, app, piattaforme
            elettroniche e siti web.
          </p>
          <h4 className="text-primary">
            Per quali finalità sono raccolti e trattati i miei dati personali e
            con quali modalità vengono trattati?
          </h4>
          <p>
            LifeStar tratta i tuoi dati personali per perseguire finalità
            assicurative in senso lato e che comportano che i tuoi dati
            personali siano trattati necessariamente per: predisposizione,
            stipulazione di polizze assicurative ed esecuzione degli obblighi
            dalle stesse derivanti; raccolta dei premi; liquidazione dei
            sinistri, pagamento o esecuzione di altre prestazioni; gestione
            reclami; riassicurazione; coassicurazione; prevenzione e
            individuazione delle frodi assicurative e relative azioni legali;
            esercizio o difesa di diritti dell'assicurazione; adempimento di
            altri specifici obblighi di legge o contrattuali; gestione e
            controllo interno; attività statistiche.
          </p>
          <p>
            Inoltre, prima della conclusione o indipendentemente dalla
            conclusione di polizze, il trattamento dei tuoi dati personali
            persegue anche finalità precontrattuali, ogni qual volta ci contatti
            o inoltri delle richieste e abbiamo necessità di trattare i tuoi
            dati per riscontrare le richieste ricevute (es: richieste di
            quotazioni dei rischi, richieste di preventivi, etc).
          </p>
          <p>
            Le modalità del trattamento dei tuoi dati personali sono
            rappresentate da gestione manuale o cartacea (es: compilazione di
            modulistica) o da trattamenti in via elettronica o comunque
            automatizzata mediante app, piattaforme, siti web LifeStar.
          </p>
          <h4 className="text-primary">
            Su quale base giuridica si fondano i trattamenti dei miei dati
            personali?
          </h4>
          <p>
            Per perseguire le finalità assicurative la base giuridica è
            rappresentata dal fatto che sei parte di un contratto o comunque di
            un rapporto giuridico a cui dobbiamo dare esecuzione o dalla
            circostanza che dobbiamo riscontrare tue specifiche richieste.
            <br />
            In alcuni casi, come ad esempio quando siamo tenuti al rispetto di
            norme di legge, come quelle a scopi antiriciclaggio che ci obbligano
            alla identificazione della clientela o quelle del settore
            assicurativo, la base di legittimità del trattamento è rappresentata
            dalla necessità di dare esecuzione ad obblighi legali.
            <br />
            Altri trattamenti si basano invece sul legittimo interesse di
            LifeStar, come nel caso di trattamento per il controllo e la
            prevenzione di frodi e del rischio di insolvenza, per esercitare o
            difendere un diritto o un interesse avanti a qualsiasi sede
            giudiziaria o amministrativa, per elaborazioni statistiche su dati
            aggregati ed in forma anonima, per l’invio di comunicazioni di
            servizio non pubblicitarie.
            <br />
            In tutti i casi di trattamento che abbiamo menzionato più sopra non
            dobbiamo raccogliere il tuo consenso.
            <br />
            Per trattare i tuoi dati di particolare natura – come ad esempio i
            dati che si riferiscono al tuo stato di salute o quelli biometrici
            per i servizi di firma grafometrica – dobbiamo invece
            necessariamente raccogliere il tuo consenso esplicito per iscritto.
          </p>
          <h4 className="text-primary">
            Sono obbligato a dare il consenso al trattamento dei miei dati?
          </h4>
          <p>
            Nel caso di consenso per trattare i tuoi dati di particolare natura
            – come, ad esempio, i dati che si riferiscono al tuo stato di salute
            o quelli biometrici per i servizi di firma grafometrica – resti
            sempre libero di prestare o meno il consenso e di revocarlo anche
            successivamente e senza formalità, ma la conseguenza sarà che sarà
            impossibile per LifeStar fornire (oppure continuare a fornire) i
            prodotti o servizi assicurativi che si basano sul necessario
            trattamento delle categorie particolari di dati personali che ti
            riguardano. Ad esempio, non sarà possibile stipulare una polizza del
            ramo vita o salute se non presti il consenso al trattamento dei tuoi
            dati relativi alla salute o se lo revochi successivamente.
          </p>
          <h4 className="text-primary">
            A chi vengono comunicati e diffusi i miei dati personali?
          </h4>
          <p>
            I tuoi dati personali vengono comunicati a terzi soggetti esterni
            che supportano LifeStar nel perseguimento delle finalità connesse
            alla stipula e alla gestione di tutti i rapporti giuridici o
            contrattuali instaurati per le sopra citate finalità assicurative.
            Comunichiamo i tuoi dati personali a specifici destinatari
            rappresentati da soggetti pubblici e autorità di sorveglianza (es:
            l’IVASS); ai soggetti della cosiddetta catena assicurativa (periti,
            medici legali, etc); a società che supportano LifeStar nelle
            verifiche antifrode a consulenti, banche per i pagamenti, ad eredi
            di assicurati, secondo quanto previsto dal Garante privacy, etc. Per
            effettuare queste comunicazioni all’esterno non abbiamo bisogno di
            raccogliere il tuo consenso perché si tratta di comunicazioni
            necessarie per scopi contrattuali o legali.
          </p>
          <p>
            Non diffondiamo i dati personali (cioè, non li mettiamo a
            disposizione di destinatari esterni non individuati o individuabili)
          </p>
          <h4 className="text-primary">
            I miei dati personali sono oggetto di trattamento automatizzato,
            incusa la profilazione?
          </h4>
          <p>
            Si, ma esclusivamente in casi specifici di particolari richieste
            connesse a un contratto o alla stipula di una polizza. Ad esempio,
            perché ci hai richiesto un preventivo basato sulla cosiddetta
            gestione complessa dei rischi assicurativi per cui vanno valutati
            specifici parametri mediante trattamenti automatizzati (e in questo
            caso le informazioni e gli esiti ottenuti non sono utilizzati se non
            per renderti il servizio di preventivo richiesto, senza ulteriori
            finalità).
          </p>
          <h4 className="text-primary">
            Per quanto vengono conservati i miei dati personali?
          </h4>
          <p>
            A seconda delle finalità perseguite, i tuoi dati personali vengono
            conservati per un tempo variabile, alla scadenza del quale vengono
            cancellati irreversibilmente. I termini di conservazione dei tuoi
            dati personali variano dal termine più lungo (es: 10 anni per i dati
            relativi a rapporti contrattuali, decorrenti dalla stipula del
            rapporto assicurativo; 10 anni per i dati trattati a scopi
            antiriciclaggio; 10 anni per la conservazione di legge di fatture e
            documenti civilistici e contabili) a termini più brevi che variano
            da 3 mesi a 12 mesi a 2 o 5 anni, a seconda dei casi, come meglio
            dettagliato nella Informativa estesa.
          </p>
          <h4 className="text-primary">
            I miei dati personali sono trasferiti al di fuori dello Spazio
            economico Europeo?
          </h4>
          <p>
            No. I tuoi dati personali non vengono trasferiti al di fuori del
            territorio dello Spazio Economico Europeo (UE+ Norvegia, Islanda e
            Liechtenstein).
          </p>
          <p>
            Incidentalmente, se utilizzi alcuni servizi (es: Google) su
            piattaforme, app o siti web di Lifestar, i tuoi dati personali
            possono essere trasferiti negli Stati Uniti d’America sui server
            delle società che li offrono. In ogni caso, gli USA sono un Paese
            che la Commissione UE ritiene adeguato quanto alla protezione
            giuridica dei dati personali e dunque il trasferimento è lecito.
          </p>
          <h4 className="text-primary">
            Quali diritti o forme di tutela e di ricorso posso esercitare?
          </h4>
          <p>
            Hai diritto a proporre – in Italia - un reclamo al Garante per la
            protezione dei dati personali, se Autorità competente, seguendo le
            procedure e le indicazioni pubblicate sul sito web ufficiale
            dell’Autorità su{" "}
            <a href="https://www.garanteprivacy.it/">www.garanteprivacy.it</a>.
          </p>
          <p>
            Puoi esercitare, del tutto gratuitamente, scrivendo alla email:{" "}
            <a href="mailto:gdpr@lifestarinsurance.com">
              gdpr@lifestarinsurance.com
            </a>{" "}
            i seguenti diritti:
          </p>
          <p>
            <strong>Diritto alla portabilità</strong> che ti consente di
            ricevere i dati personali forniti a LifeStar in un formato
            strutturato, di uso comune e leggibile da dispositivo automatico, e
            - a certe condizioni - di trasmetterli a un altro titolare del
            trattamento senza impedimenti.
          </p>
          <p>
            <strong>Diritto di accesso</strong> (ai soli propri dati personali):
            diritto di ottenere la conferma che sia o meno in corso un
            trattamento di dati personali che ti riguardano e di ottenere
            l'accesso ai dati personali.
          </p>
          <p>
            <strong>Diritto di rettifica e integrazione</strong>: diritto di
            ottenere la rettifica dei dati personali inesatti o l'integrazione
            dei dati personali incompleti.
          </p>
          <p>
            <strong>Diritto alla cancellazione</strong>: diritto di ottenere la
            cancellazione dei dati personali che ti riguardano, a certe
            condizioni che puoi esaminare nella Informativa estesa.
          </p>
          <p>
            <strong>Diritto alla limitazione del trattamento</strong>: diritto a
            certe condizioni di ottenere che i tuoi dati personali siano
            contrassegnati e conservati con l'obiettivo di limitarne il
            trattamento in futuro.
          </p>
          <p>
            <strong>Diritto di opposizione</strong>: diritto di opporti in
            qualsiasi momento, per motivi connessi alla sua situazione
            particolare, al trattamento dei dati personali che ti riguardano,
            qualora i dati personali siano trattati per finalità di marketing
            diretto o di profilazione commerciale.
          </p>
          <p>
            <strong>
              Diritto di non essere sottoposto a decisioni automatizzate,
              compresa la profilazione
            </strong>
            : diritto di non essere sottoposto a una decisione basata unicamente
            sul trattamento automatizzato, compresa la profilazione, se non hai
            prestato lo specifico consenso o non sia previsto dalla legge o da
            un contratto.
          </p>
        </div>
        <hr />
        <div>
          <h3 className="text-primary">
            Informativa sul trattamento dei dati personali a scopi marketing e
            profilazione (Regolamento Generale UE sulla protezione dei dati n.
            679/2016 – Art. 13)
          </h3>
          <p>
            Di seguito potrai trovare le principali informazioni fornite ai
            sensi dell’art. 13 del Regolamento Generale sulla protezione dei
            dati personali n. 679/2016 (“
            <strong>
              <abbr title="General Data Protection Regulation: Regolamento generale sulla protezione dei dati">
                GDPR
              </abbr>
            </strong>
            ”) sui trattamenti dei tuoi dati personali. Ti ricordiamo di
            prendere visione della <strong>Informativa estesa</strong> a questo
            specifico link:{" "}
            <a href="https://lifestarinsurance.com/privacy-policy/">
              https://lifestarinsurance.com/privacy-policy/
            </a>
          </p>
          <h4 className="text-primary">Chi tratta i miei dati personali?</h4>
          <p>
            <strong>Lifestar Insurance Plc</strong>, impresa assicurativa
            iscritta nel Registro delle imprese di Malta al numero C29086,
            Partita IVA: MT17570311, abilitata ad agire in Italia in regime di
            libera prestazione dei servizi (LPS) con iscrizione all’elenco delle
            Imprese LPS presso IVASS n al n [TODO: inserire numero IVASS].
          </p>
          <h4 className="text-primary">
            Come posso contattare LifeStar per esercitare i miei diritti o per
            ottenere informazioni?
          </h4>
          <p>
            Puoi contattare LifeStar Insurance presso la sede sita in
            Testaferrata Street, Ta’ Xbiex XBX 1403 – Malta - Telefono:{" "}
            <a href="tel:+35621342342">+356 21 342342</a> Email:{" "}
            <a href="mailto:info@lifestarinsurance.com">
              info@lifestarinsurance.com
            </a>{" "}
            [TODO: aggiornare link]
          </p>
          <h4 className="text-primary">
            Che tipo di dati personali che mi riguardano sono raccolti e
            trattati?
          </h4>
          <p>
            Ti richiediamo di fornire a LifeStar solo dati personali comuni come
            il tuo nome, cognome, genere, data di nascita, luogo di nascita,
            codice fiscale, luogo di residenza, numero di cellulare o e-mail.
            Non raccogliamo dati sensibili (per esempio: dati relativi alla tua
            salute) o di particolare natura.
          </p>
          <h4 className="text-primary">
            Per quali finalità sono raccolti e trattati i miei dati personali?
          </h4>
          <p>
            LifeStar tratta i tuoi dati personali a scopi marketing (es.
            inviarti promozioni e comunicazioni commerciali, etc) e di
            profilazione (per analizzare o prevedere aspetti riguardanti le tue
            preferenze personali, gli interessi, il comportamento, etc, la
            cosiddetta profilazione commerciale), ma solo se ci autorizzi dopo
            aver deciso liberamente di prestare il consenso specifico sia per le
            finalità di marketing che per quelle di profilazione.
          </p>
          <h4 className="text-primary">
            Su quale base giuridica si fondano i trattamenti dei miei dati
            personali?
          </h4>
          <p>
            Per perseguire le finalità di marketing e di profilazione la base di
            legittimità del trattamento svolto da LifeStar è rappresentata
            esclusivamente dal tuo consenso, specifico per ogni categoria di
            finalità perseguite. Quindi dovremo acquisire un tuo consenso per
            essere autorizzati a trattare i tuoi dati personali a scopi
            marketing e un consenso aggiuntivo e separato per trattare i tuoi
            dati a scopi di profilazione. Inoltre, per poter consentire a terzi
            destinatari dei tuoi dati personali di effettuare trattamenti per il
            perseguimento di loro scopi marketing o profilazione, dobbiamo
            richiederti altri due consensi aggiuntivi allo specifico trattamento
            rappresentato dalla comunicazione dei tuoi dati personali a terzi.
          </p>
          <h4 className="text-primary">
            Sono obbligato a dare il consenso al trattamento dei miei dati?
          </h4>
          <p>
            Ti richiediamo il consenso per i trattamenti marketing e per quelli
            di profilazione. Non sei assolutamente obbligato a prestare il
            consenso e nel caso tu decida di non autorizzare i trattamenti (o di
            revocare un consenso precedente) non subirai alcuna conseguenza per
            quanto riguarda rapporti negoziali, contrattuali o di altro tipo in
            corso con noi.
          </p>
          <h4 className="text-primary">
            A chi vengono comunicati i miei dati personali?
          </h4>
          <p>
            I tuoi dati personali trattati a scopi marketing e profilazione non
            vengono comunicati a terzi soggetti. I tuoi dati personali non sono
            oggetto di diffusione.
          </p>
          <h4 className="text-primary">
            I miei dati personali sono oggetto di trattamento automatizzato,
            inclusa la profilazione?
          </h4>
          <p>
            Si, ma esclusivamente se hai prestato uno o più consensi specifici,
            liberi e revocabili. LifeStar, procede a questi trattamenti quando
            ad esempio crea in via automatizzata profili derivanti dalla analisi
            di beni e servizi che hai acquistato, dal volume delle spese che hai
            effettuato, dalle modalità di utilizzo di nostre soluzioni
            tecnologiche come app o siti o piattaforme web, e da altri
            parametri, che ad esempio possiamo raccogliere anche mediante cookie
            o altre tecnologie di tracciamento o identificatori on line e da cui
            poi realizziamo campagne di marketing personalizzate o pubblicità
            mirata.
          </p>
          <h4 className="text-primary">
            Per quanto vengono conservati i miei dati personali?
          </h4>
          <p>
            LifeStar conserverà i dati per un periodo non inferiore a 24 mesi e
            comunque fino a che non deciderai di revocare i tuoi consensi. A tal
            fine, ti ricorderemo periodicamente mediante specifiche informative
            che hai prestato consensi validi per scopi marketing e profilazione
            e che puoi revocarli. Se deciderai di mantenere la validità dei
            consensi prestati e di non revocarli, continueremo a basarci su tali
            consensi e proseguiremo i trattamenti a scopi marketing e
            profilazione.
          </p>
          <h4 className="text-primary">
            I miei dati personali sono trasferiti al di fuori dello Spazio
            economico Europeo?
          </h4>
          <p>
            No. I tuoi dati personali – anche residenti in cloud o su server o
            database dei nostri fornitori – rimangono all’interno del territorio
            dello Spazio Economico Europeo (UE+ Norvegia, Islanda e
            Liechtenstein).
          </p>
          <h4 className="text-primary">
            Quali diritti o forme di tutela e di ricorso posso esercitare?
          </h4>
          <p>
            Hai diritto a proporre – in Italia - un reclamo al Garante per la
            protezione dei dati personali, se Autorità competente, seguendo le
            procedure e le indicazioni pubblicate sul sito web ufficiale
            dell’Autorità su{" "}
            <a href="https://www.garanteprivacy.it/">www.garanteprivacy.it</a>.
          </p>
          <p>
            Puoi esercitare, del tutto gratuitamente, scrivendo alla email:
            <a href="mailto:gdpr@lifestarinsurance.com">
              gdpr@lifestarinsurance.com
            </a>
            , i seguenti diritti:
          </p>
          <p>
            <strong>Diritto alla portabilità</strong> che ti consente di
            ricevere i dati personali forniti a LifeStar in un formato
            strutturato, di uso comune e leggibile da dispositivo automatico, e
            - a certe condizioni - di trasmetterli a un altro titolare del
            trattamento senza impedimenti.
          </p>
          <p>
            <strong>Diritto di accesso</strong> (ai soli propri dati personali):
            diritto di ottenere la conferma che sia o meno in corso un
            trattamento di dati personali che ti riguardano e di ottenere
            l'accesso ai dati personali.
          </p>
          <p>
            <strong>Diritto di rettifica e integrazione</strong>: diritto di
            ottenere la rettifica dei dati personali inesatti o l'integrazione
            dei dati personali incompleti.
          </p>
          <p>
            <strong>Diritto alla cancellazione</strong>: diritto di ottenere la
            cancellazione dei dati personali che ti riguardano, a certe
            condizioni che puoi esaminare nella Informativa estesa.
          </p>
          <p>
            <strong>Diritto alla limitazione del trattamento</strong>: diritto a
            certe condizioni di ottenere che i tuoi dati personali siano
            contrassegnati e conservati con l'obiettivo di limitarne il
            trattamento in futuro.
          </p>
          <p>
            <strong>Diritto di opposizione</strong>: diritto di opporti in
            qualsiasi momento, per motivi connessi alla sua situazione
            particolare, al trattamento dei dati personali che ti riguardano,
            qualora i dati personali siano trattati per finalità di marketing
            diretto o di profilazione commerciale.
          </p>
          <p>
            <strong>
              Diritto di non essere sottoposto a decisioni automatizzate,
              compresa la profilazione
            </strong>
            : diritto di non essere sottoposto a una decisione basata unicamente
            sul trattamento automatizzato, compresa la profilazione, se non hai
            prestato lo specifico consenso o non sia previsto dalla legge o da
            un contratto.
          </p>
        </div>
        <hr />
        <Form
          id="company-privacy-form"
          onSubmit={async (values) => {
            invariant(lip?.id, "lipId is required");
            const updatedContractor = await saveCompanyPrivacyConsent(
              {...values, options: consentOptions},
              lip.id,
            );

            if (updatedContractor.status === "failed") {
              throw {
                root: {
                  type: "server",
                  message: updatedContractor.message,
                },
              };
            }

            closeModal();
          }}
          formMethods={formMethods}
        >
          <h3 className="text-primary">Consensi</h3>
          <FormGroup controlId="flags" className="mb-3">
            <CheckGroup
              type="checkbox"
              options={consentOptions}
              validationStyle={false}
              disabled={
                !!lip?.eSigns?.identificazione || !!lip?.eSigns?.polizza
              }
            />
          </FormGroup>
          <FieldError name="root" as={Alert} variant="danger" />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button
          type="submit"
          form="company-privacy-form"
          disabled={formMethods.formState.isSubmitting}
        >
          <FontAwesomeIcon
            icon={
              formMethods.formState.isSubmitting ? faSpinner : faClipboardCheck
            }
            className={cns(
              "me-2",
              formMethods.formState.isSubmitting && "fa-spin",
            )}
          />
          Salva consensi
        </Button>
      </ModalFooter>
    </>
  );
}
