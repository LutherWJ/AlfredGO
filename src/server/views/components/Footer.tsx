import type { FC } from 'hono/jsx'
import { Icons } from './Icons'

const LOGOUT_CONTAINER = "max-w-lg mx-auto px-4 pb-4"
const LOGOUT_BUTTON_STYLE = "w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 active:bg-destructive/20 active:scale-[0.98] px-4 py-3 text-destructive font-medium transition-all"
const FOOTER_STYLE = "max-w-lg mx-auto px-4 py-6 border-t border-border"
const FOOTER_TEXT_PRIMARY = "text-xs text-muted-foreground text-center"
const FOOTER_TEXT_SECONDARY = "text-xs text-muted-foreground/70 text-center mt-1"

export const Footer: FC = () => {
  return (
    <>
      <div class={LOGOUT_CONTAINER}>
        <a
          href="/auth/logout"
          class={LOGOUT_BUTTON_STYLE}
        >
          <Icons.LogOut class="h-5 w-5" />
          <span>Log Out</span>
        </a>
      </div>

      <footer class={FOOTER_STYLE}>
        <p class={FOOTER_TEXT_PRIMARY}>
          Need help? Contact IT Services at helpdesk@alfredstate.edu
        </p>
        <p class={FOOTER_TEXT_SECONDARY}>
          Alfred State College &bull; SUNY College of Technology
        </p>
      </footer>
    </>
  )
}
