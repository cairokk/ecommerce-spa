import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Café Landing Page',
  description: 'Awaken Your Senses With Every Sip.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
