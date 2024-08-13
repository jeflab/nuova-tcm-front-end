"use client";

import {ReactNode, useEffect, useRef, useState} from "react";
import styles from "./ScrollReveal.module.scss";
import {cns} from "@/helpers/cns";

interface ScrollRevealProps {
  revealThreshold: number;
  children: ReactNode;
}

export default function ScrollReveal({
  children,
  revealThreshold,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY >= revealThreshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [revealThreshold]);

  useEffect(() => {
    const handleResize = () => {
      if (componentRef.current) {
        const elementHeight = componentRef.current.offsetHeight;
        componentRef.current.style.setProperty(
          "--element-height",
          `${elementHeight}px`,
        );
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={componentRef}
      className={cns(styles.scrollReveal, isVisible && styles.visible)}
    >
      {children}
    </div>
  );
}
