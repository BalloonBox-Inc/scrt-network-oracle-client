import React from 'react';

import Footer from '@scrtsybil/src/components/footer';
import Header from '@scrtsybil/src/components/header';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
