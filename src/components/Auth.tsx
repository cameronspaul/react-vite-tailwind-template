import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "./ui/button";

export function SignIn() {
  const { signIn } = useAuthActions();

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => void signIn("github")}
        variant="default"
        className="w-full"
      >
        Sign in with GitHub
      </Button>
      <Button
        onClick={() => void signIn("google")}
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

  return (
    <Button
      onClick={() => void signOut()}
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