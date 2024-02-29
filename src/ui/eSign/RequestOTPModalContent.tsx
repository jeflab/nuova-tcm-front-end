import {Profile} from "@/entities/account";
import {PDFType} from "@/entities/esign";
import {PersonalData} from "@/entities/personalData";
import {createFEATransaction} from "@/ui/eSign/actionst";
import {InsertPhoneForm} from "@/ui/eSign/InsertPhoneForm";
import {RequestOTPForm} from "@/ui/eSign/RequestOTPForm";
import {useEffect, useState} from "react";

interface RequestOTPModalContentProps<TPayload> {
  lipId: number;
  onCancel: () => void;
  payload: TPayload;
  personalData?: PersonalData;
  profile: Profile;
}
export function RequestOTPModalContent<TPayload>({
  lipId,
  onCancel,
  payload,
  personalData,
  profile,
}: RequestOTPModalContentProps<TPayload>) {
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  useEffect(() => {
    (async () => {
      console.log(
        await createFEATransaction({
          pdfType: PDFType.Privacy,
          contractorId: personalData?.id,
          lipId: lipId,
          payload,
        }),
      );
    })();
  }, [lipId, payload, personalData?.id]);

  return !isUpdatingPhone ? (
    <RequestOTPForm
      onCancel={onCancel}
      openEditNumberForm={() => {
        setIsUpdatingPhone(true);
      }}
      personalData={personalData}
      profile={profile}
    />
  ) : (
    <InsertPhoneForm
      closeEditNumberForm={() => {
        setIsUpdatingPhone(false);
      }}
      defaultValues={{phone: profile.user.phone ?? ""}}
      onCancel={onCancel}
      personalData={personalData}
      profile={profile}
    />
  );
}
