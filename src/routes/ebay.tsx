import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/ebay")({
  component: () => <Outlet />,
});
