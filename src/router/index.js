import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import NotFound from '@/components/error/NotFound'
import SearchResults from '@/components/SearchResults'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
