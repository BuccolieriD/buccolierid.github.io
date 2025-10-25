import React from 'react';
import NavBar from '../components/NavBar';
import PageHero from '../components/PageHero';
import aboutBg from '../asset/siluette.png';

const About = () => {
  return (
    <div>
      <NavBar current="About" />
      <PageHero title="Chi Siamo" bgImage={aboutBg} />
      <div className="prose max-w-3xl mx-auto p-6">
        <h1>About</h1>
        <p>This demo project includes React Router, Redux Toolkit, Tailwind CSS, and Supabase.</p>
      </div>
    </div>
  );
};

export default About;
