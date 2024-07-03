import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    // <link rel="stylesheet" href="https://unpkg.com/keyboard-css@1.2.4/dist/css/main.min.css" />
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://unpkg.com/keyboard-css@1.2.4/dist/css/main.min.css",
      },
    ],
  ],
  title: "AQS's Docker workshop",
  description: "Workshop details ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "Workshop",
        items: [
          { text: "01. Installation", link: "/installing" },
          { text: "02. Knowing Docker Concepts", link: "/concepts" },
          { text: "03. What & Why", link: "/what-and-why" },
          { text: "04. Docker basic commands", link: "/cli" },
          { text: "05. Hands-on React + Vite + TS", link: "/hands-on-react" },
          { text: "06. Multi-stage", link: "/multi-stage" },
          { text: "07. Hands-on Backend", link: "/hands-on-backend" },
          { text: "08. Volumes", link: "/volumes" },
          { text: "09. Hands-on SSR Next", link: "/hands-on-next" },
          { text: "10. Networks", link: "/network" },
          { text: "11. Docker compose", link: "/docker-compose" },
          { text: "12. Postgres example", link: "/postgres-example" },
          { text: "13. Portainer", link: "/portainer" },
          { text: "14. Caddy reverse proxy", link: "/caddy" },
          { text: "15. Non-root user", link: "/non-root" },
          { text: "16. Docker prune", link: "/prune" },
          // { text: "Markdown Examples", link: "/markdown-examples" },
          // { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/seenark" }],
    search: {
      provider: "local",
    },
  },
});