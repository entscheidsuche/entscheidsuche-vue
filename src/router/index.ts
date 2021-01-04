import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import SearchResults from '@/views/SearchResults.vue'
import { SearchModule, SortOrder } from '@/store/modules/search'
import { sync } from 'vuex-router-sync'
import { store } from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchResults,
    beforeEnter: (to, from, next) => {
      if (to.query.filter !== undefined && typeof to.query.filter === 'string') {
        SearchModule.SetFilters([to.query.filter])
      } else if (to.query.filter !== undefined && Array.isArray(to.query.filter)) {
        SearchModule.SetFilters(to.query.filter as Array<string>)
      } else {
        SearchModule.SetFilters([])
      }
      if (to.query.sort !== undefined && typeof to.query.sort === 'string') {
        SearchModule.SetSortOrder(to.query.sort === SortOrder.DATE ? SortOrder.DATE : SortOrder.RELEVANCE)
      } else {
        SearchModule.SetSortOrder(SortOrder.RELEVANCE)
      }
      if (to.query.query !== undefined && typeof to.query.query === 'string') {
        SearchModule.SetQuery(to.query.query)
      }
      next()
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/organization',
    name: 'Organization',
    component: () => import('../views/Organization.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../views/Upload.vue')
  },
  {
    path: '/dataUsage',
    name: 'DataUsage',
    component: () => import('../views/DataUsage.vue')
  },
  {
    path: '/status',
    name: 'Status',
    component: () => import('../views/Status.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Search' && from.name === 'Search') {
    const clearQuery = SearchModule.SetQuery('')
    if (clearQuery !== undefined) {
      clearQuery.then(() => next())
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

sync(store, router)
