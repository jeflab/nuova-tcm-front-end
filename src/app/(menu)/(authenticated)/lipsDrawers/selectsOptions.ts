import {toCurrency} from "@/helpers/numbers";

// Generic

export const yesNoOptions = [
  {value: "yes", label: "Si"},
  {value: "no", label: "No"},
] as const;
export type YesNoAnswer = (typeof yesNoOptions)[number]["value"];

export const genderOptions = [
  {label: "Maschio", value: "male"},
  {label: "Femmina", value: "female"},
] as const;
export type Gender = (typeof genderOptions)[number]["value"];

export const relationshipOptions = [
  {label: "Parente", value: "relative"},
  {label: "Affinità", value: "affinity"},
  {label: "Coniuge", value: "marriage"},
  {label: "Unione civile", value: "civil_union"},
  {label: "Convivenza di fatto", value: "de_facto"},
  {label: "Altro", value: "other"},
] as const;
export type Relationship = (typeof relationshipOptions)[number]["value"];

// {label: "Il Contraente è diverso dall'Assicurato ed è una persona giuridica", value: "corporate-insured"},
export const lipTypeOptions = [
  {label: "Il Contraente è uguale all'Assicurato", value: "self-insured"},
  {
    label: "Il Contraente è diverso dall'Assicurato",
    value: "third-party-insured",
  },
] as const;
export type LipType = (typeof lipTypeOptions)[number]["value"];

// Contractor data

export const publicOfficesOptions = [
  {label: "No", value: "no"},
  {label: "Politico/istituzionale", value: "political"},
  {label: "Societario", value: "corporate"},
  {
    label:
      "Associazioni o fondazioni che beneficiano o gestiscono erogazioni di fondi pubblici",
    value: "associations",
  },
] as const;
export type PublicOffices = (typeof publicOfficesOptions)[number]["value"];

export const jobPositionOptions = [
  {label: "Dipendente", value: "employee"},
  {label: "Dirigente", value: "manager"},
  {label: "Imprenditore", value: "entrepreneur"},
  {label: "Libero professionista", value: "freelancer"},
  {label: "Lavoratore autonomo", value: "selfEmployed"},
  {label: "Non occupato", value: "unemployed"},
  {label: "Casalinga", value: "homemaker"},
  {label: "Pensionato", value: "retired"},
  {label: "Studente", value: "student"},
  {label: "Altro", value: "other"},
] as const;
export type JobPosition = (typeof jobPositionOptions)[number]["value"];

