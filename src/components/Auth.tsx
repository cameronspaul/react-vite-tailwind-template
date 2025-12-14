import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "./ui/button";
import { usePostHogAnalytics } from "../hooks/usePostHogAnalytics";

export function SignIn() {
  const { signIn } = useAuthActions();
  const { capture } = usePostHogAnalytics();

  const handleSignIn = (provider: 'github' | 'google') => {
    capture('sign_in_clicked', { provider, location: 'auth_component' });
    void signIn(provider);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => handleSignIn('github')}
        variant="default"
        className="w-full"
      >
        Sign in with GitHub
      </Button>
      <Button
        onClick={() => handleSignIn('google')}
        variant="outline"
        className="w-full"
      >
        Sign in with Google
      </Button>
    </div>
  );
}

export function SignOut() {
  const { signOut } = useAuthActions();
  const { capture } = usePostHogAnalytics();

  const handleSignOut = () => {
    capture('sign_out_clicked', { location: 'auth_component' });
    void signOut();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
    >
      Sign out
    </Button>
  );
}

export function AuthButton() {
  return (
    <>
      <Authenticated>
        <SignOut />
      </Authenticated>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
    </>
  );
}
