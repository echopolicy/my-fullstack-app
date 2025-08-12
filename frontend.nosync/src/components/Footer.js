import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ padding: "1rem", textAlign: "center" }}>
      <p>
        <Link to="/terms" style={{ marginRight: "1rem" }}>Terms & Conditions</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </p>
      <small>© {new Date().getFullYear()} EchoPolicy</small>
    </footer>
  );
}
