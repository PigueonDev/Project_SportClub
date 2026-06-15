import { Outlet } from "react-router-dom";

function UserLayout() {
    return (
        <div style={{ backgroundColor: '#1a0f2a', minHeight: '100vh' }}>
            <Outlet />
        </div>
    );
}

export default UserLayout;