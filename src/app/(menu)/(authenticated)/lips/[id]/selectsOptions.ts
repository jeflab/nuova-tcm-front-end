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
