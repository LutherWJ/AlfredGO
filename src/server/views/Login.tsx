import type { FC } from 'hono/jsx'

const CONTAINER_STYLE = "max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans text-center"
const TITLE_STYLE = "text-2xl font-bold text-blue-900 mb-2"
const SUBTITLE_STYLE = "text-slate-500 mb-8"
const BUTTON_GROUP_STYLE = "flex flex-col gap-4"
const BUTTON_BASE = "block p-4 text-white no-underline rounded-2xl font-semibold transition-all active:scale-[0.98] active:brightness-90"
const STUDENT_BUTTON = `${BUTTON_BASE} bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200`
const ADMIN_BUTTON = `${BUTTON_BASE} bg-blue-800 hover:bg-blue-900 shadow-lg shadow-blue-300`
const FOOTER_STYLE = "mt-8 text-xs text-slate-400"

export const Login: FC = () => {
  return (
    <div class={CONTAINER_STYLE}>
      <h1 class={TITLE_STYLE}>AlfredGo Mock Login</h1>
      <p class={SUBTITLE_STYLE}>Development & Testing Portal</p>
      
      <div class={BUTTON_GROUP_STYLE}>
        <a href="/auth/dev-login?role=student" class={STUDENT_BUTTON}>
          Login as Mock Student
        </a>
        <a href="/auth/dev-login?role=admin" class={ADMIN_BUTTON}>
          Login as Mock Administrator
        </a>
      </div>
      
      <p class={FOOTER_STYLE}>
        In production, this will use Microsoft Entra ID SSO.
      </p>
    </div>
  )
}
