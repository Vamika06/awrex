import { useState } from 'react';
import Hero from '../components/Hero.jsx';
import Problem from '../components/Problem.jsx';
import Platform from '../components/Platform.jsx';
import Demo from '../components/Demo.jsx';
import Products from '../components/Products.jsx';
import Why from '../components/Why.jsx';
import Trust from '../components/Trust.jsx';
import Contact from '../components/Contact.jsx';

export default function Home() {
  // lifted so the hero chips can open the matching product tab
  const [productKey, setProductKey] = useState('health');
  return (
    <>
      <Hero onPickProduct={setProductKey} />
      <Problem />
      <Platform />
      <Demo />
      <Products activeKey={productKey} setActiveKey={setProductKey} />
      <Why />
      <Trust />
      <Contact />
    </>
  );
}
