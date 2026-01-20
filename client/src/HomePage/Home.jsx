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
      <div className="bg-[#fff7ec] p-1 mr-110 ml-110 border border-[#ffc49d] rounded-xl">
      <h2 className="z-100 bottom-0 sticky text-xl text-[#ff6c2d] flex justify-center">This project is under development</h2>
      </div>
    </div>
  );
};

export default Home;
