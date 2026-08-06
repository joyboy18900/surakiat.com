import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import GithubActivityChart from './components/GithubActivityChart.vue'
import './styles/vars.css'
import './styles/base.css'
import './styles/header-footer.css'
import './styles/post.css'
import './styles/about.css'

export default {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    // Registered globally so it's usable directly inside plain Markdown
    // (see about.md) as <GithubActivityChart />.
    app.component('GithubActivityChart', GithubActivityChart)
  },
} satisfies Theme
