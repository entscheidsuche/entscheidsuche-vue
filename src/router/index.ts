import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import SearchResults from '@/views/SearchResults.vue'
import { SearchModule, SortOrder } from '@/store/modules/search'
import { sync } from 'vuex-router-sync'
import { store } from '@/store'
import { AppModule } from '@/store/modules/app'
import { getStartingLocale } from '@/i18n'

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
        SearchModule.SetSortOrder(to.query.sort === SortOrder.DATE ? SortOrder.DATE : to.query.sort === SortOrder.SCRAPEDATE ? SortOrder.SCRAPEDATE : SortOrder.RELEVANCE)
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
    path: '/view/:doc',
    name: 'View',
    component: SearchResults,
    beforeEnter: (to, from, next) => {
      if (to.params.doc !== undefined && SearchModule.document !== to.params.doc) {
        const result = SearchModule.SetDocument(to.params.doc)
        if (result !== undefined) {
          result.then(() => next())
        } else {
          next()
        }
      } else {
        next()
      }
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
    component: () => import('../views/About.vue')
  },
  {
    path: '/suchhilfe',
    name: 'Suchhilfe',
    component: () => import('../views/Suchhilfe.vue')
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
  },
  {
    path: '/datenschutz',
    name: 'Datenschutz',
    component: () => import('../views/Datenschutz.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if ((to.name !== 'Search' && to.name !== 'View') && from.name === 'Search') {
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

router.beforeEach((to, from, next) => {
  if (to.query.lang !== undefined && AppModule.locale !== to.query.lang) {
    const setLocale = AppModule.SetLocale(to.query.lang as string)
    if (setLocale !== undefined) {
      setLocale.then(() => next())
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.query.lang === undefined && AppModule.locale !== getStartingLocale()) {
    if (to.path !== from.path) {
      const newQuery = { ...to.query }
      newQuery.lang = AppModule.locale
      next({ path: to.path, name: to.name !== null ? to.name : undefined, query: newQuery })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

sync(store, router)
