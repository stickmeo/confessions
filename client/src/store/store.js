import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const hostname = process.env.NODE_ENV==='production'?window.location.origin:require('../devConfig').baseURL
axios.defaults.baseURL = hostname + '/api'
import Store from 'store2'
Vue.use(Vuex)

if (Store.get('jwt')) axios.defaults.headers.common['authorization'] = 'bearer ' + Store.get('jwt')
if (!Store.get('chose')) Store.set('chose', [])


export const store = new Vuex.Store({
    state: {
        pending: [],
        approved: [],
        chose: Store.get('chose'),
        config: {
            order: '0',
            prefix: 'cfs_',
            pageToken: '',
            pageId: ''
        },
        adminMsg: '',
        tags: []
    },
    mutations: {
        updatePending(state, newCfs) {
            state.pending = newCfs
        },
        updateApproved(state, data) {
            state.approved = data
        },
        addPendingCfs(state, content) {
            state.chose.push(content)
            Store.set('chose', state.chose)
        },
        deletePendingCfs(state, content) {
            let index = 0
            state.chose.some((cfs, i) => {
                index = i
                return cfs._id === content._id
            })
            state.chose.splice(index, 1)
            Store.set('chose', state.chose)
        },
        updateAdminMsg(state, content) {
            state.adminMsg = content
        },
        updateConfig(state, config) {
            state.config = config
        },
        removeTag(state, index) {
            state.tags.splice(state.tags.indexOf(index), 1)
        },
        removeAllTags(state) {
            state.tags = []
        }
    },
    actions: {
        async getPending({ commit }) {
            let Ids = Store.get('chose').map(each => each._id)
            let res = await axios.get('/pending')
            let newCfs = res.data.reverse().map(cfs => {
                return {
                    ...cfs,
                    added: Ids.includes(cfs._id)
                }
            })
            commit('updatePending', newCfs)
        },
        async getApproved({ state, commit }) {
            let res = await axios.get('/approved')
            commit('updateApproved', res.data.reverse())
        },
        async getConfig({ commit }) {
            let res = await axios.get('/config')
            commit('updateConfig', res.data)
        },
        async deleteCfs({ commit, state }, content) {
            await axios.delete('/delete_cfs', { data: { _id: content._id }})
            let newCfs = state.pending.filter(cfs => {
                return cfs._id !== content._id
            })
            state.chose = state.chose.filter(cfs => {
                return cfs._id !== content._id
            })
            Store.set('chose', state.chose)
            commit('updatePending', newCfs)
        },
        async postApproved({ state, getters, dispatch }) {
            let res = await axios.post('/post_cfs', { format: getters.approvedPost, raw: getters.pending })
            if (res.data === 'Failed') throw 'Failed'
            state.config.order += getters.pending.length
            await dispatch('changeConfig', state.config)
            state.adminMsg = ''
            state.chose = []
            Store.set('chose', [])
            await dispatch('getPending')
            return res.data
        },
        async uploadCfs(store, content) {
            const res = await axios.post('/new_pending', {content: content.trim()})
            return res.data
        },
        async login(store, { username, password }) {
            const res = await axios.post('/login', { username, password })
            if (res.data.data) {
                Store.set('jwt', res.data.data.token)
                axios.defaults.headers.common['authorization'] = 'bearer ' + res.data.data.token
            } 
            return res.data
        },
        async logout(store) {
            await axios.delete('/logout')
            Store.clearAll()
            Store.set('chose', [])
            axios.defaults.headers.common['authorization'] = ''
        },
        async changeConfig({ state }) {
            await axios.put('/change_config', state.config)
            state.config.pageToken = ''
        }
    },
    getters: {
        pending(state) {
            state.config.order = parseInt(state.config.order)
            return state.chose.map((each, i) => {
                each.order = state.config.order + i
                return each
            })
        },
        approved(state, { pending }) {
            state.config.order = parseInt(state.config.order)
            return pending.map((each, i) => {
                return `<span style="color:#007bff">#${state.config.order+i}</span><br/>${each.content}<br/><br/>`
            }).join('').replace(/(?:\r\n|\r|\n)/g, '<br />') + '_'.repeat(20)
        },
        approvedPost(state, { pending }) {
            state.config.order = parseInt(state.config.order)
            let hastag = state.tags.map(each => `#${state.config.prefix}${each}`).join(' ') + '\n'
            return hastag + pending.map((each, i) => {
                return `#${state.config.order+i}\n${each.content}\n\n`
            }).join('') + (state.adminMsg ? '_'.repeat(20) : '') + `\n${state.adminMsg}`
        },
    }
})