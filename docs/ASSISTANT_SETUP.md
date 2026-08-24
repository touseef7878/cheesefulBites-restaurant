# Restaurant Assistant Setup

The handoff package includes a **restaurant-only** assistant. Its browser UI is `src/components/RestaurantAssistant.tsx`; its server-only endpoint is `server/index.mjs`. The assistant uses Groq’s Responses API through the OpenAI-compatible SDK with the fixed model `openai/gpt-oss-20b`.

## Local configuration

Copy `env.template` to `.env.local`, then add the final client’s Groq key only to that local server environment file:

```env
GROQ_API_KEY=your_real_groq_key
```

Run `pnpm dev`. This launches Vite and the Express assistant server together. Vite proxies `/api/restaurant-assistant` to the local server, so the key never reaches browser code.

## Production configuration

Run `pnpm build`, then deploy the folder as a Node application with `pnpm start`. Set `GROQ_API_KEY` in the host’s private server-environment settings. Do not prefix it with `VITE_`, do not commit it, and do not put it in any Supabase browser configuration.

## Behaviour boundary

The endpoint blocks unrelated prompts before calling the model and the server prompt restricts replies to Cheeseful Bites menu, ordering, delivery, location, hours, account, and review information. Change restaurant facts only in `server/index.mjs`, then test both a restaurant question and an unrelated question before deployment.
