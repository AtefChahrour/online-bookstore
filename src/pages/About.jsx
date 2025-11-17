import React from "react";
import Navbar from "../components/Navbar";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <h1>About Our Bookstore</h1>
        <p className="about-text">
          Welcome to our online bookstore, a cozy space built for readers who love discovering new stories. 
          Our shelves are filled with a curated collection spanning fiction, history, science, self-development, 
          and many more categories. We believe books open doors to imagination and knowledge, and our mission 
          is to make these worlds accessible to everyone. Whether you're searching for a timeless classic or 
          a fresh new release, we are here to help you find your next favorite read.
        </p>
        <p className="about-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, lectus vel aliquet gravida, 
          elit turpis vulputate justo, at pulvinar lectus turpis in urna. Donec eget neque non turpis fermentum 
          dictum. Integer et risus ac massa convallis egestas. Proin eu sapien in lacus laoreet venenatis. 
          Suspendisse vel finibus nunc, sed commodo neque. Pellentesque ut efficitur eros. Mauris gravida 
          tincidunt eros vitae cursus.
        </p>
      </div>
    </>
  );
}

export default About;
