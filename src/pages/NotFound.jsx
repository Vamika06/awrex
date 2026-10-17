import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="center-page wrap">
      <div>
        <h1>404</h1>
        <h2>This thread leads nowhere</h2>
        <p className="lead">The page you were looking for does not exist or has moved.</p>
        <p><Link className="btn btn--primary" to="/">Back to home</Link></p>
      </div>
    </div>
  );
}
