import "./globals.css";
import Header from "@/components/header.js"
import Footer from "@/components/footer.js";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ThemeProvider } from "@/components/css/ThemeProvider";

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
