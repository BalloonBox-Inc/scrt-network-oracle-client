import React from 'react';

import Footer from '@scrtsybil/src/components/footer';
import Header from '@scrtsybil/src/components/header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      <Header />
      <main className="px-5 md:px-20 2xl:px-40">{children}</main>
      <Footer />
    </div>
  );
}
