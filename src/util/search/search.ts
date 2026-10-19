import { Aggregation, Aggregations, Facets, Filter, Filters, FilterType, SearchResult, SortOrder } from '@/store/modules/search'
import axios, { AxiosResponse } from 'axios'
import _ from 'lodash'

const searchUrl = `${process.env.VUE_APP_SEARCH_URL}`
// Big chunks and micro chunks are embedded with different models, so a query needs one embedding per model.
const embedBigUrl = `${process.env.VUE_APP_EMBED_BIG_API_URL}`
const embedBigModel = `${process.env.VUE_APP_EMBED_BIG_MODEL}`
const embedMicroUrl = `${process.env.VUE_APP_EMBED_MICRO_API_URL}`
const embedMicroModel = `${process.env.VUE_APP_EMBED_MICRO_MODEL}`
// Qwen3-Embedding expects an instruction on the query side only (documents are embedded without one).
const queryInstruction = 'Given a legal search query, retrieve relevant passages of court decisions that answer the query'
const embeddingSearchUrl = `${process.env.VUE_APP_EMBEDDING_SEARCH_URL}`
const embeddingMicroSearchUrl = `${process.env.VUE_APP_EMBEDDING_MICRO_SEARCH_URL}`
const indexMicroChunksUrl = `${process.env.VUE_APP_INDEX_MICRO_CHUNK_URL}`

// Fields copied from the per-page detail requests of the AI search (see addPageDetails).
const PAGE_DETAIL_FIELDS = ['title', 'abstract', 'bigChunkText', 'text', 'textOffset', 'textLength', 'microChunks']

export class SearchUtil {
  // Page details already loaded for the current AI search (by document id), so that paging and
  // static filtering do not load them again. Reset by every new AI search.
  private static pageDetails = new Map<string, any>()
  private static microEmbeddingCache: { query: string, embedding: number[] } | undefined

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

  public static async aiSearch (query: string, lang: string, filters: Filters, sortOrder: SortOrder, totalSize: number, pageSize: number): Promise<any> {
    this.pageDetails = new Map<string, any>()
    const [embedding, microEmbedding] = await Promise.all([
      this.getEmbedding(query, embedBigUrl, embedBigModel),
      this.getEmbedding(query, embedMicroUrl, embedMicroModel)
    ])
    this.microEmbeddingCache = { query, embedding: microEmbedding }
    const embeddingSearch = this.buildEmbeddingSearch(embedding, totalSize, filters)
    const matches = new Map<string, string>()
    const chunkScores = new Map<string, number>()
    await axios.post(embeddingSearchUrl, embeddingSearch, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }).then(resp => {
      if (resp.data !== undefined && resp.data.hits !== undefined && resp.data.hits.hits !== undefined) {
        // Hits are sorted by score (descending): keep the first, i.e. best, chunk per document.
        resp.data.hits.hits.forEach(hit => {
          const documentId = hit.fields.documentId[0]
          if (!matches.has(documentId)) {
            matches.set(documentId, hit._id)
            chunkScores.set(documentId, hit._score)
          }
        })
      }
    })
    const termSearch = this.buildTermSearch(Array.from(matches.keys()), lang, filters, sortOrder, totalSize)
    let searchResults, total, aggregations
    [searchResults, total, aggregations] = await axios.post(searchUrl,
      termSearch,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(async resp => {
      [searchResults, total, aggregations] = SearchUtil.extractSearchResults(resp, lang)
      return [searchResults, total, aggregations]
    })

    for (const sr of searchResults) {
      const score = <number>chunkScores.get(sr.id)
      sr.score = score
      sr.bigChunkId = <string>matches.get(sr.id)
    }

    searchResults = searchResults.sort((sr1, sr2) => sr2.score - sr1.score)

    await this.addPageDetails(searchResults.slice(0, pageSize), query, lang)
    return [searchResults, total, aggregations]
  }

  public static async aiGetMoreResults (allResults: Array<any>, pageNumber, pageSize, queryString, lang: string): Promise<any> {
    const newResults = [allResults[0].map(sr => ({ ...sr })), allResults[1], allResults[2]]
    if (pageNumber * pageSize < newResults[0].length) {
      newResults[0] = newResults[0].slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    } else if (pageNumber * (pageSize - 1) < newResults[0].length) {
      newResults[0] = newResults[0].slice((pageNumber - 1) * pageSize, newResults[0].length)
    } else {
      newResults[0] = []
    }
    await this.addPageDetails(newResults[0], queryString, lang)
    return newResults
  }