export const tAECodeOptions = [
  {label: "Coltivazione prodotti agricoli e olio", value: "10"},
  {label: "Produzione vino", value: "12"},
  {label: "Allevamento, caccia, silvicoltura e pesca", value: "14"},
  {
    label:
      "Produzione prodotti energetici (carbone, petrolio, energia elettrica, gas, raccolta, depurazione e distribuzione acqua)",
    value: "110",
  },
  {label: "Produzione metalli", value: "210"},
  {
    label:
      "Produzione materiali da costruzione, vetro, ceramica, produzione, estrazione e ricerca di sali",
    value: "230",
  },
  {label: "Edilizia, opere pubbliche e demolizione immobili", value: "500"},
  {
    label:
      "Produzione prodotti chimici, farmaceutici, vernici, fibre artificiali e sintetiche",
    value: "250",
  },
  {label: "Produzione macchine agricole e industriali", value: "320"},
  {
    label:
      "Produzione macchine per ufficio, elaboratori, strumenti di precisione, ottica, orologi",
    value: "330",
  },
  {label: "Produzione materiale elettrico", value: "340"},
  {label: "Produzione mezzi di trasporto", value: "350"},
  {
    label: "Produzione di prodotti alimentari e prodotti a base di tabacco",
    value: "410",
  },
  {label: "Prodotti tessili, pelle, pellicce, abbigliamento", value: "430"},
  {label: "Produzione tappeti, tappezzerie", value: "440"},
  {label: "Produzione calzature", value: "450"},
  {label: "Produzione biancheria per la casa e arredamento", value: "460"},
  {
    label: "Riparazione calzature, articoli cuoio, elettrodomestici",
    value: "672",
  },
  {
    label: "Carpenteria e costruzioni in legno, lavori in legno per edilizia",
    value: "463",
  },
  {label: "Produzione mobili in legno e giunco, materassi", value: "467"},
  {label: "Produzione, trasformazione carta e cartone", value: "470"},
  {label: "Produzione legno, sughero", value: "490"},
  {label: "Prodotti stampa ed editoria", value: "473"},
  {label: "Produzione prodotti in gomma, plastica e pneumatici", value: "480"},
  {label: "Produzione gioielli e oreficeria", value: "491"},
  {label: "Produzione strumenti musicali", value: "492"},
  {label: "Prodotti cinematografia e fotografia", value: "493"},
  {label: "Produzione giocattoli e articoli sportivi", value: "494"},
  {label: "Produzione penne, timbri e prodotti di cancelleria", value: "495"},
  {label: "Riparazione auto, moto e biciclette", value: "671"},
  {
    label: "Commercio combustibili, minerali, prodotti chimici e carburanti",
    value: "600",
  },
  {label: "Commercio materie prime agricole, animali vivi", value: "611"},
  {label: "Commercio legname e materiale da costruzione", value: "613"},
  {label: "Commercio macchine, attrezzature, veicoli", value: "614"},
  {
    label: "Commercio mobili, elettrodomestici, tv, casalinghi e ferramenta",
    value: "615",
  },
  {label: "Commercio prodotti tessili, abbigliamento, calzature", value: "616"},
  {label: "Commercio prodotti alimentari, bevande, tabacco", value: "617"},
  {label: "Commercio prodotti farmaceutici, cosmetici, profumi", value: "618"},
  {label: "Commercio altri prodotti non alimentari", value: "619"},
  {label: "Commercio materiale di recupero", value: "620"},
  {label: "Commercio orologi, gioielleria, argenteria", value: "621"},
  {
    label:
      "Servizi degli intermediari del commercio (agenti, rappresentanti e agenzie di mediazione del commercio)",
    value: "630",
  },
  {label: "Commercio antiquariato e oggetti d’arte", value: "649"},
  {label: "Commercio libri, giornali, cancelleria", value: "653"},
  {label: "Commercio armi e munizioni", value: "654"},
  {label: "Alberghi e pubblici esercizi", value: "660"},
  {label: "Servizi ferroviari, tram, metro, autobus di linea", value: "710"},
  {label: "Servizi trasporti di persone e merci", value: "722"},
  {label: "Servizi per oleodotto e gasdotto", value: "724"},
  {label: "Servizi di custodia valori", value: "731"},
  {
    label: "Autotrasportatori di contante, titoli e valori c/terzi",
    value: "732",
  },
  {label: "Servizi trasporti marittimi, cabotaggio, aerei", value: "740"},
  {
    label:
      "Servizi connessi ai trasporti (gestione porti, autostrade, stazioni di servizio, controllo e pesatura merci)",
    value: "760",
  },
  {label: "Agenzie viaggio e intermediari dei trasporti", value: "771"},
  {label: "Servizi di custodia e deposito", value: "773"},
  {label: "Servizi delle comunicazioni", value: "790"},
  {
    label:
      "Servizi finanziari e assicurativi (consulenti finanziari e assicurativi, promotori finanziari, agenti in attività finanziaria, broker, mediatori assicurativi, mediatori creditizi, agenti assicurativi, ecc.)",
    value: "830",
  },
  {
    label:
      "Servizi di consulenza tributaria, del lavoro, direzionale, organizzativa, tecnica, gestionale (consulenti del lavoro, consulenti tributari, consulenti direzionali/ tecnici/ organizzativi/gestionali)",
    value: "831",
  },
  {label: "Servizi di pubblicità", value: "833"},
  {label: "Servizi di affari immobiliari (agenti immobiliari)", value: "834"},
  {label: "Servizi di noleggio e locazione", value: "840"},
  {label: "Servizi disinfezione, pulizia e nettezza urbana", value: "920"},
  {label: "Servizi insegnamento", value: "930"},
  {label: "Servizi di ricerca e sviluppo", value: "940"},
  {label: "Servizi sanitari destinabili alla vendita", value: "950"},
  {
    label:
      "Servizi istituzioni sociali, delle associazioni professionali e delle organizzazioni economiche e sindacali",
    value: "960",
  },
  {
    label: "Servizi ricreativi e culturali, circhi, luna park e sale da ballo",
    value: "970",
  },
  {label: "Sale corse, case da gioco", value: "972"},
  {label: "Servizi di lavanderia e tintoria", value: "981"},
  {label: "Servizi parrucchieri barbieri e istituti di bellezza", value: "982"},
  {label: "Servizi studi fotografici", value: "983"},
  {
    label:
      "Altri servizi personali non altrove classificati (servizi delle pompe funebri, di cremazione, di agenzie matrimoniali, astrologia, ecc.)",
    value: "984",
  },
  {
    label:
      "Professioni amministrativo/contabili (commercialisti, ragionieri, periti commerciali, amministratori di condominio, revisori, ecc.)",
    value: "832",
  },
  {label: "Professioni giuridico/legali (avvocati, notai, ecc.)", value: "990"},
  {
    label:
      "Professioni tecnico/scientifiche (architetti, ingegneri, chimici, biologi, agronomi, periti, geometri, ecc.)",
    value: "991",
  },
  {label: "Professioni in discipline religiose e teologiche", value: "992"},
  {
    label:
      "Altri agenti, mediatori e consulenti non ancora classificati (es. agenti sportivi)",
    value: "993",
  },
  {label: "Altra attività", value: "999"},
] as const;
export type TAECode = (typeof tAECodeOptions)[number]["value"];

