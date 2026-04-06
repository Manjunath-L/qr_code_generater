
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Project Title */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H9.366a.75.75 0 000 1.5h4.234A4.001 4.001 0 0012 9.749a5.5 5.5 0 00-6.5-5.244V4a3 3 0 00-3 3c0 1.657 1.343 3 3 3h7.5a3 3 0 10-1.396-5.663A5.5 5.5 0 005.5 13z" />
              </svg>
              <Link href="/">
                <span className="ml-2 text-xl font-bold text-primary-600 cursor-pointer">
                    Concept Crafter
                </span>
              </Link>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-600">
                  Welcome, <span className="font-medium">{user?.username}</span>
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
