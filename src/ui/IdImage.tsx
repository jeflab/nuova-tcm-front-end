import {createIDImageUrl} from "@/helpers/createResourcesUrl";
import {
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import styles from "./idImage.module.scss";

interface IdImageProps {
  agentId: number;
  personalDataId: number;
  filename: string;
}
export function IdImage({agentId, personalDataId, filename}: IdImageProps) {
  const imageUrl = createIDImageUrl({
    personalDataId,
    agentId,
    fileName: filename,
    size: "thumbnail",
  });
  const zoommedImageUrl = createIDImageUrl({
    personalDataId,
    agentId,
    fileName: filename,
    size: "full",
  });

  if (!imageUrl) {
    return null;
  }

  return (
    <div className={styles.idImage + " bg-primary-subtle p-3 rounded"}>
      <Zoom
        zoomImg={{
          alt: `Documento di identità - ${filename}`,
          src: zoommedImageUrl,
        }}
        zoomMargin={16}
        IconZoom={() => <FontAwesomeIcon icon={faMagnifyingGlassPlus} />}
        IconUnzoom={() => <FontAwesomeIcon icon={faMagnifyingGlassMinus} />}
        classDialog={styles.idImageZoomOverlay}
      >
        <Image
          className={styles.idThumbnail}
          src={imageUrl}
          width={256}
          height={256}
          unoptimized
          alt={`Documento di identità - ${filename}`}
        />
      </Zoom>
    </div>
  );
}
