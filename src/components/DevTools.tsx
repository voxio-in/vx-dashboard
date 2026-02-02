import { lazy, Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export function DevTools() {
  return (
    <Suspense fallback={null}>
      <TanStackRouterDevtools position="bottom-right" />
    </Suspense>
  );
}

//In Development (npm run dev): Loads the devtools so you can debug -  dont delete it
//In Production (npm run build): Returns null (nothing), so devtools don't load at all -  dont delete it
