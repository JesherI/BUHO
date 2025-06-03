import React from 'react';
import Header from './components/header/header';
import Navbar from "./components/navbar/navbar";
import Footer from './components/footer/footer';

import './globals.css'

export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <Footer/>
    </>
  );
}
