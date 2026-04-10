import { Link } from "react-router-dom";

const NotFound = () => (
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

export default NotFound;
