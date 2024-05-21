import appInfo from "@/../package.json";
import Image from "next/image";
import {CSSProperties} from "react";
import styles from "./CenterLogoContent.module.scss";
import {WithChildren} from "./types";

interface CenterLogoContentProps extends WithChildren {
  style?: {"--content-width": string};
}

export default function CenterLogoContent({
  children,
  style,
}: CenterLogoContentProps) {
  return (
    <div className={styles.centerContent} style={style as CSSProperties}>
      <h1 className={styles.brandName}>
        Smart
        <br />
        Broker
        <br />
        Space
      </h1>
      {children}
    </div>
  );
}
