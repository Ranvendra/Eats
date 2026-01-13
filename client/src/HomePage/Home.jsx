import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden selection:bg-emerald-100">
      {/* Background Green Shape - matching the design's right side curve */}


      {/* Another decorative circle for depth */}

      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
};

export default Home;
