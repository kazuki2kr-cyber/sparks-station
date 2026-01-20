import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function QuizLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3577742758028719"
                crossOrigin="anonymous"
            />
            <AuthProvider>
                <div className="flex-grow">
                    {children}
                </div>
                <Footer />
                <Toaster />
            </AuthProvider>
        </>
    );
}
