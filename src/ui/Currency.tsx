import {cns} from "@/helpers/cns";
import {toCurrency, toDecimal, toPercent} from "@/helpers/numbers";

interface FormatNumbersProps {
  className?: string;
  children: string | number;
  preventWrap?: boolean;
}

export function Currency({
  className,
  children,
  preventWrap,
}: FormatNumbersProps) {
  const safeValue =
    typeof children === "string" ? parseFloat(children) : children;
  const shouldWrap = preventWrap !== false;

  return (
    <span className={cns(className, shouldWrap && "text-nowrap")}>
      {toCurrency(safeValue)}
    </span>
  );
}

export function Percent({
  className,
  children,
  preventWrap,
}: FormatNumbersProps) {
  const safeValue =
    typeof children === "string" ? parseFloat(children) : children;
  const shouldWrap = preventWrap !== false;

  return (
    <span className={cns(className, shouldWrap && "text-nowrap")}>
      {toPercent(safeValue)}
    </span>
  );
}

export function Decimal({
  className,
  children,
  preventWrap,
}: FormatNumbersProps) {
  const safeValue =
    typeof children === "string" ? parseFloat(children) : children;
  const shouldWrap = preventWrap !== false;

  return (
    <span className={cns(className, shouldWrap && "text-nowrap")}>
      {toDecimal(safeValue)}
    </span>
  );
}
