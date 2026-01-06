import {Lip} from "@/models/entities/lip";

export function isContractorContactsValid(lip: Lip): boolean {
  return !!lip.contractor?.phone && !!lip.contractor?.email;
}
