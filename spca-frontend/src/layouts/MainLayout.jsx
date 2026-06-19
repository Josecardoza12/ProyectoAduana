import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
    return (
        <>
            <Navbar />

            <div
                style={{
                    display: "flex",
                    minHeight: "calc(100vh - 80px)"
                }}
            >
                <Sidebar />

                <main
                    style={{
                        flex: 1,
                        padding: "20px",
                        backgroundColor: "#f8f9fa"
                    }}
                >
                    {children}
                </main>

            </div>
        </>
    );
}

export default MainLayout;