import Navbar from "@/components/navbar";

interface RootLayoutProps {
    children: React.ReactNode;
  }
  
  export default async function RootLayout({ children }: RootLayoutProps) {
    return (
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <Navbar />
        {children}
      </div>
    );
  }