import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/components/HomePage'
import NotFound from '@/components/error/NotFound'
import SearchResults from '@/components/SearchResults'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
