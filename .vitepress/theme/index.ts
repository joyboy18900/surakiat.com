import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import './styles/vars.css'
import './styles/base.css'
import './styles/header-footer.css'
import './styles/post.css'
import './styles/about.css'

export default {
  Layout,
  NotFound,
  enhanceApp() {
    // No global components/directives needed yet.
  },
} satisfies Theme