  // The AI search loads only lean data for all results (ranking, filter tree). The details needed to
  // display a page (title, abstract, big chunk text, micro chunks) are loaded per page.
  private static async addPageDetails (pageResults: Array<SearchResult>, query: string, lang: string): Promise<void> {
    for (const sr of pageResults) {
      const cached = this.pageDetails.get(sr.id)
      if (cached !== undefined) {
        Object.assign(sr, cached)
      }
    }
    const results = pageResults.filter(sr => !this.pageDetails.has(sr.id))
    if (results.length === 0) return
    const documentDetails = axios.post(searchUrl, {
      size: results.length,
      _source: { includes: ['title', 'abstract'] },
      query: { ids: { values: results.map(sr => sr.id) } }
    }).then(resp => {
      const byId = new Map<string, any>(resp.data.hits.hits.map(hit => [hit._id, hit._source]))
      for (const sr of results) {
        const source = byId.get(sr.id)
        if (source !== undefined) {
          sr.title = source.title !== undefined ? source.title[lang] : ''
          sr.abstract = source.abstract !== undefined ? source.abstract[lang] : ''
        }
      }
    })
    const bigChunkTexts = axios.post(embeddingSearchUrl, {
      size: results.length,
      _source: false,
      fields: ['chunkText'],
      query: { ids: { values: results.map(sr => sr.bigChunkId).filter(id => id) } }
    }).then(resp => {
      const byId = new Map<string, string>(resp.data.hits.hits.map(hit => [hit._id, hit.fields.chunkText[0]]))
      for (const sr of results) {
        sr.bigChunkText = byId.get(sr.bigChunkId) || ''
      }
    })
    const microChunks = this.getMicroEmbedding(query).then(microEmbedding => this.addBestMicroChunks(results, microEmbedding))
    await Promise.all([documentDetails, bigChunkTexts, microChunks])
    for (const sr of results) {
      this.pageDetails.set(sr.id, _.pick(sr, PAGE_DETAIL_FIELDS))
    }
  }

  private static async getMicroEmbedding (query: string): Promise<number[]> {
    if (this.microEmbeddingCache === undefined || this.microEmbeddingCache.query !== query) {
      this.microEmbeddingCache = { query, embedding: await this.getEmbedding(query, embedMicroUrl, embedMicroModel) }
    }
    return this.microEmbeddingCache.embedding
  }

  // --- Static filtering of AI search results in the browser ---

  // True if the document matches all filters (optionally ignoring one filter type).
  public static matchesFilters (sr: SearchResult, filters: Filters, ignoreType?: string): boolean {
    for (const type in filters) {
      if (type === ignoreType) continue
      const filter = filters[type]
      if (filter.type === FilterType.HIERARCHY) {
        if (!filter.payload.some((id: string) => (sr.hierarchy || []).includes(id))) return false
      } else if (filter.type === FilterType.LANGUAGE) {
        if (!filter.payload.includes(sr.language)) return false
      } else if (filter.type === FilterType.DATE || filter.type === FilterType.SCRAPEDATE) {
        const value = filter.type === FilterType.DATE ? sr.dateMs : sr.scrapedateMs
        if (value === undefined) return false
        if (filter.payload.from !== undefined && value < filter.payload.from) return false
        if (filter.payload.to !== undefined && value > filter.payload.to) return false
      }
    }
    return true
  }

  // True if every document matching `filters` also matches `baseFilters`, i.e. the results of a search
  // with `baseFilters` contain all candidates and `filters` can be applied in the browser.
  public static isNarrowerOrEqual (filters: Filters, baseFilters: Filters): boolean {
    for (const type in baseFilters) {
      const base = baseFilters[type]
      const filter = filters[type]
      if (filter === undefined) return false
      if (base.type === FilterType.HIERARCHY) {
        const covered = (id: string) => base.payload.some((baseId: string) => id === baseId || id.startsWith(baseId + '_'))
        if (!filter.payload.every(covered)) return false
      } else if (base.type === FilterType.LANGUAGE) {
        if (!filter.payload.every((lang: string) => base.payload.includes(lang))) return false
      } else if (base.type === FilterType.DATE || base.type === FilterType.SCRAPEDATE) {
        if (base.payload.from !== undefined && (filter.payload.from === undefined || filter.payload.from < base.payload.from)) return false
        if (base.payload.to !== undefined && (filter.payload.to === undefined || filter.payload.to > base.payload.to)) return false
      }
    }
    return true
  }

