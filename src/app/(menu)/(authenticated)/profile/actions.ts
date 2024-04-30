"use server";

import {accountSchema} from "@/models/account";
import {patch, post} from "@/services/api";
import {Tags} from "@/services/const";
import {invalidateTag} from "@/services/helpers";

interface UpdateAccountData {
  fiscalCode: string;
  email: string;
  phone: string;
}
export async function updateAccount(formData: UpdateAccountData) {
  const data = {
    fiscal_code: formData.fiscalCode,
    email: formData.email,
    phone: formData.phone,
  };

  invalidateTag(Tags.me());
  return patch("/me", {payloadShape: accountSchema.shape, data});
}

interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}
export async function updatePassword(data: UpdatePassword) {
  return post("/reset-my-password", {data});
}
