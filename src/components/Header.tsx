import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAppStore } from "../stores/useAppStore";
import { Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";

export function SignIn() {
  const { signIn } = useAuthActions();
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => void signIn("github")}
        className="px-3 py-1.5 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => void signIn("google")}
        className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export function SignOut() {
  const { signOut } = useAuthActions();
  
  return (
    <button
      onClick={() => void signOut()}
      className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted"
    >
      Sign out
    </button>
  );
}

export function UserProfileHeader() {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {currentUser.image && (
        <img
          src={currentUser.image}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      )}
      
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-medium">
            {currentUser.name || "No name set"}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentUser.email || "No email set"}
          </p>
        </div>
        <SignOut />
      </div>
    </div>
  );
}

export function Header() {
  const { theme, toggleTheme } = useAppStore();

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold text-foreground">Vite + React + Tailwind Template</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleThemeToggle}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted px-3 py-2 text-sm transition-colors"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <Authenticated>
              <UserProfileHeader />
            </Authenticated>
            <Unauthenticated>
              <SignIn />
            </Unauthenticated>
          </div>
        </div>
      </div>
    </header>
  );
}