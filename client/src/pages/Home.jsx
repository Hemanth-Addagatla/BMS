import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import TrailerSection from '../components/TrailerSection';



const Home = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <FeatureSection/>
      <TrailerSection></TrailerSection>
    </div>
  );
}

export default Home;
