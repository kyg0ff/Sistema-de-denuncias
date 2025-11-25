import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import RecentReports from './components/Reports/RecentReports';
import StatsSection from './components/Stats/StatsSection';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <RecentReports />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;