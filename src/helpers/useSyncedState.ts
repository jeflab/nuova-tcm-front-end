import {useState} from "react";

/**
 * Stato locale di un campo che deve restare reattivo mentre l'utente lo
 * modifica (senza attendere il giro attraverso la URL), ma riallinearsi quando
 * il valore gli arriva cambiato da fuori: reset filtri, tasto indietro del
 * browser, URL condivisa.
 *
 * Implementa il pattern React "adjusting some state when a prop changes": il
 * riallineamento avviene durante il render, quindi è sincrono e non richiede un
 * effect — nessun frame intermedio in cui il campo mostra ancora il valore
 * vecchio.
 */
export function useSyncedState<T>(externalValue: T) {
  const [value, setValue] = useState(externalValue);
  const [previousExternalValue, setPreviousExternalValue] =
    useState(externalValue);

  if (externalValue !== previousExternalValue) {
    setPreviousExternalValue(externalValue);
    setValue(externalValue);
  }

  return [value, setValue] as const;
}
