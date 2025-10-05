import {Outlet} from "react-router";
import TopBar from "../utils/TopBar.tsx";
import Footer from "../utils/Footer.tsx";

const LayoutPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default LayoutPage;