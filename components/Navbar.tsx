import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className="font-bold">Blog</Link>
      <div className="space-x-4">
        <Link href="/posts/new">Nouvel article</Link>
        <Link href="/auth/login">Connexion</Link>
        <Link href="/auth/register">Inscription</Link>
      </div>
    </nav>
  );
}
