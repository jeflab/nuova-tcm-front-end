import {getLipsList} from "@/app/(menu)/(authenticated)/lips/actions";
import {columns} from "@/app/(menu)/(authenticated)/lips/columns";
import {DataTable} from "@/ui/table/DataTable";
import {DataTableParams, dataTableParamsSchema} from "@/ui/table/helpers";

interface LipsTableProps {
  searchParams: Partial<DataTableParams>;
}

export async function LipsTable({searchParams}: LipsTableProps) {
  const parsedSearchParams = dataTableParamsSchema.parse(searchParams);
  const lips = await getLipsList(parsedSearchParams);

  if (lips.status === "failed") {
    throw new Error("Impossibile caricare le polizze, riprovare più tardi");
  }

  console.log({columns});

  return (
    <DataTable
      columns={columns}
      data={lips.lips.data}
      pageCount={lips.lips.lastPage}
      searchParams={parsedSearchParams}
    />
  );
}