  // Aggregations for the filter tree, computed from the loaded AI results. Like the classic search, each
  // facet is counted with all filters except its own, so that alternatives within a facet stay visible.
  public static computeAggregations (results: Array<SearchResult>, filters: Filters): Aggregations {
    const countBy = (type: string, keys: (sr: SearchResult) => Array<string | number | undefined>): Array<Aggregation> => {
      const counts = new Map<string | number, number>()
      for (const sr of results) {
        if (!SearchUtil.matchesFilters(sr, filters, type)) continue
        for (const key of keys(sr)) {
          if (key !== undefined) counts.set(key, (counts.get(key) || 0) + 1)
        }
      }
      return Array.from(counts, ([key, count]) => ({ key, count }))
    }
    const aggregations: Aggregations = {
      hierarchie: countBy(FilterType.HIERARCHY, sr => sr.hierarchy || []),
      language: countBy(FilterType.LANGUAGE, sr => [sr.language]),
      edatum: countBy(FilterType.DATE, sr => [sr.dateMs]).sort((a, b) => <number>a.key - <number>b.key),
      scrapedate: countBy(FilterType.SCRAPEDATE, sr => [sr.scrapedateMs]).sort((a, b) => <number>a.key - <number>b.key)
    }
    for (const name of ['edatum', 'scrapedate']) {
      const buckets = <Array<Aggregation>>aggregations[name]
      if (buckets.length > 0) {
        aggregations['min_' + name] = [{ key: buckets[0].key, count: 1 }]
        aggregations['max_' + name] = [{ key: buckets[buckets.length - 1].key, count: 1 }]
      }
    }
    return aggregations
  }

  // Fetches the best micro chunks for all given results in parallel and attaches the best one as text.
  private static async addBestMicroChunks (results: Array<any>, microEmbedding: number[]): Promise<void> {
    await Promise.all(results.map(async sr => {
      const bestMicroChunks = await this.getBestMicroChunks(sr.id, microEmbedding, sr.bigChunkId)
      if (bestMicroChunks !== undefined && bestMicroChunks !== null && bestMicroChunks.length > 0) {
        sr.text = bestMicroChunks[0]._source.chunkText
        sr.textOffset = bestMicroChunks[0]._source.offset
        sr.textLength = bestMicroChunks[0]._source.len
        sr.microChunks = bestMicroChunks
      }
    }))
  }

  private static async getBestMicroChunks (documentId: string, embedding: number[], chunkId?: string): Promise<any> {
    let bestMicroChunk = await this.searchBestMicroChunks(documentId, embedding, chunkId)
    if (bestMicroChunk[0] === undefined || bestMicroChunk[0] === null) {
      await axios.post(indexMicroChunksUrl, { id: documentId, chunkId }, { timeout: 120000 }).catch(() => console.log('Failed to index microChunks for ' + documentId))
      bestMicroChunk = await this.searchBestMicroChunks(documentId, embedding, chunkId)
      if (bestMicroChunk[0] === undefined || bestMicroChunk[0] === null) {
        const chunkSplit = chunkId?.split('_')
        if (chunkSplit) {
          const newChunkNo = parseInt(chunkSplit[chunkSplit.length - 1].replace('C', '')) - 1
          chunkSplit.pop()
          const newChunkId = chunkSplit.join('_') + '_C' + newChunkNo.toString().padStart(4, '0')
          await axios.post(indexMicroChunksUrl, {
            id: documentId,
            newChunkId
          }, { timeout: 120000 }).catch(() => console.log('Failed to index microChunks for ' + documentId))
          bestMicroChunk = await this.searchBestMicroChunks(documentId, embedding, newChunkId)
        }
      }
    }
    return bestMicroChunk
  }

  private static async searchBestMicroChunks (documentId: string, embedding: number[], chunkId?: string): Promise<any> {
    const search = this.buildMicroChunkSearch(documentId, embedding, chunkId)
    return await axios.post(embeddingMicroSearchUrl,
      search,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
      .then(async resp => {
        if (resp.data !== undefined && resp.data.hits !== undefined && resp.data.hits.hits !== undefined) {
          return resp.data.hits.hits
        } else {
          return undefined
        }
      })
  }

  private static buildMicroChunkSearch (documentId: string, embedding: number[], chunkId?: string): any {
    let term : any = { documentId }
    if (chunkId) {
      term = { chunkId }
    }
    const search: any = {
      size: 10,
      knn: {
        field: 'embedding',
        query_vector: embedding,
        k: 10,
        num_candidates: 50,
        filter: {
          term
        }
      },
      fields: [
        '_id',
        'offset',
        'len',
        'chunkText'
      ]
    }
    return search
  }

  private static splitByChars (
    text: string,
    chunkSize: number,
    overlap: number
  ): string[] {
    if (chunkSize <= overlap) {
      throw new Error('chunkSize must be larger than overlap')
    }

    const chunks: string[] = []
    let start = 0

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length)
      chunks.push(text.slice(start, end))
      start += chunkSize - overlap
    }

