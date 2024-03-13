// TODO: se riusciamo meglio tenerla lato server ma ora mi serve per le immagini dell'identificazione
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const contentJsonHeader = {
  "Content-Type": "application/json",
};

export const contentMultipartHeader = {
  "Content-Type": "multipart/form-data",
  Accept: "application/json",
};
