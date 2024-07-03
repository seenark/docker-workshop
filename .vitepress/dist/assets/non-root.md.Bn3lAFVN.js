import{_ as n,c as s,o as a,a4 as p}from"./chunks/framework.BzdiqRf3.js";const k=JSON.parse('{"title":"Non-root user (Rootless)","description":"","frontmatter":{},"headers":[],"relativePath":"non-root.md","filePath":"non-root.md"}'),e={name:"non-root.md"},l=p(`<h1 id="non-root-user-rootless" tabindex="-1">Non-root user (Rootless) <a class="header-anchor" href="#non-root-user-rootless" aria-label="Permalink to &quot;Non-root user (Rootless)&quot;">​</a></h1><h2 id="problem" tabindex="-1">Problem <a class="header-anchor" href="#problem" aria-label="Permalink to &quot;Problem&quot;">​</a></h2><p>ใน Linux root-user จะทำงานได้ทุกอย่างเพราะมีสิทธิ์เป็นเหมือน admin เลย ใน Docker ก็เหมือนกันเพราะทำ Linux อีกที ถ้าเกิดว่า Container เราโดนเจาะ แล้ว container นั้นใช้ root user ในการรัน command ต่างๆ ก็เท่ากับว่าคนที่เจาะเข้ามาได้ ได้สิทธิ์ admin ไปเลยในทันที และ Docker deamon มันทำงานด้วยสิทธิ์ root อยู่แล้วก็มีโอกาสเสี่ยงที่คนเจาะจะออกมาที่ docker daemon ได้แล้วควบคุมเครื่อง Host ได้อีกที</p><p>ฉนั้นเราจะป้องกันไว้ก่อนด้วยการเปลี่ยนไปใช้ non-root user แทน การใช้ non-root user จะทำให้สิทธิ์ในการใช้งาน Container ลดลง เราจะให้ใช้สิทธิ์เท่าที่จำเป็น เป็นการจำกัดสิทธิ์ในการใช้งานไว้</p><h2 id="uid-gid" tabindex="-1">UID &amp; GID <a class="header-anchor" href="#uid-gid" aria-label="Permalink to &quot;UID &amp; GID&quot;">​</a></h2><p>user ใน Linux จะประกอบไปด้วย 2 ส่วน</p><ol><li>UID = User ID</li><li>GID = Group ID</li></ol><p>สร้าง group ด้วยคำสั่ง</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addgroup</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --system</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --gid</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1001</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nodejs</span></span></code></pre></div><p>สร้าง user ด้วยคำสั่ง</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">adduser</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --system</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --uid</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1001</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nonroot\`</span></span></code></pre></div><h2 id="nextjs-dockerfile" tabindex="-1">NextJS Dockerfile <a class="header-anchor" href="#nextjs-dockerfile" aria-label="Permalink to &quot;NextJS Dockerfile&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark has-highlighted vp-code" tabindex="0"><code><span class="line"><span>FROM node:18-alpine AS base</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Install dependencies only when needed</span></span>
<span class="line"><span>FROM base AS deps</span></span>
<span class="line"><span># Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.</span></span>
<span class="line"><span>RUN apk add --no-cache libc6-compat</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Install dependencies based on the preferred package manager</span></span>
<span class="line"><span>COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./</span></span>
<span class="line"><span>RUN \\</span></span>
<span class="line"><span>  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\</span></span>
<span class="line"><span>  elif [ -f package-lock.json ]; then npm ci; \\</span></span>
<span class="line"><span>  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm &amp;&amp; pnpm i --frozen-lockfile; \\</span></span>
<span class="line"><span>  else echo &quot;Lockfile not found.&quot; &amp;&amp; exit 1; \\</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># Rebuild the source code only when needed</span></span>
<span class="line"><span>FROM base AS builder</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>COPY --from=deps /app/node_modules ./node_modules</span></span>
<span class="line"><span>COPY . .</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Next.js collects completely anonymous telemetry data about general usage.</span></span>
<span class="line"><span># Learn more here: https://nextjs.org/telemetry</span></span>
<span class="line"><span># Uncomment the following line in case you want to disable telemetry during the build.</span></span>
<span class="line"><span># ENV NEXT_TELEMETRY_DISABLED 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RUN \\</span></span>
<span class="line"><span>  if [ -f yarn.lock ]; then yarn run build; \\</span></span>
<span class="line"><span>  elif [ -f package-lock.json ]; then npm run build; \\</span></span>
<span class="line"><span>  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm &amp;&amp; pnpm run build; \\</span></span>
<span class="line"><span>  else echo &quot;Lockfile not found.&quot; &amp;&amp; exit 1; \\</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Production image, copy all the files and run next</span></span>
<span class="line"><span>FROM base AS runner</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ENV NODE_ENV production</span></span>
<span class="line"><span># Uncomment the following line in case you want to disable telemetry during runtime.</span></span>
<span class="line"><span># ENV NEXT_TELEMETRY_DISABLED 1</span></span>
<span class="line"><span></span></span>
<span class="line highlighted warning"><span>RUN addgroup --system --gid 1001 nodejs</span></span>
<span class="line highlighted warning"><span>RUN adduser --system --uid 1001 nextjs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>COPY --from=builder /app/public ./public</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Set the correct permission for prerender cache</span></span>
<span class="line"><span>RUN mkdir .next</span></span>
<span class="line highlighted warning"><span>RUN chown nextjs:nodejs .next</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Automatically leverage output traces to reduce image size</span></span>
<span class="line"><span># https://nextjs.org/docs/advanced-features/output-file-tracing</span></span>
<span class="line highlighted warning"><span>COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./</span></span>
<span class="line highlighted warning"><span>COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static</span></span>
<span class="line"><span></span></span>
<span class="line highlighted warning"><span>USER nextjs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EXPOSE 3000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ENV PORT 3000</span></span>
<span class="line"><span></span></span>
<span class="line"><span># server.js is created by next build from the standalone output</span></span>
<span class="line"><span># https://nextjs.org/docs/pages/api-reference/next-config-js/output</span></span>
<span class="line"><span>CMD HOSTNAME=&quot;0.0.0.0&quot; node server.js</span></span></code></pre></div><p>จะเห็นว่า Dockerfile ที่ Next เตรียมมาให้แล้วมันใส่ User + Group มาให้ครบแล้ว ซึ่งเป็นตัวอย่างที่ดีมากๆ ถ้าใครต้องเขียน Dockerfile เอง เอา Dockerfile ของ Next เป็นตัวอย่างได้เลย ดีมากๆ</p><h2 id="let-s-update-backend-s-dockerfile" tabindex="-1">Let&#39;s update backend&#39;s Dockerfile <a class="header-anchor" href="#let-s-update-backend-s-dockerfile" aria-label="Permalink to &quot;Let&#39;s update backend&#39;s Dockerfile&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark has-diff vp-code" tabindex="0"><code><span class="line"><span># syntax=docker/dockerfile:1</span></span>
<span class="line"><span>ARG NODE_VERSION=22.2.0</span></span>
<span class="line"><span>ARG PNPM_VERSION=8.15.5</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Build</span></span>
<span class="line"><span>FROM node:\${NODE_VERSION}-alpine AS build</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Install pnpm.</span></span>
<span class="line"><span>RUN --mount=type=cache,target=/root/.npm \\</span></span>
<span class="line"><span>  npm install -g pnpm@\${PNPM_VERSION}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RUN --mount=type=bind,source=package.json,target=package.json \\</span></span>
<span class="line"><span>  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \\</span></span>
<span class="line"><span>  --mount=type=cache,target=/root/.local/share/pnpm/store \\</span></span>
<span class="line"><span>  pnpm install --frozen-lockfile</span></span>
<span class="line"><span></span></span>
<span class="line"><span>COPY . .</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RUN pnpm run build &amp;&amp; pnpm prune --prod</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Final</span></span>
<span class="line"><span>FROM node:\${NODE_VERSION}-alpine AS runner</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ENV NODE_ENV=production</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># add nonroot user and group</span></span>
<span class="line diff add"><span>RUN addgroup --system --gid 1001 nodejs &amp;&amp; adduser --system --uid 1001 nonroot</span></span>
<span class="line"><span></span></span>
<span class="line"><span># make uploads folder </span></span>
<span class="line diff add"><span>RUN mkdir -p ./uploads &amp;&amp; chmod 700 ./uploads &amp;&amp; chown -R nonroot:nodejs ./uploads</span></span>
<span class="line"><span></span></span>
<span class="line"><span># when copy use flag --chown=&lt;user&gt;:&lt;group&gt;</span></span>
<span class="line diff add"><span>COPY --from=build --chown=nonroot:nodejs /app/dist ./dist</span></span>
<span class="line diff add"><span>COPY --from=build --chown=nonroot:nodejs /app/node_modules ./node_modules</span></span>
<span class="line diff add"><span>COPY --from=build --chown=nonroot:nodejs /app/package.json ./package.json</span></span>
<span class="line"><span></span></span>
<span class="line"><span># finally use nonroot user</span></span>
<span class="line"><span>USER nonroot</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EXPOSE 3333</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CMD [&quot;node&quot;, &quot;dist/index.js&quot;]</span></span></code></pre></div>`,16),i=[l];function o(t,c,d,r,h,u){return a(),s("div",null,i)}const g=n(e,[["render",o]]);export{k as __pageData,g as default};
