import React from "react";
import Navbar from "../HomePage/Navbar";
import AboutHero from "./AboutHero";
import OurStory from "./OurStory";
import Stats from "./Stats";
import AboutFooter from "./AboutFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      <main className="animate-fade-in">
        <AboutHero />
        <Stats />
        <OurStory />

        <AboutFooter />
      </main>
    </div>
  );
};

export default About;
