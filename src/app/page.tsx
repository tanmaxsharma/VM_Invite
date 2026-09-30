import { wedding } from "@/data/wedding";
import { WeddingTemplate } from "@/components/wedding/WeddingTemplate";

export default function Home() {
  return <WeddingTemplate data={wedding} />;
}
