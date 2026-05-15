import "./globals.css";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Bhutan Procurement Transparency Platform",
  description: "A transparent and accountable government procurement platform powered by blockchain auditability and Bhutan NDI verification.",
  keywords: ["procurement", "transparency", "Bhutan", "government", "blockchain", "NDI"],
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-dark">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
