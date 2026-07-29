import {notFound} from "next/navigation";

export function validateLipIdOrNotFound(id: string): "new" | number {
  if (id === "new") {
    return "new";
  }

  const parsedId = Number(id);

  if (isNaN(parsedId)) {
    notFound();
  }

  return parsedId;
}