export const fundSourceOptions = [
  {
    label: "Reddito da lavoro (dipendente o autonomo)",
    value: "work",
  },
  {label: "Reddito di impresa", value: "business_income"},
  {label: "Vendita di beni immobili", value: "real_estate"},
  {label: "Vendita di beni mobili", value: "movable_goods"},
  {
    label: "Vendita della società / azioni societarie",
    value: "company_shares",
  },
  {
    label: "Rientro capitali dall’estero / scudo fiscale",
    value: "capital_return",
  },
  {label: "Eredità / donazioni", value: "inheritance_donations"},
  {label: "Vincita", value: "winning"},
  {label: "Smobilizzo valori mobiliari", value: "securities_liquidation"},
  {label: "Risparmio", value: "savings"},
  {label: "Altro (specificare)", value: "other"},
] as const;
export type FundSource = (typeof fundSourceOptions)[number]["value"];

// Insured data
export const insuredRelationshipOptions = [
  {label: "Parentela", value: "kinship"},
  {label: "Lavoro/Affari", value: "work_business"},
  {label: "Affinità", value: "affinity"},
  {label: "Coniugio", value: "marriage"},
  {label: "Convivenza di fatto/Unione civile", value: "de_facto_civil_union"},
  {label: "Relazione amicale", value: "friendly_relationship"},
  {label: "Beneficenza/Liberalità", value: "charity_donation"},
  {label: "Altro", value: "other"},
] as const;
export type InsuredRelationship =
  (typeof insuredRelationshipOptions)[number]["value"];

// Identification

export const idTypeOptions = [
  {label: "Passaporto", value: "passport"},
  {label: "Carta d'identità", value: "identity_card"},
  {label: "Patente", value: "driving_license"},
  // {label: "Altro", value: "other"},
] as const;
export type IdType = (typeof idTypeOptions)[number]["value"];

// DEN

export const educationOptions = [
  {label: "Nessun titolo di studio", value: "no_degree"},
  {
    label: "Licenza scuola primaria/media",
    value: "primary_middle_school_license",
  },
  {
    label: "Diploma di scuola superiore",
    value: "high_school_diploma",
  },
  {label: "Laurea", value: "degree"},
  {
    label:
      "Laurea o specializzazione post-universitaria in campo giuridico, economico o finanziario",
    value: "degree_specialization",
  },
  {label: "Altro (specificare)", value: "other"},
] as const;
export type EducationOptions = (typeof educationOptions)[number]["value"];

export const familyOptions = [
  {label: "Nessuno", value: "0"},
  {label: "1", value: "1"},
  {label: "2", value: "2"},
  {label: "3", value: "3"},
  {label: "4", value: "4"},
  {label: "5 o più", value: "5+"},
] as const;
export type FamilyOptions = (typeof familyOptions)[number]["value"];

export const dependentFamilyMembersOptions = [
  {label: "Nessuno", value: "0"},
  {label: "1", value: "1"},
  {label: "2", value: "2"},
  {label: "3", value: "3"},
  {label: "4", value: "4"},
  {label: "5 o più", value: "5+"},
] as const;
export type DependentFamilyMembersOptions =
  (typeof dependentFamilyMembersOptions)[number]["value"];

export const needsToMeetOptions = [
  {
    label: "Risparmio e conservazione del patrimonio",
    value: "savings_and_wealth_preservation",
  },
  {
    label: "Investimento",
    value: "investment",
  },
  {
    label:
      "Protezione assicurativa della persona (morte, invalidità, malattie gravi)",
    value: "personal_insurance_protection",
  },
  {
    label: "Previdenza/pensione complementare",
    value: "supplementary_pension",
  },
  {
    label: "Altro (specificare)",
    value: "other",
  },
] as const;
export type NeedsToMeetOptions = (typeof needsToMeetOptions)[number]["value"];

