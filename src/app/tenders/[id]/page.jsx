import { TenderDetailPage } from "@/components/premium/BGPSExperience";

export default async function TenderPage({ params }) {
  const { id } = await params;
  return <TenderDetailPage id={decodeURIComponent(id)} />;
}
