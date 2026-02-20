import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type NavigateOptions = { replace?: boolean };
type NavigateFn = (to: string, options?: NavigateOptions) => void;

type RouterContextValue = {
  path: string;
  navigate: NavigateFn;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function splitPath(pathname: string): string[] {
  return normalizePath(pathname)
    .split("/")
    .filter(Boolean);
}

function matchesRoutePattern(routePath: string, currentPath: string): boolean {
  if (routePath === "*") return true;

  const routeParts = splitPath(routePath);
  const currentParts = splitPath(currentPath);

  if (routeParts.length !== currentParts.length) return false;

  for (let index = 0; index < routeParts.length; index += 1) {
    const routePart = routeParts[index];
    const currentPart = currentParts[index];
    if (routePart.startsWith(":")) continue;
    if (routePart !== currentPart) return false;
  }

  return true;
}

function useRouterContext() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Router primitives must be used inside BrowserRouter");
  }
  return context;
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to: string, options?: NavigateOptions) => {
    const nextPath = normalizePath(to);
    if (nextPath === normalizePath(window.location.pathname)) {
      setPath(nextPath);
      return;
    }
    if (options?.replace) {
      window.history.replaceState(null, "", nextPath);
    } else {
      window.history.pushState(null, "", nextPath);
    }
    setPath(nextPath);
  };

  const contextValue = useMemo<RouterContextValue>(
    () => ({ path, navigate }),
    [path],
  );

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>;
}

type RouteProps = {
  path: string;
  element: ReactElement;
};

export function Route({ element }: RouteProps) {
  return element;
}

export function Routes({ children }: { children: ReactNode }) {
  const { path } = useRouterContext();

  let wildcardElement: ReactElement | null = null;

  const matchedElement = Children.toArray(children).find((child) => {
    if (!isValidElement<RouteProps>(child)) return false;
    const routePath = child.props.path;
    if (routePath === "*") {
      wildcardElement = child.props.element;
      return false;
    }
    return matchesRoutePattern(routePath, path);
  });

  if (isValidElement<RouteProps>(matchedElement)) {
    return cloneElement(matchedElement.props.element);
  }

  return wildcardElement;
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const { navigate } = useRouterContext();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export function useNavigate(): NavigateFn {
  return useRouterContext().navigate;
}
