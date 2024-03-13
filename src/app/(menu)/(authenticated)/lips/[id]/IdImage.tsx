import {apiUrl} from "@/services/const";

//TODO: pensare a come inviare il bearer token per le richieste di immagini

interface IdImageProps {
  agentId: number;
  contractorId: number;
  filename: string;
  size?: "thumbnail" | "full";
}
export async function IdImage({
  agentId,
  contractorId,
  filename,
  size = "thumbnail",
}: IdImageProps) {
  const imageUrl = encodeURI(
    `${apiUrl}/personal-datas/${contractorId}/get-image?filename=${filename}&agentId=${agentId}&size=${size}`,
  );

  return (
    <div
      className="bg-primary-subtle d-flex justify-content-center align-items-md-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
        borderRadius: "0.5rem",
        padding: "1rem",
        backgroundOrigin: "content-box",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    ></div>
  );
}
