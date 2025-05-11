import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from "next/image";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Traditio Interiors',
  description: 'Timeless design, contemporary aesthetics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className + " bg-ivory min-h-screen"}>
        <header className="w-full flex items-center justify-between px-8 py-4 shadow bg-white sticky top-0 z-50">
          <Image src="/traditio_logo.png" alt="Traditio Logo" width={48} height={48} className="h-12 w-auto" />
          <nav>
            <ul className="flex space-x-6 text-lg font-semibold">
              <li><a href="/" className="hover:text-brass">Home</a></li>
              <li><a href="/collections" className="hover:text-brass">Collections</a></li>
              <li><a href="/about" className="hover:text-brass">About</a></li>
              <li><a href="/contact" className="hover:text-brass">Contact</a></li>
            </ul>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-8">
          {children}
        </main>
        <footer className="w-full bg-ivory text-espresso border-t border-sand mt-16">
          <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col md:flex-row md:justify-between gap-8">
            <div className="flex-1">
              <h2 className="uppercase text-xs font-bold tracking-widest mb-2">Newsletter</h2>
              <form className="flex flex-col sm:flex-row gap-2">
                <input type="email" placeholder="Your email address" className="px-4 py-2 border border-sand rounded focus:outline-none focus:ring-2 focus:ring-brass" />
                <button type="submit" className="px-6 py-2 bg-brass text-ivory rounded hover:bg-espresso hover:text-brass transition-colors duration-200 font-bold">Sign Up</button>
              </form>
            </div>
            <div className="flex-1">
              <h2 className="uppercase text-xs font-bold tracking-widest mb-2">Contact</h2>
              <div className="text-sm">
                10 Place du Marché, Ceaucé, France<br />
                +44 7909 920066<br />
                info@modants.co.uk<br />
                Hours: Mon & Sat 2pm - 6pm
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-8 py-4 flex flex-col md:flex-row md:justify-between items-center border-t border-sand text-xs text-sand">
            <div className="flex gap-4 mb-2 md:mb-0">
              <a href="/delivery" className="hover:underline">Delivery</a>
              <a href="/contact" className="hover:underline">Contact</a>
              <a href="/returns" className="hover:underline">Returns</a>
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/reviews" className="hover:underline">Reviews</a>
            </div>
            <div>© 2025 Traditio Interiors. All rights reserved.</div>
          </div>
        </footer>
      </body>
    </html>
  )
}
