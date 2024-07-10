import {Underwriting} from "@/models/entities/lip";

interface ExclusionListProps {
  exclusions: Underwriting["exclusions"];
}

export function ExclusionList({exclusions}: ExclusionListProps) {
  const exclusionsJsx = exclusions.map((exclusion) => (
    <li key={exclusion.name}>{exclusion.name}</li>
  ));

  if (exclusionsJsx.length === 0) {
    return null;
  }

  return <ul>{exclusionsJsx}</ul>;
}
