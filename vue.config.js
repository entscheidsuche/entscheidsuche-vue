const fs = require('fs')
const path = require('path')

// Direct Elasticsearch proxy for development inside the Pansoft LAN only. It needs the ES CA
// certificate (certs/http_ca.crt) and ELASTICSEARCH_USER/PASSWORD. Without the certificate the
// proxy is skipped, so `serve`/`build` still work with absolute VUE_APP_* URLs (.env.development.local).
const esCaFile = path.resolve(__dirname, 'certs/http_ca.crt')
const esProxy = fs.existsSync(esCaFile)
  ? {
      '/api/elasticsearch': {
        target: 'https://192.168.99.235:9200',
        changeOrigin: true,
        secure: true, // we want SSL verification
        headers: {
          // Basic Auth header
          Authorization: 'Basic ' + Buffer.from(
            `${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}`
          ).toString('base64')
        },
        agent: new (require('https').Agent)({
          ca: fs.readFileSync(esCaFile)
        }),
        pathRewrite: { '^/api/elasticsearch': '' },
        onProxyReq (proxyReq) {
          // Remove Origin header
          proxyReq.removeHeader('origin')
        }
      }
    }
  : {}

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src'
        }

        return options
      })
  },

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'fr',
      localeDir: 'locales',
      enableInSFC: true
    }
  },

  devServer: {
    allowedHosts: [
      'entscheidsuche-beta.pansoft.de',
      '192.168.99.235:8080',
      'localhost:8080'
    ],
    proxy: {
      ...esProxy,
      // Query embeddings (vLLM) via the server's Caddy, which forwards them to the vLLM servers on localhost.
      '/api/embed': {
        target: 'http://192.168.99.235:8080',
        changeOrigin: true,
        onProxyReq (proxyReq) {
          // Remove Origin header
          proxyReq.removeHeader('origin')
        }
      },
      '/api/llm': {
        target: 'http://192.168.99.235:1234',
        changeOrigin: true,
        onProxyReq (proxyReq) {
          // Remove Origin header
          proxyReq.removeHeader('origin')
        },
        pathRewrite: { '^/api/llm': '' }
      },
      '/api/docs/': {
        target: 'https://entscheidsuche.ch/docs/',
        changeOrigin: true,
        secure: true, // we want SSL verification
        pathRewrite: { '^/api/docs/': '' },
        onProxyReq (proxyReq) {
          // Remove Origin header
          proxyReq.removeHeader('origin')
        }
      }
    }
  }
}
