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
    if (resp.data !== undefined && resp.data.hits !== undefined && resp.data.hits.hits !== undefined) {
      const hits: Array<any> = resp.data.hits.hits
      for (const hit of hits) {
        results.push({
          id: hit._id
        })
      }
    }
    return results
  }
}
