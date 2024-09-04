# Smart Broker Space

## Front-end

[Back-end](https://github.com/jeflab/nuova-tcm-back-end)

### Installation

Una volta clonato il progetto, copiare e rinominare il file `.env.example` in `.env` e configurare le variabili d'ambiente.

| --Variable--           | --Descrizione--                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| SENTRY_AUTH_TOKEN      | Token di autenticazione per Sentry. Lo ricavi dalla pagine del progetto di sentry                                                               |
| NEXT_PUBLIC_BE_URL     | URL del back-end                                                                                                                                |
| NEXT_PUBLIC_API_URL    | URL dell'API del back-end                                                                                                                       |
| FETCH_DEBUG            | Abilita la modalità debug per le chiamate fetch di nextjs                                                                                       |
| NEXT_PUBLIC_SENTRY_DSN | DSN di Sentry. Lo ricavi dalla pagine del progetto di sentry. Lasciarlo vuoto in locale in modo da non loggare le eccezioni durante lo sviluppo |
| IMAGE_REMOTE_PATTERN   | Urla abilitati per il caricamento delle immagini.                                                                                               |

Ora sei pronto ad avviare il progetto. Esegui il comando:

```bash
npm run dev
```

Questo comando provvederà a installare le dipendenze e avviare il server di sviluppo.

### Comandi utili

#### Validazione del codice

Per validare il codice, esegui il comando:

```bash
npm run validate
```

Questo comando provvederà a validare i tipi con typescript, la formattazione con prettier e il codice con eslint. Provvede inotre a fare una build del progetto per controllare che sia tutto a posto.

#### Update

Per aggiornare le dipendenze del progetto, esegui il comando:

```bash
npm run u
```

Questo comando provvederà a aggiornare le dipendenze del progetto ed esegue una validazione per controllare che le nuove dipendenze non abbiano rotto niente.

#### Analisi del bundle

Per analizzare il bundle del progetto, esegui il comando:

```bash
npm run analyze
```

Questo comando provvederà a creare una build di produzione e analizzare il bundle con [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer).

### Build

Per creare una build di produzione e testare il progetto in produzione in locale, esegui il comando:

```bash
npm run bs
```

Questo comando provvederà a creare una build di produzione e avviare un server locale alla porta 3000.

### Deploy

Per il deploy del progetto si usa [Vercel](https://vercel.com/).
Ogni branch ha un deploy automatico, raggiungibile all'indirizzi temporaneo disponibile sulla pagina del progetto.
Abbiamo poi due progetti configurati con dei domini fissi.

Per creare una nuova release del progetto, si usa git flow. Creiamo una nuova release con il comando:

```bash
git flow release start <versione>
# Per convenzione inserire la v prima della versione, es. v1.0.0
```

Una volta aggiornato il cangelog, aggiornata la versione nel package.json e package-lock.json, fatto il commit, possiamo concludere la release con il comando:

```bash
git flow release finish <versione> -m "🔖 Release"
```

Questo comando provvederà a fare il merge della release sul branch develop e main e a creare un tag con la versione. A questo punto possiamo fare il push dei branch che vogliamo deployare.

```bash
# Push di tutti i branch
git push --all
# Push di develop
git push origin develop
# Push dei tag
git push --tags

# Push in produzione
git push prod main
```

#### Sviluppo

Il progetto di [sviluppo](https://vercel.com/jeflab/nuova-tcm-front-end) è configurato per fare il deploy automatico dei branch develop e main sulla repository [jeflab](https://github.com/jeflab/nuova-tcm-front-end.git) che saranno disponibili agli indirizzi https://dev.smartbroker.space (dietro autenticazione Vercel) e http://stage.smartbroker.space.

#### Produzione

Il progetto di [produzione](https://vercel.com/it-dvisions-projects/piattaforma-tcm-production) è configurato per fare il deploy automatico del branch main sulla repository [akomiit](https://github.com/akomiit/piattaforma-tcm-production) che sarà disponibile all'indirizzo https://smartbroker.space.
