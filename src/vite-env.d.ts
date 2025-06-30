/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMINI_BASE_URL: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_OPENROUTER_BASE_URL: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
