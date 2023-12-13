import React, {FC} from "react";
import {Card} from "react-bootstrap";

interface DebugProps {
  children?: any;
  className?: string;
}

export const Debug: FC<DebugProps> = ({children, className}) => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card body className={className}>
      <pre className="text-start mb-0">
        {children === undefined
          ? "undefined"
          : JSON.stringify(children, null, 2)}
      </pre>
    </Card>
  );
};
