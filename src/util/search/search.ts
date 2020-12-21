import { SearchResult } from '@/store/modules/search'
import axios from 'axios'

export class SearchUtil {
  public static async search (query: string, searchAfter?: Array<any>): Promise<[Array<SearchResult>, number]> {
    const search: any = {
      size: 20,
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        query_string: {
          query: query
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
    if (searchAfter !== undefined) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      search.search_after = searchAfter
    }
    return axios.post('https://entscheidsuche.pansoft.de:9200/entscheidsuche-*/_search',
      search,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(resp => SearchUtil.extractSearchResults(resp))
  }

  private static extractSearchResults (resp: any): [Array<SearchResult>, number] {
    const results: Array<SearchResult> = []
    let total = 0
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
    }
    return [results, total]
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
}
