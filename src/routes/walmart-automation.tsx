import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/walmart-automation")({
  beforeLoad: () => { throw redirect({ to: "/walmart" }); },
  component: () => null,
});
