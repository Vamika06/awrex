import { Link } from 'react-router-dom';
import { Logo } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div>
          <Link className="brand" to="/" aria-label="Back to home"><Logo />AWREX</Link>
          <p>© {new Date().getFullYear()} AWREX Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
        <nav aria-label="Footer">
          <Link to="/#platform">Platform</Link>
          <Link to="/#products">Products</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
