"use client";

import {columns} from "@/app/(menu)/(authenticated)/lips/columns";
import {getLipsListQuery} from "@/app/(menu)/(authenticated)/lips/queries";
import {DataTable} from "@/ui/table/DataTable";
import {DataTableParams} from "@/ui/table/helpers";
import {hashKey, useIsFetching, useSuspenseQuery} from "@tanstack/react-query";

interface LipsTableProps {
  searchParams: DataTableParams;
}

export function LipsTable({searchParams}: LipsTableProps) {
  const query = getLipsListQuery(searchParams);
  const {data} = useSuspenseQuery(query);

  const currentQueryHash = hashKey(query.queryKey);
  const isFetchingOtherLipsQuery =
    useIsFetching({
      queryKey: ["lips"],
      predicate: (fetchingQuery) =>
        fetchingQuery.queryHash !== currentQueryHash,
    }) > 0;

  return (
    <DataTable
      columns={columns}
      data={data.lips.data}
      pageCount={data.lips.lastPage}
      searchParams={searchParams}
      contextValue={data.lipstates}
      isFetching={isFetchingOtherLipsQuery}
    />
  );
}
