import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/home/home";

export const Route = createFileRoute("/")({
	component: HomePage,
});
