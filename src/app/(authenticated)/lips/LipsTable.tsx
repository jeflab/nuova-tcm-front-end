import {getLipsList} from "@/app/(authenticated)/lips/action";
import {columns} from "@/app/(authenticated)/lips/columns";
import {DataTable} from "@/ui/table/DataTable";
import {DataTableParams, dataTableParamsSchema} from "@/ui/table/helpers";

interface LipsTableProps {
  searchParams: Partial<DataTableParams>;
}

export async function LipsTable({searchParams}: LipsTableProps) {
  const parsedSearchParams = dataTableParamsSchema.parse(searchParams);
  const {lips, pageCount} = await getLipsList(parsedSearchParams);

  return (
    <DataTable
      columns={columns}
      data={lips}
      pageCount={pageCount}
      searchParams={parsedSearchParams}
    />
  );
}
