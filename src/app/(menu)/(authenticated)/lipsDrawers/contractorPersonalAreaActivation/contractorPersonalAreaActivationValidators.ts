import {Lip} from "@/models/entities/lip";

export function isContractorPersonalAreaActivationValid(lip: Lip) {
  return lip.contractor.lastPrivacyESignId !== null;
}
