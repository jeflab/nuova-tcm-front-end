import {skeletonColumns} from "@/app/(menu)/(authenticated)/lips/columns";
import {getLipsListQuery} from "@/app/(menu)/(authenticated)/lips/queries";
import {AppContainer} from "@/ui/AppContainer";
import {ButtonLink} from "@/ui/ButtonLink";
import {getQueryClient} from "@/ui/getQueryClient";
import {PageTitle} from "@/ui/PageTitle";
import {DataTableSkeleton} from "@/ui/table/DataTableSkeleton";
import {DataTableParams, dataTableParamsSchema} from "@/ui/table/helpers";
import {faPlus} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";
import {LipsTable} from "./LipsTable";

interface LipsPageProps {
  searchParams: Promise<Partial<DataTableParams>>;
}

export default async function LipsPage(props: LipsPageProps) {
  const searchParams = dataTableParamsSchema.parse(await props.searchParams);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getLipsListQuery(searchParams));

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>
        Elenco Contraenti
        <ButtonLink href="lips/new">
          <FontAwesomeIcon icon={faPlus} /> Nuova proposta di polizza
        </ButtonLink>
      </PageTitle>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <DataTableSkeleton
              columns={skeletonColumns}
              searchParams={searchParams}
            />
          }
        >
          <LipsTable searchParams={searchParams} />
        </Suspense>
      </HydrationBoundary>
    </AppContainer>
  );
}
