export const complementaryCoverages = [
  {
    key: "accidentalDeath",
    label: "Morte da infortunio",
    valueLabel: "Capitale assicurato",
    maxDuration: 30,
    maxAge: 85,
  },
  {
    key: "trafficAccidentalDeath",
    label: "Morte per incidente stradale",
    valueLabel: "Capitale assicurato",
    maxDuration: 30,
    maxAge: 85,
  },
  {
    key: "exemptionFromPaying",
    label: "Esenzione dal pagamento dei premi",
    valueLabel: "",
    maxDuration: 30,
    maxAge: 65,
  },
  {
    key: "tpi",
    label: "Invalidità permanente da infortunio o malattia",
    valueLabel: "Capitale assicurato",
    maxDuration: 10,
    maxAge: 65,
  },
  {
    key: "cancer",
    label: "Cancro",
    valueLabel: "Capitale assicurato",
    maxDuration: 10,
    maxAge: 85,
  },
  {
    key: "tpd",
    label: "Perdita totale di autosufficienza",
    valueLabel: "Rendita mensile",
    maxDuration: 30,
    maxAge: 85,
  },
] as const;
