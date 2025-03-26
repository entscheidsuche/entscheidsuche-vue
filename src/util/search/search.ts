import { Aggregation, Aggregations, Facets, Filter, Filters, SearchResult, SortOrder } from '@/store/modules/search'
import axios, { AxiosResponse } from 'axios'

// const searchUrl = 'https://entscheidsuche.pansoft.de:9200/entscheidsuche.v2-*/_search'
const searchUrl = 'https://entscheidsuche.ch/_searchV2.php'

export class SearchUtil {
  public static async facets (): Promise<Facets> {
    return axios.get('https://entscheidsuche.ch/docs/Facetten.json')
      .then(resp => SearchUtil.transformResultToFacets(resp))
  }

  private static buildDocumentSearch (document: string): any {
    return {
      query: {
        ids: {
          values: [document]
        }
      }
    }
  }

  private static buildPrimarySearch (query: string, lang: string, filters: Filters, sortOrder: SortOrder, searchAfter?: Array<any>): any {
    const search: any = {
      size: 20,
      _source: {
        excludes: ['attachment.content']
      },
      track_total_hits: true,
      query: {
        bool: {
          must: {
            query_string: {
              query: query,
              default_operator: 'AND',
              type: 'cross_fields',
              fields: [
                'title.*^5',
                'abstract.*^3',
                'meta.*^10',
                'attachment.content',
                'reference^3'
              ]
            }
          }
        }
      },
      sort: [
        { [sortOrder === SortOrder.RELEVANCE ? '_score' : sortOrder === SortOrder.DATE ? 'date' : 'scrapedate']: 'desc' },
        { id: 'desc' }
      ],
      highlight: {
        fields: {
          [`title.${lang}`]: {
            number_of_fragments: 0
          },
          [`abstract.${lang}`]: {
            number_of_fragments: 0
          },
          'attachment.content': {}
        }
      }
    }
    if (Object.keys(filters).length > 0) {
      search.query.bool.filter = SearchUtil.buildFilters(filters)
    }
    if (searchAfter !== undefined) {
      search.search_after = searchAfter
    } else {
      if (filters.hierarchie === undefined) {
        if (search.aggs === undefined) {
          search.aggs = {}
        }
        search.aggs.hierarchie = {
          terms: {
            size: 1000,
            field: 'hierarchy'
          }
        }
      }
      if (filters.language === undefined) {
        if (search.aggs === undefined) {
          search.aggs = {}
        }
        search.aggs.language = {
          terms: {
            size: 3,
            field: 'attachment.language'
          }
        }
      }
      if (filters.edatum === undefined) {
        if (search.aggs === undefined) {
          search.aggs = {}
        }
        search.aggs.edatum = {
          date_histogram: {
            calendar_interval: SearchUtil.getCalendarInterval(filters),
            field: 'date'
          }
        }
        search.aggs.min_edatum = {
          min: {
            field: 'date'
          }
        }
        search.aggs.max_edatum = {
          max: {
            field: 'date'
          }
        }
      }
      if (filters.scrapedate === undefined) {
        if (search.aggs === undefined) {
          search.aggs = {}
        }
        search.aggs.scrapedate = {
          date_histogram: {
            calendar_interval: SearchUtil.getScrapeCalendarInterval(filters),
            field: 'scrapedate'
          }
        }
        search.aggs.min_scrapedate = {
          min: {
            field: 'scrapedate'
          }
        }
        search.aggs.max_scrapedate = {
          max: {
            field: 'scrapedate'
          }
        }
      }
    }
    return search
  }

  private static buildAggregationSearch (query: string, filter: Filter, filters: Filters): any {
    const search: any = {
      size: 0,
      query: {
        bool: {
          must: {
            query_string: {
              query: query,
              default_operator: 'AND',
              type: 'cross_fields',
              fields: [
                'title.*^5',
                'abstract.*^3',
                'meta.*^10',
                'attachment.content',
                'reference^3'
              ]
            }
          }
        }
      }
    }
    if (Object.keys(filters).length > 0) {
      search.query.bool.filter = SearchUtil.buildFilters(filters)
    }
    search.aggs = {}
    if (filter.type === 'hierarchie') {
      search.aggs.hierarchie = {
        terms: {
          size: 1000,
          field: 'hierarchy'
        }
      }
    } else if (filter.type === 'language') {
      search.aggs.language = {
        terms: {
          size: 3,
          field: 'attachment.language'
        }
      }
    } else if (filter.type === 'edatum') {
      search.aggs.edatum = {
        date_histogram: {
          calendar_interval: SearchUtil.getCalendarInterval(filters),
          field: 'date'
        }
      }
      search.aggs.min_edatum = {
        min: {
          field: 'date'
        }
      }
      search.aggs.max_edatum = {
        max: {
          field: 'date'
        }
      }
    } else if (filter.type === 'scrapedate') {
      search.aggs.scrapedate = {
        date_histogram: {
          calendar_interval: SearchUtil.getScrapeCalendarInterval(filters),
          field: 'scrapedate'
        }
      }
      search.aggs.min_scrapedate = {
        min: {
          field: 'scrapedate'
        }
      }
      search.aggs.max_scrapedate = {
        max: {
          field: 'scrapedate'
        }
      }
    }
    return search
  }