    return chunks
  }

  private static cosineSimilarityBatch (
    query: number[],
    vectors: number[][]
  ): number[] {
    const queryNorm = Math.sqrt(query.reduce((s, x) => s + x * x, 0))

    return vectors.map(v => {
      let dot = 0
      let vNorm = 0

      for (let i = 0; i < v.length; i++) {
        dot += query[i] * v[i]
        vNorm += v[i] * v[i]
      }

      return (queryNorm && vNorm)
        ? dot / (queryNorm * Math.sqrt(vNorm))
        : 0
    })
  }

  private static cosineSimilarity (a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must be the same length')
    }

    let dot = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  private static async getEmbedding (query: string, url: string, model: string): Promise<any> {
    const input = `Instruct: ${queryInstruction}\nQuery: ${query}`
    return axios.post(url + '/v1/embeddings', { model, input, encoding_format: 'float' })
      .then(resp => {
        return resp.data.data[0].embedding
      })
      .catch(err => console.log(err))
  }

  private static buildEmbeddingSearch (embedding: number[], size: number, filters: Filters): Promise<any> {
    const search: any = {
      size,
      knn: {
        field: 'embedding',
        query_vector: embedding,
        k: size * 1.5,
        num_candidates: size * 5
      },
      fields: [
        'documentId',
        '_id'
      ]
    }
    // In the chunk index only hierarchy and date are reliable (language is missing on about half of the
    // chunks, scrapedate entirely). Language and scrapedate are applied by the term search on the main index.
    const knnFilters = _.pick(filters, [FilterType.HIERARCHY, FilterType.DATE])
    if (Object.keys(knnFilters).length > 0) {
      search.knn.filter = SearchUtil.buildEmbeddingSearchFilters(knnFilters)
    }
    return search
  }

  private static buildTermSearch (ids: string[], lang: string, filters: Filters, sortOrder: SortOrder, size: number, searchAfter?: Array<any>): any {
    const search : any = {
      size: size,
      // Only what ranking, the result list and the filter tree need; title and abstract are loaded per page.
      _source: {
        includes: ['date', 'scrapedate', 'canton', 'hierarchy', 'attachment.content_type', 'attachment.content_url', 'attachment.language']
      },
      track_total_hits: true,
      query: {
        bool: {
          must: [
            {
              terms: {
                _id: ids
              }
            }
          ]
        }
      },
      sort: [
        { [sortOrder === SortOrder.RELEVANCE ? '_score' : sortOrder === SortOrder.DATE ? 'date' : 'scrapedate']: 'desc' },
        { id: 'desc' }
      ]
    }
    if (Object.keys(filters).length > 0) {
      search.query.bool.filter = SearchUtil.buildFilters(filters)
    }
    if (searchAfter !== undefined) {
      search.search_after = searchAfter
    } else {
      if (search.aggs === undefined) {
        search.aggs = {}
      }
      search.aggs.hierarchie = {
        terms: {
          size: 1000,
          field: 'hierarchy'
        }
      }
      if (search.aggs === undefined) {
        search.aggs = {}
      }
      search.aggs.language = {
        terms: {
          size: 3,
          field: 'attachment.language'
        }
      }
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
    return search
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

  public static buildEmbeddingSearchFilters (filters: Filters): any {
    // wird auch für den Downloader benötigt
    const filterArray: Array<any> = []
    for (const type in filters) {
      filterArray.push(SearchUtil.buildEmbeddingSearchFilter(filters[type]))
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

  private static buildEmbeddingSearchFilter (filter: Filter): any {
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
            scrape: {
              gte: SearchUtil.transformDate(filter.payload.from),
              lte: SearchUtil.transformDate(filter.payload.to)
            }
          }
        }
      } else if (filter.payload.from !== undefined) {
        return {
          range: {
            scrape: {
              gte: SearchUtil.transformDate(filter.payload.from)
            }
          }
        }
      } else if (filter.payload.to !== undefined) {
        return {
          range: {
            scrape: {
              lte: SearchUtil.transformDate(filter.payload.to)
            }
          }
        }
      }
    }
    if (filter.type === 'language') {
      return {
        terms: {
          language: filter.payload
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
        const match = hit._id.match(/^([^_]*_[^_]*)/)
        const gericht = match ? match[1] : hit._id
        results.push({
          id: hit._id,
          text,
          textLength: 0,
          textOffset: 0,
          title,
          abstract: _abstract,
          date,
          canton: hit._source.canton.toUpperCase(),
          gericht: gericht.toUpperCase(),
          pdf,
          url: hit._source.attachment.content_url,
          sort: hit.sort,
          scrapedate,
          score: hit._source.score,
          bigChunkText: '',
          bigChunkId: '',
          microChunks: [],
          hierarchy: hit._source.hierarchy,
          language: hit._source.attachment.language,
          dateMs: SearchUtil.parseDateMs(hit._source.date),
          scrapedateMs: SearchUtil.parseDateMs(hit._source.scrapedate)
        })
      }
      aggregations = SearchUtil.extractAggregations(resp)
    }
    return [results, total, aggregations]
  }

  private static parseDateMs (date: string | undefined): number | undefined {
    const ms = date !== undefined ? Date.parse(date) : NaN
    return isNaN(ms) ? undefined : ms
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
