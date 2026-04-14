import type { FC } from 'hono/jsx'

// Style Constants
const PAGE_CONTAINER = "max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4"
const TITLE_TEXT = "text-2xl font-bold text-center text-blue-800"
const SUBTITLE_TEXT = "text-center text-gray-600"
const ACTION_CONTAINER = "flex justify-center mt-6"
const BUTTON_PRIMARY = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
const STATUS_CONTAINER = "mt-4 p-4 text-center rounded-lg bg-gray-50 border border-gray-200 min-h-[56px] flex items-center justify-center"

export const Home: FC = () => {
  return (
    <div class={PAGE_CONTAINER}>
      <h1 class={TITLE_TEXT}>AlfredGo Directory</h1>
      <p class={SUBTITLE_TEXT}>The centralized campus software directory.</p>
      
      <div class={ACTION_CONTAINER}>
          <button 
            hx-get="/api/health" 
            hx-target="#status" 
            class={BUTTON_PRIMARY}
          >
              Check Server Health
          </button>
      </div>
      <div id="status" class={STATUS_CONTAINER}>
          Waiting for status...
      </div>
    </div>
  )
}
