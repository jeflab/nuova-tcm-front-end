import appInfo from "@/../package.json";
import logo from "@/images/logo.png";
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
      <Image src={logo} height={200} alt={`logo ${appInfo.name}`} />
      {children}
    </div>
  );
}
