"use client";

import {cns} from "@/helpers/cns";
import {WithChildren} from "@/ui/types";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {faChevronDown} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode, useId, useState} from "react";
import {Card, CardBody, CardHeader} from "react-bootstrap";
import styles from "./CardCollapsable.module.scss";

interface CardCollapsableProps extends WithChildren {
  className?: string;
  disabled?: boolean;
  header: ReactNode;
}

export function CardCollapsable({
  children,
  className,
  disabled,
  header,
}: CardCollapsableProps) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [animateContainer] = useAutoAnimate();

  const toggleIsOpen = () => {
    if (disabled) return;

    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <Card
      ref={animateContainer}
      className={cns(
        className,
        disabled && styles.disabled,
        styles.cardCollapsable,
        isOpen && styles.open,
      )}
    >
      <CardHeader
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={toggleIsOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleIsOpen();
          }
        }}
        className="hstack gap-3"
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex-grow-0">
          <FontAwesomeIcon icon={faChevronDown} className={styles.caret} />
        </div>
        <div className="flex-grow-1">{header}</div>
      </CardHeader>
      {isOpen && <CardBody id={id}>{children}</CardBody>}
    </Card>
  );
}
