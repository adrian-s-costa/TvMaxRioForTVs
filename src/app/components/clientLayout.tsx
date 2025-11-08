"use client"

import BottomNav from './bottomNav';
import PageTransition from './pageTransition';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTransition>
        {children}
      </PageTransition>
      <BottomNav />
    </>
  );
}

