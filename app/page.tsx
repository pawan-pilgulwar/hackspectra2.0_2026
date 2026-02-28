import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Tracks from "@/sections/Tracks";
import Timeline from "@/sections/Timeline";
import ProblemStatements from "@/sections/ProblemStatements";
import Rules from "@/sections/Rules";
import Prizes from "@/sections/Prizes";
import FAQ from "@/sections/FAQ";
import Sponsors from "@/sections/Sponsors";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Tracks />
      <ProblemStatements />
      <Timeline />
      <Rules />
      <Prizes />
      <FAQ />
      <Sponsors />
      <Footer />
    </main>
  );
}
