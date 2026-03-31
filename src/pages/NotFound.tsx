import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-3 font-display text-5xl font-extrabold text-foreground">404</h1>
        <p className="mb-5 text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
