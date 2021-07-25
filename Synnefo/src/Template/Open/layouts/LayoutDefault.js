import React from 'react';

import Footer from '../components/layout/Footer';

const LayoutDefault = ({ children }) => (
  <>
    {/* <Header navPosition="right" className="reveal-from-bottom" /> */}
    <main className="site-content">
      {children}
    </main>
    <Footer />
  </>
);

export default LayoutDefault;  