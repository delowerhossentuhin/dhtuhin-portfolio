import { Hero } from '@/components/home/Hero';
import { ResearchAreas } from '@/components/home/ResearchAreas';
import { FeaturedPublications } from '@/components/home/FeaturedPublications';
import { CurrentWork } from '@/components/home/CurrentWork';
import { PhilosophyBlock } from '@/components/home/PhilosophyBlock';
import { HomeCta } from '@/components/home/HomeCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ResearchAreas />
      <FeaturedPublications />
      <CurrentWork />
      <PhilosophyBlock />
      <HomeCta />
    </>
  );
}
