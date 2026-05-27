# Changelog

## 2.9.0 (2026-05-27)

#### Added:

- Aggiunto zoom alle immagini dei documenti
- Aggiunto SpeedInsights per monitorare le performance del sito

#### Changed:

- Modificato testo dei vantaggi detraibilità fiscale rata mensile

#### Fixed:

- Corretto bug che nascondeva il testo di aiuto per il campo "caso morte"

### 2.8.2 (2026-04-15)

#### Fixed:

- Corretto davvero il bug che comprimeva due volte la risposta del server in test-api che persisteva

### 2.8.1 (2026-04-15)

#### Fixed:

- Corretto bug che comprimeva due volte la risposta del server in test-api

## 2.8.0 (2026-04-01)

#### Added:

- Aggiunto bonus parametrizzato per ogni lip con default a 100-75-50
- Creato bonus di default

## 2.7.0 (2026-01-14)

#### Added:

- Aumentato il premio massimo per TCM a 1 000 000 €
- Aggiunto controllo premio massimo per TCM in base al lavoro, età e reddito

### v2.6.1 (2025-12-12)

#### Fixed:

- Aggiornato nextjs alla versione 15.1.4 per correggere vulnerabilità di sicurezza

## v2.6.0 (2025-11-10)

#### Added:

- Aggiunto il nuovo metodo di pagamento Mollie con creazione link e visualizzazione stato abbonamento

## v2.5.0 (2025-10-01)

#### Added:

- Aggiunto loader per il download dei documenti
- Aggiunto nuovo stato "Inception" per le lip

#### Changed:

- Aggiornato node alla versione 22.17
- Aggiornato Zod alla versione 4
- Aggiunto loader dopo il login
- Migliorate le intestazioni delle tabelle

## v2.4.0 (2025-07-21)

#### Added:

- Aggiunta gestione vendita polizze a distanza

## v2.3.0 (2025-05-30)

#### Added:

- Gestione versione del quotatore durante il preventivo
- Aggiunta icona polizza in stato decesso
- Aggiunto inception e loadedPremium nella lip

## v2.2.0 (2025-05-12)

#### Added:

- Aggiunta gestione MUP con supporto ai vecchi file per le vecchie polizze

#### Fixed:

- Corretto bug che mostrava un numero di hash sbagliato nell'html

### v2.1.7 (2025-04-28)

#### Added:

- Aggiunti nuovi stati per la gestione delle polizze lato admin
- Aggiunto campo situazione professionale per l'assicurato

#### Fixed:

- Corretto bug che calcolava la durata delle polizza su contraente e non su assicurato

### v2.1.6 (2025-04-14)

#### Added:

- Aggiunta tabella per documenti di rendicontazione (DUR)

#### Changed:

- Migliorata integrazione di Sentry
- Aggiornato il sistema di gestione documenti

#### Fixed:

- Sistemato bug cursore in CardCollapsable

### v2.1.5 (2025-03-02)

#### Fixed:

- Corretta età massima per il contraente === assicurato

### v2.1.4 (2025-03-12)

#### Added:

- Aggiunto blocco iban "proibiti", per ora c'è quello della compagnia

#### Changed:

- Aggiunta ripetizione email e telefono anche per il contraente
- Aggiunto log delle date per debbugare errore su sentry

#### Removed:

- Rimosso alert con bottone per scaricamento questionari aggiuntivi underwriting

#### Fixed:

- Corretto colore icona checkmark pagamento ClickPay

### v2.1.3 (2025-03-05)

#### Changed:

- Modificata sede legale a Via Felice Casati

### v2.1.2 (2025-02-18)

#### fixed:

- Aumentata dimensione massima server actions a 8mb

### v2.1.1 (2025-02-18)

#### fixed:

- Corretto bug controllo età contraente se != assicurato

## v2.1.0 (2025-02-18)

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

# v2.0.0 (2025-02-03)

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
