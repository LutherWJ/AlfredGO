import type { FC, Child } from 'hono/jsx'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SearchInput } from './components/SearchInput'

interface HomeProps {
    children: Child;
}

const LAYOUT_STYLE = "min-h-screen bg-background"
const STICKY_SEARCH_STYLE = "sticky top-19 z-40 bg-background pt-4 pb-2 max-w-lg mx-auto"
const MAIN_STYLE = "max-w-lg mx-auto pb-6"

export const Home: FC<HomeProps> = ({ children }) => {
    return (
        <div class={LAYOUT_STYLE}>
            <Header />

            {/* Sticky Search Container */}
            <div class={STICKY_SEARCH_STYLE}>
                <SearchInput />
            </div>

            <main class={MAIN_STYLE}>
                {/* Global Search Results Placeholder */}
                <div id="search-results"></div>
                
                <div id="main-content">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    )
}
