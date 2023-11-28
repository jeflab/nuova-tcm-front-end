import {skeletonColumns} from "@/app/(authenticated)/lips/columns";
import {ButtonLink} from "@/ui/ButtonLink";
import {PageTitle} from "@/ui/PageTitle";
import {DataTableSkeleton} from "@/ui/table/DataTableSkeleton";
import {DataTableParams} from "@/ui/table/helpers";
import {faPlus} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Suspense} from "react";
import {Container} from "react-bootstrap";
import {LipsTable} from "./LipsTable";

interface LipsPageProps {
  searchParams: Partial<DataTableParams>;
}

export default async function LipsPage({searchParams}: LipsPageProps) {
  return (
    <Container fluid="lg" className="vstack gap-3">
      <PageTitle>
        Lista polizze
        <ButtonLink href="lips/new">
          <FontAwesomeIcon icon={faPlus} /> Nuova polizza
        </ButtonLink>
      </PageTitle>
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <DataTableSkeleton
            columns={skeletonColumns}
            searchParams={searchParams}
          />
        }
      >
        <LipsTable searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
