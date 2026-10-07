import { About } from '@/components/sections/About';
import { Amenities } from '@/components/sections/Amenities';
import { BookingSection } from '@/components/sections/BookingSection';
import { Contact } from '@/components/sections/Contact';
import { CtaBand } from '@/components/sections/CtaBand';
import { Experience } from '@/components/sections/Experience';
import { Faq } from '@/components/sections/Faq';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Location } from '@/components/sections/Location';
import { Reviews } from '@/components/sections/Reviews';
import { Rooms } from '@/components/sections/Rooms';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BookingSection />
      <About />
      <Rooms />
      <Amenities />
      <Experience />
      <Gallery />
      <Reviews />
      <Location />
      <Contact />
      <Faq className="bg-cream/60" />
      <CtaBand />
    </>
  );
}
