import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tiktok-automation")({
  beforeLoad: () => { throw redirect({ to: "/tiktok-shop" }); },
  component: () => null,
});
