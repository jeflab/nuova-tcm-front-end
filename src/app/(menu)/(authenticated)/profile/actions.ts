"use server";

import {accountSchema} from "@/models/account";
import {patch, post} from "@/services/api";
import {revalidateTag} from "next/cache";

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

  revalidateTag("me");
  return patch("/me", accountSchema.shape, JSON.stringify(data));
}

interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}
export async function updatePassword(formData: UpdatePassword) {
  return post("/reset-my-password", {}, JSON.stringify(formData));
}
