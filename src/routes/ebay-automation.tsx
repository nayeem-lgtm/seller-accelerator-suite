import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ebay-automation")({
  beforeLoad: () => { throw redirect({ to: "/ebay" }); },
  component: () => null,
});
