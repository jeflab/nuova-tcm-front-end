# Changelog

### v2.1.2

#### Fix:

- Aumentata dimensione massima server actions a 8mb

### v2.1.1

#### Fix:

- Corretto bug controllo età contraente se != assicurato

## v2.1.0

#### Added:

- Aggiunto pagamento tramite carta di credito e blocco clicPay
- Aggiornato framework NextJs alla versione 15
- Aggiornato Eslint alla versione 9
- Aggiunto React Compiler
- Aggiunte conferma email e phone

#### Changed:

- Migliorata gestione tags per le query nei server components
- Migliorata gestione auth tramite utilizzo di middleware
- Migliorata validazione del codice fiscale nel censimento dell'Assicurato
- Aggiunto nuovi stati per invio in compagnia e rescissione nel componente lip
- Migliorata grafica cassetti chiusi/aperti
- Aumentata età a 75 ma con underwriting

#### Fixed:

- Risolto bug che impediva al onChange degli input di venir eseguito quando c'era anche la normalizzazione

# v2.0.0

#### Added:

- Aggiunta la possibilità di creare proposte di polizza con Contraente != Assicurato

#### Changed:

- Ora lo script dev controlla la versione di node richiesta
- Nuovo capitale massimo per la coperture TPI
- Bloccata copertura di blocco dei pagamenti se Contraente != Assicurato
- Aggiunta icona per distinguere le polizze con Contraente != Assicurato

#### Fixed:

- Ora il menu laterale scorre se troppo alto
- Aggiunto urlencode al corpo della mail di assistenza
- Migliorato UI per i cassetti chiusi
- Ora il campo CF accetta anche le omocodie

## v1.2.0 (2024-11-20)

#### Added:

- Aggiunto pagina preventivo pubblica

#### Fixed:

- Rimosso redirect dopo login

### v1.1.2 (2024-11-12)

#### Added:

- Aggiunto campo libero per dipendente
- Aggiunto campo libero anche per dirigente
- Aggiunta seconda nazionalità per contraente
- Aggiunto controllo sul risparmio vs reddito netto

#### Changed

- Migliorato supporto agli errori delle server actions
- Aggiustata chiamata a identification per gestire meglio gli errori

##### Fixed

- Corretto problema lunghezza etichette menu laterale lip

### v1.1.1 (2024-10-30)

#### Added:

- Aggiunta pagina di manutenzione

## v1.1.0 (2024-10-16)

#### Added:

- Aggiunto react query per le chiamate API lato client
- Link assistenza tecnica in login
- Aggiunto alert per IMC nel form del questionario sanitario

#### Fixed:

- Corretto aggiustamento del premio divisibile per 12
- Footer collassa a md ora
- Sistemato falso errore al redirect della login

### v1.0.8 (2024-09-25)

#### Added:

- Aggiunto cassetto per il certificato

### v1.0.7 (2024-09-25)

#### Added:

- Aggiunto polyfill per Array.prototype.toSorted

#### Changed:

- Modificato salvataggio cittadinanza da alpha3 a alpha2

### v1.0.6 (2024-09-23)

#### Added:

- Aggiunta email per richieste di assistenza tecnica

### v1.0.5 (2024-09-18)

#### Changed:

- Modificata mail per l'underwriting

### v1.0.4 (2024-09-11)

#### Changed:

- Eliminato codice TAE = 999
- Reso obbligatorio codice TAE solo per alcune posizioni lavorative, disabilitato per gli altri
- Modificato rapporto premio/reddito minimo al 12,5%

### v1.0.3 (2024-09-09)

#### Fixed:

- Corretto errore stato cassetto documenti quando la lip è in underwriting

#### Changed:

- Migliorato lo script di validazione codice
- Lo stato "Esito underwriting positivo" è ora in primary
- Modificato l'aspect ratio delle immagini dei documenti

### v1.0.2 (2024-09-04)

#### Fixed:

- Modificato il testo dei link alle pagine di login dopo reset password

### v1.0.1 (2024-08-30)

#### Fixed:

- Corretto IBAN Brightlife
- Corretto controllo sull'univocità del numero di telefono e dell'email

# v1.0.0 (2024-08-30)

Release iniziale