export const economicConditionOptions = [
  {label: "In crescita", value: "growing"},
  {label: "Stazionaria", value: "stationary"},
  {label: "In diminuzione", value: "decreasing"},
] as const;
export type EconomicConditionOptions =
  (typeof economicConditionOptions)[number]["value"];

export const expectationsOptions = [
  {
    label:
      "Proteggere la mia abitazione e i miei beni personali/familiari di valore",
    value: "home_protection",
  },
  {
    label:
      "Prevedere un capitale assicurato ai miei eredi (o comunque a persone a me care), che intendo proteggere contro il rischio di decesso, e/o proteggermi dal rischio di infortunio e/o malattia",
    value: "capital_and_personal_protection",
  },
  {
    label: "Investimento unitamente a una protezione del capitale",
    value: "investment_with_capital_protection",
  },
  {
    label: "Investimento",
    value: "investment",
  },
] as const;
export type ExpectationsOptions = (typeof expectationsOptions)[number]["value"];

export const durationOptions = [
  {label: "Limitato (un anno)", value: "1_year"},
  {label: "Breve (da uno a cinque anni)", value: "short_term"},
  {label: "Lungo (maggiore di cinque anni)", value: "long_term"},
] as const;
export type DurationOptions = (typeof durationOptions)[number]["value"];

// Beneficiaries

export const nominationOptions = [
  {
    label:
      "Il Contraente designa come Beneficiari gli eredi testamentari o, in assenza di testamento, gli eredi legittimi dell'Assicurato in parti uguali fra loro",
    value: "heirs",
  },
  {
    label: "Il Contraente designa i seguenti Beneficiari",
    value: "beneficiaries",
  },
] as const;
export type Nomination = (typeof nominationOptions)[number]["value"];

// Payments
export const paymentMethodsSimpleOptions = [
  {
    label: "Pagamento mensile",
    value: "monthly",
  },
  {
    label: "Pagamento annuale",
    value: "annual",
  },
  {
    label: "Pagamento anticipato di 3 anni",
    value: "3yearsAdvance",
  },
  {
    label: "Pagamento anticipato di 5 anni",
    value: "5yearsAdvance",
  },
] as const;
export type PaymentMethodsSimple =
  (typeof paymentMethodsSimpleOptions)[number]["value"];

export function paymentMethodsOptions(premium: number) {
  return [
    {
      label: `Pagamento mensile di ${toCurrency(premium / 12)} con anticipo di 3 mesi (${toCurrency((premium / 12) * 3)})`,
      value: "monthly",
      // disabled: premium < 480, Da riattivare dopo il rilascio del 3 febb
    },
    {
      label: `Pagamento annuale di ${toCurrency(premium)}`,
      value: "annual",
    },
    {
      label: `Pagamento anticipato di 3 anni (${toCurrency(premium * 3)}) e
    a seguire pagamento mensile di ${toCurrency(premium / 12)}`,
      value: "3yearsAdvance",
    },
    {
      label: `Pagamento anticipato di 5 anni (${toCurrency(premium * 5)}) e
    a seguire pagamento mensile di ${toCurrency(premium / 12)}`,
      value: "5yearsAdvance",
    },
  ] as const;
}
export type PaymentMethods = ReturnType<
  typeof paymentMethodsOptions
>[number]["value"];

// Company privacy

export const consentOptions = [
  {
    label:
      "Presto il consenso specifico e facoltativo al trattamento dei miei dati personali per le Finalità di Marketing come illustrato nell’Informativa.",
    value: "marketing_consent",
  },
  {
    label:
      "Presto il consenso specifico e facoltativo al trattamento dei miei dati personali per le Finalità di Profilazione come illustrato nell’Informativa.",
    value: "profiling_consent",
  },
  {
    label:
      "Presto il consenso aggiuntivo e facoltativo alla comunicazione dei miei dati personali ai terzi individuati nell’Informativa per consentire a questi di svolgere il Trattamento per le Finalità di Marketing come illustrato nell’Informativa.",
    value: "third_party_marketing_consent",
  },
  {
    label:
      "Presto il consenso aggiuntivo e facoltativo alla comunicazione dei miei dati personali ai terzi individuati nell’Informativa per consentire a questi di svolgere il Trattamento per le Finalità di Profilazione come illustrato nell’Informativa.",
    value: "third_party_profiling_consent",
  },
] as const;
export type ConsentOptions = (typeof consentOptions)[number]["value"];

// Health questionnaire

export const sportRiskIndexOptions = [
  {label: "Dilettante", value: "amateur"},
  {label: "Semi-professionista", value: "semi_professional"},
  {label: "Professionista", value: "professional"},
] as const;
export type SportRiskIndex = (typeof sportRiskIndexOptions)[number]["value"];
