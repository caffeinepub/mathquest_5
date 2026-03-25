import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Game } from "./pages/Game";
import { Home } from "./pages/Home";
import { Leaderboard } from "./pages/Leaderboard";
import { Play } from "./pages/Play";
import { Results } from "./pages/Results";

const queryClient = new QueryClient();

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  component: Play,
  validateSearch: (s: Record<string, unknown>) => ({
    group: s.group as string | undefined,
  }),
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: Game,
  validateSearch: (s: Record<string, unknown>) => ({
    group: s.group as string | undefined,
    difficulty: s.difficulty as string | undefined,
    name: s.name as string | undefined,
  }),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: Results,
  validateSearch: (s: Record<string, unknown>) => ({
    group: s.group as string | undefined,
    difficulty: s.difficulty as string | undefined,
    name: s.name as string | undefined,
    score: s.score as string | undefined,
    correct: s.correct as string | undefined,
    total: s.total as string | undefined,
    timeBonus: s.timeBonus as string | undefined,
    isPerfect: s.isPerfect as string | undefined,
  }),
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: Leaderboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  playRoute,
  gameRoute,
  resultsRoute,
  leaderboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
