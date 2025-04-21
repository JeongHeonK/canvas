import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2 static top-0 left-0 right-0 bg-white border-b border-gray-300 z-10">
        <Link to="/" className="p-3 bg-blue-200 rounded-md">
          Konva
        </Link>
        <Link to="/fabric" className="p-3 bg-amber-200 rounded-md">
          Fabric
        </Link>
        <Link to="/colorPickers" className="p-3 bg-rose-200 rounded-md">
          colorPickers
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
