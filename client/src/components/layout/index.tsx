import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";
import Footer from "@/components/footer";

export function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden", 
      }}
    >
      <TopMenu />
      <main style={{ paddingTop: "40px", flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
