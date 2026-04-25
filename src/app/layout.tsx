import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { DashboardProvider } from "@/components/DashboardContext";
import SimpleModal from "@/components/SimpleModal";

export const metadata: Metadata = {
  title: "Selah Dashboard",
  description: "Minimal control panel for distributors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DashboardProvider>
          <div className="layout-container">
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <TopBar />
              <main className="main-content">
                {children}
              </main>
            </div>
          </div>
          <BottomNav />
          <SimpleModal />
        </DashboardProvider>
      </body>
    </html>
  );
}
