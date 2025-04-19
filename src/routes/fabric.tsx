import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fabric")({
  component: Fabric,
});

function Fabric() {
  return <div>Hello "/fabric"!</div>;
}
