export interface BonusTier {
  minDuration: number;
  percentage: number;
  label: string;
  amountLabel: string;
}

export interface BonusDetraction {
  percentage: number;
  maxAmount: number;
}

export interface BonusConfig {
  bonuses: BonusTier[];
  detraction: BonusDetraction;
}

export const defaultBonusConfig: BonusConfig = {
  bonuses: [
    {
      minDuration: 30,
      percentage: 85,
      label: "Bonus a scadenza",
      amountLabel: "Importo",
    },
    {
      minDuration: 25,
      percentage: 65,
      label: "Bonus dal 25° al 29° anno",
      amountLabel: "Importo minimo garantito",
    },
    {
      minDuration: 20,
      percentage: 45,
      label: "Bonus dal 20° al 24° anno",
      amountLabel: "Importo minimo garantito",
    },
  ],
  detraction: {
    percentage: 19,
    maxAmount: 101,
  },
};
