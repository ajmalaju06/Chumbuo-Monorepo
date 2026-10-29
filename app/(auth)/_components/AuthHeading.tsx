export function AuthHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-10">
      <h1 className="text-h1">{title}</h1>
      {children && <p className="mt-4 text-ink-muted">{children}</p>}
    </header>
  );
}

/** Holds the form's space while the session check streams in. */
export function FormFallback() {
  return <div aria-busy="true" className="h-72" />;
}
