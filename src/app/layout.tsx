import "./globals.css";

export const metadata = {
  title: "Traditio Interiors",
  description: "Timeless design, contemporary aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body bg-ivory text-espresso">
        {children}
      </body>
    </html>
  );
} 