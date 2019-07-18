<template>
<div>
    <h1 class="title">Confessions đã duyệt</h1>
    <vs-popup class="holamundo" :title="formatDate" :active.sync='showDetail'>
        <p class="popup-text" v-html="detail.content.replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
    </vs-popup>
    <cfs-card :isApproved="true" v-for="cfs in formatApproved" :key='cfs._id' :content='cfs' @showDetail='show'></cfs-card> 
</div>
</template>

<script>
    import CfsCard from '@/components/Cards/CfsCard.vue'
    export default {
        components: {
            CfsCard
        },
        data() {
            return {
                showDetail: false,
                detail: { content: '' }
            }
        },
        mounted () {
            this.getApproved()
        },
        methods: {
            show(event) {
                this.detail = event
                this.showDetail = true
            },
            getApproved() {
                this.$vs.loading()
                this.$store.dispatch('getApproved')
                .then(() => {
                    this.$vs.loading.close()
                })
                .catch(err => {
                    swal('Lỗi', 'Có vấn đề với việc lấy dữ liệu\nXin hãy thử lại sau', 'error')
                    this.$vs.loading.close()
                    console.log(err)
                })
            }
        },
        computed: {
            formatDate() {
                let date = new Date(this.detail.upload_timestamp)
                return `${date.toLocaleDateString().split('/').join('-')} ${date.toLocaleTimeString()}`
            },
            formatApproved() {
                return this.$store.state.approved.map(each => ({
                    ...each,
                    timestamp: each.upload_timestamp
                }))
            }
        }
    }
</script>

<style scoped>
.title {
    margin-bottom: 80px;
}
.popup-text {
    font-size: 18px;
    font-weight: normal;
    text-align: left;
    margin: auto 20px;
    margin-bottom: 20px;
}
</style>
