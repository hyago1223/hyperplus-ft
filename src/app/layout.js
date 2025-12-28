import "./globals.css";
import Header from "@/components/header.js"
import Footer from "@/components/footer.js";
import { ThemeProvider } from "@/components/css/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider>
          <Header/>
          <main>
            {children}
          </main>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
