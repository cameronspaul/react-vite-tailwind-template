import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";

export function SignIn() {
  const { signIn } = useAuthActions();
  
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => void signIn("github")}
        className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => void signIn("google")}
        className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
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
      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
    >
      Sign out
    </button>
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