import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAppStore } from "../stores/useAppStore";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useBillingStatus } from "../hooks/useBillingStatus";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function SignIn() {
  const { signIn } = useAuthActions();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => void signIn("github")}
        variant="default"
        size="sm"
      >
        Sign in with GitHub
      </Button>
      <Button
        onClick={() => void signIn("google")}
        variant="outline"
        size="sm"
      >
        Sign in with Google
      </Button>
    </div>
  );
}

export function SignOut() {
  const { signOut } = useAuthActions();

  return (
    <Button
      onClick={() => void signOut()}
      variant="outline"
      size="sm"
    >
      Sign out
    </Button>
  );
}

export function UserProfileHeader() {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (!currentUser) {
    return null;
  }

  // Get initials for avatar fallback
  const initials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-10">
        {currentUser.image && (
          <AvatarImage src={currentUser.image} alt="Profile" />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

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
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
              Vite + React + Tailwind Template
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge />
            <Button
              onClick={handleThemeToggle}
              variant="outline"
              size="sm"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </Button>
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

function StatusBadge() {
  const { status, isPremium, isLifetime } = useBillingStatus();

  const label =
    status === "loading"
      ? "Checking..."
      : isLifetime
        ? "Lifetime"
        : isPremium
          ? "Premium"
          : "Free";

  const variant =
    label === "Premium" || label === "Lifetime"
      ? "default"
      : label === "Checking..."
        ? "secondary"
        : "outline";

  return (
    <Badge variant={variant} className={
      label === "Premium" || label === "Lifetime"
        ? "bg-emerald-500 text-white hover:bg-emerald-600"
        : undefined
    }>
      {label}
    </Badge>
  );
}
