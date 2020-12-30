import { Aggregation, Aggregations, Facets, Filter, Filters, SearchResult } from '@/store/modules/search'
import axios, { AxiosResponse } from 'axios'

export class SearchUtil {
  public static async facets (): Promise<Facets> {
    return axios.get('https://s3.eu-west-3.amazonaws.com/entscheidsuche.ch/scraper/Facetten.json')
      .then(resp => SearchUtil.transformResultToFacets(resp))
  }

  public static async search (query: string, filters: Filters, searchAfter?: Array<any>): Promise<[Array<SearchResult>, number, Aggregations | undefined]> {
    const search: any = {
      size: 20,
      query: {
        bool: {
          must: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            query_string: {
              query: query
            }
          }
        }
      },
      sort: [
        { _score: 'desc' },
        { id: 'desc' }
      ],
      highlight: {
        fields: {
          titel: {},
          leitsatz: {},
          'attachment.author': {},
          'attachment.content': {}
        }
      }
    }
    if (Object.keys(filters).length > 0) {
      search.query.bool.filter = SearchUtil.buildFilters(filters)
    }
    if (searchAfter !== undefined) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      search.search_after = searchAfter
    } else {
      search.aggs = {
        hierarchie: {
          terms: {
            size: 1000,
            field: 'hierarchie'
          }
        },
        edatum: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          date_histogram: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            calendar_interval: SearchUtil.getCalendarInterval(filters),
            field: 'edatum'
          }
        }
      }
    }
    return axios.post('https://entscheidsuche.pansoft.de:9200/entscheidsuche-*/_search',
      search,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(resp => SearchUtil.extractSearchResults(resp))
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

  private static buildFilters (filters: Filters): any {
    const filterArray: Array<any> = []
    for (const type in filters) {
      filterArray.push(SearchUtil.buildFilter(filters[type]))
    }

    return filterArray.length === 1 ? filterArray[0] : filterArray
  }

  private static buildFilter (filter: Filter): any {
    if (filter.type === 'edatum') {
      if (filter.payload.from !== undefined && filter.payload.to !== undefined) {
        return {
          range: {
            edatum: {
              gte: filter.payload.from,
              lte: filter.payload.to
            }
          }
        }
      } else if (filter.payload.from !== undefined) {
        return {
          range: {
            edatum: {
              gte: filter.payload.from
            }
          }
        }
      } else if (filter.payload.to !== undefined) {
        return {
          range: {
            edatum: {
              lte: filter.payload.to
            }
          }
        }
      }
    }
    if (filter.type === 'hierarchie') {
      return {
        terms: {
          hierarchie: filter.payload
        }
      }
    }
  }

  private static extractSearchResults (resp: any): [Array<SearchResult>, number, Aggregations | undefined] {
    const results: Array<SearchResult> = []
    let total = 0
    let aggregations: Aggregations | undefined
    if (resp.data !== undefined && resp.data.hits !== undefined && resp.data.hits.hits !== undefined) {
      const hits: Array<any> = resp.data.hits.hits
      total = resp.data.hits.total.value
      for (const hit of hits) {
        let text = ''
        if (hit.highlight !== undefined) {
          text = text.concat(SearchUtil.getExtract(hit.highlight.titel), SearchUtil.getExtract(hit.highlight.leitsatz),
            SearchUtil.getExtract(hit.highlight['attachment.author']), SearchUtil.getExtract(hit.highlight['attachment.content']))
        }
        let date = ''
        if (hit._source.edatum !== undefined && hit._source.edatum.length === 10) {
          date = SearchUtil.formatDate(hit._source.edatum)
        }
        let pdf = false
        pdf = SearchUtil.getDocType(hit._source.attachment.content_type)
        results.push({
          id: hit._id,
          text,
          title: hit._source.titel,
          date,
          canton: hit._source.kanton.toUpperCase(),
          pdf,
          url: hit._source.attachment.content_url,
          sort: hit.sort
        })
      }
      if (resp.data !== undefined && resp.data.aggregations !== undefined) {
        aggregations = {}
        for (const name in resp.data.aggregations) {
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
    return [results, total, aggregations]
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
