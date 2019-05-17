import Vue from 'vue'

import '#/main.scss'
import apolloProvider from './apollo'
import App from './components/App'

new Vue({
  apolloProvider,
  el: '#root',
  render: h => h(App)
})