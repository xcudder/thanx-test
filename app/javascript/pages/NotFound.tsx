import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="rh-not-found">
      <div className="rh-not-found__inner">
        <h1 className="rh-not-found__title">404</h1>
        <p className="rh-not-found__text">Oops! Page not found</p>
        <Link to="/" className="rh-not-found__link">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
