import {getLipsList} from "@/app/(authenticated)/lips/action";
import {ButtonLink} from "@/ui/ButtonLink";
import {PageTitle} from "@/ui/PageTitle";
import {faPlus} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LipsTable} from "./LipsTable";
import {z} from "zod";
import {Container} from "react-bootstrap";

const paramsSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().positive().catch(1).optional(),
  orderBy: z.string().optional(),
});

interface LipsPageProps {
  searchParams: z.infer<typeof paramsSchema>;
}

export default async function LipsPage({searchParams}: LipsPageProps) {
  const lips = await getLipsList(paramsSchema.parse(searchParams));

  return (
    <Container fluid="lg" className="vstack gap-3">
      <PageTitle>
        Lista polizze
        <ButtonLink href="lips/new">
          <FontAwesomeIcon icon={faPlus} /> Nuova polizza
        </ButtonLink>
      </PageTitle>
      <LipsTable lips={lips} />
    </Container>
  );
}
