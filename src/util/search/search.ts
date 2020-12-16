import { SearchResult } from '@/store/modules/search'
import axios from 'axios'

export class SearchUtil {
  public static async search (query: string): Promise<Array<SearchResult>> {
    return axios.post('https://entscheidsuche.pansoft.de:9200/entscheidsuche-*/_search',
      {
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
      },
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(resp => SearchUtil.extractSearchResults(resp))
  }

  private static extractSearchResults (resp: any): Array<SearchResult> {
    const results: Array<SearchResult> = []
    console.log(resp)
    if (resp.data !== undefined && resp.data.hits !== undefined && resp.data.hits.hits !== undefined) {
      const hits: Array<any> = resp.data.hits.hits
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
        results.push({
          id: hit._id,
          text,
          title: hit._source.titel,
          date,
          canton: hit._source.kanton.toUpperCase()
        })
      }
    }
    return results
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
}
