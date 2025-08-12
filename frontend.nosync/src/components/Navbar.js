import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-600 text-white px-6 py-4 shadow">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">EchoPolicy</Link>
      <div className="space-x-4">
        <Link to="/polls" className="hover:underline">Polls</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/admin/create" className="hover:underline">Create Polls</Link>
        <Link to="https://github.com/echopolicy" className="hover:underline">GitHub</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
