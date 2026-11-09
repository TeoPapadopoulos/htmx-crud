import { Html, type PropsWithChildren } from "@elysia/html";
import type { AuthUser } from "@/lib/auth";
import { Nav } from "./nav";

type LayoutProps = PropsWithChildren<{
  title: string;
  user: AuthUser | null;
  currentPath: string;
}>;

export function Layout({ title, user, currentPath, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} · Folio</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/public/css/app.css" />
        <script src="/public/js/htmax.min.js"></script>
      </head>
      <body
        hx-boost="true"
        class="min-h-screen bg-paper font-sans text-ink antialiased"
      >
        <Nav user={user} currentPath={currentPath} />
        <main id="main" class="mx-auto max-w-5xl px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
