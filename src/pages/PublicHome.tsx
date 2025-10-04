import { useObras } from "../query/obras";
import PublicLayout from "../components/layout/PublicLayout";
import WelcomeSection from "../components/Home/WelcomeSection";
import HeroSection from "../components/Home/HeroSection";
import GallerySection from "../components/Home/GallerySection";

export default function PublicHome() {
  const { data } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 15 });
  const obras = data?.data ?? [];

  return (
    <PublicLayout noPadding>
      <WelcomeSection />
      <HeroSection />
      <GallerySection obras={obras} />
    </PublicLayout>
  );
}