  public static async search (query: string, lang: string, filters: Filters, sortOrder: SortOrder, searchAfter?: Array<any>): Promise<[Array<SearchResult>, number, Aggregations | undefined]> {
    const primarySearch = this.buildPrimarySearch(query, lang, filters, sortOrder, searchAfter)
    const searches: Array<any> = []
    if (searchAfter === undefined && Object.keys(filters).length > 0) {
      for (const type in filters) {
        const filter = filters[type]
        const remainingFilters = { ...filters }
        delete remainingFilters[type]
        searches.push(this.buildAggregationSearch(query, filter, remainingFilters))
      }
    }
    return axios.post(searchUrl,
      primarySearch,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(resp => {
      const [searchResults, total, aggregations] = SearchUtil.extractSearchResults(resp, lang)
      if (searches.length === 0) {
        return [searchResults, total, aggregations]
      } else {
        return SearchUtil.searchAggs(searches, searchResults, total, aggregations)
      }
    })
  }

  public static async document (document: string, lang: string): Promise<SearchResult | undefined> {
    const documentSearch = this.buildDocumentSearch(document)
    return axios.post(searchUrl,
      documentSearch,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(resp => {
      const [searchResults] = SearchUtil.extractSearchResults(resp, lang)
      return searchResults[0]
    })
  }

  private static searchAggs (searches: Array<any>, searchResults: Array<SearchResult>, total: number, aggregations: Aggregations | undefined): Promise<[Array<SearchResult>, number, Aggregations | undefined]> {
    const search = searches.pop()
    return axios.post(searchUrl,
      search,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(resp => {
      const partialAggregations = SearchUtil.extractAggregations(resp)
      const newAggregations = (partialAggregations !== undefined)
        ? (aggregations !== undefined) ? { ...aggregations, ...partialAggregations } : { ...partialAggregations }
        : aggregations
      if (searches.length === 0) {
        return [searchResults, total, newAggregations]
      } else {
        return SearchUtil.searchAggs(searches, searchResults, total, newAggregations)
      }
    })
  }

  private static getCalendarInterval (filters: Filters): string {
    const filter = filters.edatum
    if (filter !== undefined) {
      if (filter.type === 'edatum') {
        const range = (filter.payload.to - filter.payload.from) / 1000 / 3600 / 24
        if (range < 40) {
          return 'day'
        } else if (range < 280) {
          return 'week'
        } else if (range < 1200) {
          return 'month'
        }
      }
    }
    return 'quarter'
  }

  private static getScrapeCalendarInterval (filters: Filters): string {
    const filter = filters.scrapedate
    if (filter !== undefined) {
      if (filter.type === 'scrapedate') {
        const range = (filter.payload.to - filter.payload.from) / 1000 / 3600 / 24
        if (range < 40) {
          return 'day'
        } else if (range < 280) {
          return 'week'
        } else if (range < 1200) {
          return 'month'
        }
      }
    }
    return 'quarter'
  }

  public static buildFilters (filters: Filters): any {
    // wird auch für den Downloader benötigt
    const filterArray: Array<any> = []
    for (const type in filters) {
      filterArray.push(SearchUtil.buildFilter(filters[type]))
    }

    return filterArray.length === 1 ? filterArray[0] : filterArray
  }

  private static transformDate (milliseconds: number): number | string {
    if (milliseconds >= 0) {
      return milliseconds
    }
    const date = new Date(milliseconds)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  private static buildFilter (filter: Filter): any {
    if (filter.type === 'edatum') {
      if (filter.payload.from !== undefined && filter.payload.to !== undefined) {
        return {
          range: {
            date: {
              gte: SearchUtil.transformDate(filter.payload.from),
              lte: SearchUtil.transformDate(filter.payload.to)
            }
          }
        }
      } else if (filter.payload.from !== undefined) {
        return {
          range: {
            date: {
              gte: SearchUtil.transformDate(filter.payload.from)
            }
          }
        }
      } else if (filter.payload.to !== undefined) {
        return {
          range: {
            date: {
              lte: SearchUtil.transformDate(filter.payload.to)
            }
          }
        }
      }
    }
    if (filter.type === 'scrapedate') {
      if (filter.payload.from !== undefined && filter.payload.to !== undefined) {
        return {
          range: {
            scrapedate: {
              gte: SearchUtil.transformDate(filter.payload.from),
              lte: SearchUtil.transformDate(filter.payload.to)
            }
          }
        }
      } else if (filter.payload.from !== undefined) {
        return {
          range: {
            scrapedate: {
              gte: SearchUtil.transformDate(filter.payload.from)
            }
          }
        }
      } else if (filter.payload.to !== undefined) {
        return {
          range: {
            scrapedate: {
              lte: SearchUtil.transformDate(filter.payload.to)
            }
          }
        }
      }
    }
    if (filter.type === 'hierarchie') {
      return {
        terms: {
          hierarchy: filter.payload
        }
      }
    }
    if (filter.type === 'language') {
      return {
        terms: {
          'attachment.language': filter.payload
        }
      }
    }
  }

  private static extractSearchResults (resp: any, lang: string): [Array<SearchResult>, number, Aggregations | undefined] {
    const results: Array<SearchResult> = []
    let total = 0
    let aggregations: Aggregations | undefined
    if (resp.data !== undefined && resp.data.hits !== undefined && resp.data.hits.hits !== undefined) {
      const hits: Array<any> = resp.data.hits.hits
      total = resp.data.hits.total.value
      for (const hit of hits) {
        let text = ''
        let title = hit._source.title !== undefined ? hit._source.title[lang] : ''
        let _abstract = hit._source.abstract !== undefined ? hit._source.abstract[lang] : ''
        if (hit.highlight !== undefined) {
          text = SearchUtil.getExtract(hit.highlight['attachment.content'])
          if (hit.highlight[`title.${lang}`] !== undefined) {
            title = SearchUtil.getExtract(hit.highlight[`title.${lang}`])
          }
          if (hit.highlight[`abstract.${lang}`] !== undefined) {
            _abstract = SearchUtil.getExtract(hit.highlight[`abstract.${lang}`])
          }
        }
        let date = ''
        if (hit._source.date !== undefined && hit._source.date.length === 10) {
          date = SearchUtil.formatDate(hit._source.date)
        }
        let scrapedate: string | undefined
        if (hit._source.scrapedate !== undefined && hit._source.scrapedate.length === 10) {
          scrapedate = SearchUtil.formatDate(hit._source.scrapedate)
        } else {
          scrapedate = undefined
        }
        const pdf = SearchUtil.getDocType(hit._source.attachment.content_type)
        results.push({
          id: hit._id,
          text,
          title,
          abstract: _abstract,
          date,
          canton: hit._source.canton.toUpperCase(),
          pdf,
          url: hit._source.attachment.content_url,
          sort: hit.sort,
          scrapedate: scrapedate
        })
      }
      aggregations = SearchUtil.extractAggregations(resp)
    }
    return [results, total, aggregations]
  }

  private static extractAggregations (resp: AxiosResponse<any>): Aggregations | undefined {
    let aggregations: Aggregations | undefined
    if (resp.data !== undefined && resp.data.aggregations !== undefined) {
      aggregations = {}
      for (const name in resp.data.aggregations) {
        if (name.startsWith('min_') || name.startsWith('max_')) {
          const aggs: Array<Aggregation> = []
          aggs.push({
            key: resp.data.aggregations[name].value,
            count: 1
          })
          aggregations[name] = aggs
        } else {
          const buckets = resp.data.aggregations[name].buckets
          if (buckets !== undefined) {
            const aggs: Array<Aggregation> = []
            for (const agg of buckets) {
              aggs.push({
                key: agg.key,
                count: agg.doc_count
              })
            }
            aggregations[name] = aggs
          }
        }
      }
    }
    return aggregations
  }

  private static getExtract (highlight: Array<string>): string {
    let text = ''
    if (highlight !== undefined) {
      for (const a of highlight) {
        text = text.concat(a, ' ')
      }
    }
    return text
  }

  private static formatDate (date: string): string {
    let newDate = ''
    newDate = date.slice(8, 10) + '.' + date.slice(5, 7) + '.' + date.slice(0, 4)
    return newDate
  }

  private static getDocType (type: string): boolean {
    let docType = false
    if (type !== undefined) {
      if (type === 'application/pdf') {
        docType = true
      }
    }
    return docType
  }

  private static transformResultToFacets (resp: AxiosResponse<any>): Facets {
    if (resp.data !== undefined) {
      const facets: Facets = []
      for (const key in resp.data) {
        const facet = resp.data[key]
        const firstLevelChildren: Facets = []
        for (const secondKey in facet.gerichte) {
          const secondFacet = facet.gerichte[secondKey]
          const secondLevelChildren: Facets = []
          for (const thirdKey in secondFacet.kammern) {
            const thirdFacet = secondFacet.kammern[thirdKey]
            secondLevelChildren.push({
              id: thirdKey,
              label: {
                de: thirdFacet.de,
                fr: thirdFacet.fr,
                it: thirdFacet.it
              }
            })
          }
          if (secondLevelChildren.length === 1) {
            firstLevelChildren.push({
              id: secondKey,
              label: {
                de: secondFacet.de,
                fr: secondFacet.fr,
                it: secondFacet.it
              }
            })
          } else {
            firstLevelChildren.push({
              id: secondKey,
              label: {
                de: secondFacet.de,
                fr: secondFacet.fr,
                it: secondFacet.it
              },
              children: secondLevelChildren
            })
          }
        }
        facets.push({
          id: key,
          label: {
            de: facet.de,
            fr: facet.fr,
            it: facet.it
          },
          children: firstLevelChildren
        })
      }
      return facets
    }
    return []
  }
}
