import '../../../css/components/Navbar.css'; 
import { NAV_LINKS } from "../../config/navLinks";
import { Link } from "react-router-dom"; 


const Navbar = () => {
  return (
    <nav>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          to={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;