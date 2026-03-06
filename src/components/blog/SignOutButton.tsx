'use client';

export function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/auth/signout', { method: 'POST' });
        window.location.href = '/';
      }}
      className="text-muted-foreground hover:text-foreground font-medium transition-colors"
    >
      Sign Out
    </button>
  );
}