import {getActiveSubscriptionQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {dateString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import {IconStack} from "@/ui/IconStack";
import {faCheck} from "@fortawesome/pro-duotone-svg-icons";
import {faArrowsSpin, faCreditCard} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useQuery} from "@tanstack/react-query";

interface MollieSubscriptionStatusProps {
  lip: Lip;
}

export function MollieSubscriptionStatus({lip}: MollieSubscriptionStatusProps) {
  const {data: activeSubscription} = useQuery(
    getActiveSubscriptionQuery(lip.id),
  );

  if (!activeSubscription?.subscription) {
    return null;
  }

  return (
    <div>
      <h4 className="w-100 text-primary">
        <IconStack>
          <FontAwesomeIcon
            icon={faCreditCard}
            className="fa-stack-2x"
            opacity={0.4}
          />
          <FontAwesomeIcon
            icon={faArrowsSpin}
            className="fa-stack-1x"
            transform="right-12 down-8 grow-7"
          />
        </IconStack>{" "}
        Pagamento automatico
      </h4>
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheck} className="text-success" fixedWidth />{" "}
        <strong>È attivo il pagamento automatico</strong>
        <br />
        <strong>Prossimo addebito:</strong>{" "}
        {dateString(activeSubscription.subscription.nextPaymentDate)}
        {lip?.expirationDate && (
          <>
            <br />
            <strong>Scadenza abbonamento:</strong>{" "}
            {dateString(lip.expirationDate)}
          </>
        )}
      </p>
    </div>
  );
}
