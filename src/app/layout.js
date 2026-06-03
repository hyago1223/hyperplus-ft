import "./globals.css";
import Header from "@/components/header.js"
import Footer from "@/components/footer.js";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ThemeProvider } from "@/components/css/ThemeProvider";

export const metadata = {
    language_default: "en-us",
    home: "Home",
    about: "About Us",
    services: "Services",
    contact: "Contact",
    help: "Help Center"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Header/>
              <main>
                {children}
              </main>
            <Footer/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
