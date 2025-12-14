import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAppStore } from "../stores/useAppStore";
import { Sun, Moon, Settings, LogOut, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBillingStatus } from "../hooks/useBillingStatus";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect } from "react";
import { usePostHogAnalytics } from "../hooks/usePostHogAnalytics";


// Syncs user data to cache and provides auth state
function useCachedAuth() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const { user: cachedUser, hydrated, setUser, clear } = useAppStore();

  useEffect(() => {
    if (currentUser === null) clear();
    else if (currentUser) setUser({
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image,
    });
  }, [currentUser, setUser, clear]);

  const hasCached = hydrated && cachedUser !== null;
  const isLoggedIn = hasCached || (currentUser !== undefined && currentUser !== null);
  return { isLoggedIn, displayUser: cachedUser ?? currentUser, hasCached, currentUser };
}


export function SignIn() {
  const { signIn } = useAuthActions();
  const { capture } = usePostHogAnalytics();

  const handleSignIn = (provider: 'github' | 'google') => {
    capture('sign_in_clicked', { provider });
    void signIn(provider);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleSignIn('github')} variant="default" size="sm">Sign in with GitHub</Button>
      <Button onClick={() => handleSignIn('google')} variant="outline" size="sm">Sign in with Google</Button>
    </div>
  );
}

function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "menu" }) {
  const { theme, toggleTheme } = useAppStore();
  const { capture } = usePostHogAnalytics();
  const isDark = theme === "dark";
  const toggle = () => {
    capture('theme_toggled', { from: theme, to: isDark ? 'light' : 'dark' });
    toggleTheme();
    toast.success(`Switched to ${isDark ? "light" : "dark"} mode`);
  };

  if (variant === "menu") {
    return (
      <DropdownMenuItem onClick={toggle}>
        {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      </DropdownMenuItem>
    );
  }
  return (
    <Button onClick={toggle} variant="ghost" size="icon" aria-label="Toggle theme">
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function UserProfileHeader() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const generatePortalUrl = useAction(api.polar.generateCustomerPortalUrl);
  const { displayUser } = useCachedAuth();
  const { capture } = usePostHogAnalytics();

  if (!displayUser) return null;

  const initials = displayUser.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    || displayUser.email?.[0]?.toUpperCase() || "?";

  const handleSignOut = () => {
    capture('sign_out_clicked');
    void signOut();
    toast.success("Signed out");
  };
  const handleSettings = () => {
    capture('settings_clicked', { location: 'header_dropdown' });
    navigate("/settings");
  };
  const handlePortal = async () => {
    capture('customer_portal_clicked', { location: 'header_dropdown' });
    try {
      const r = await generatePortalUrl();
      if (r?.url) window.open(r.url, "_blank");
      else toast.error("Unable to open portal");
    } catch { toast.error("Failed to open portal"); }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {displayUser.image && <AvatarImage src={displayUser.image} alt="Profile" />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{displayUser.name || "No name"}</p>
          <p className="text-xs text-muted-foreground">{displayUser.email || "No email"}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeToggle variant="menu" />
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" /><span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePortal}>
          <CreditCard className="mr-2 h-4 w-4" /><span>Customer Portal</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /><span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusBadge() {
  const { isLoggedIn, hasCached, currentUser } = useCachedAuth();
  const { status, isPremium, isLifetime } = useBillingStatus();

  if (!isLoggedIn || (!hasCached && currentUser === undefined)) return null;

  const label = status === "loading" ? "Checking..." : isLifetime ? "Lifetime" : isPremium ? "Premium" : "Free";
  const variant = (isPremium || isLifetime) ? "default" : status === "loading" ? "secondary" : "outline";
  return <Badge variant={variant}>{label}</Badge>;
}

function AuthSection() {
  const { isLoggedIn } = useCachedAuth();
  return isLoggedIn ? <UserProfileHeader /> : <><ThemeToggle /><SignIn /></>;
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
              Vite + React + Tailwind Template
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/credits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Credits</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge />
            <AuthSection />
          </div>
        </div>
      </div>
    </header>
  );
}
