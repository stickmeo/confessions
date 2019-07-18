<template>
    <div>
        <h1 class="title">Confessions chưa duyệt</h1>
        <div class="refresh">
            <vs-button color='primary' icon="refresh" type="gradient" :radius="true" @click="getPending"></vs-button>
        </div>
        <vs-popup class="holamundo" :title="formatDate" :active.sync='showDetail'>
            <p class="popup-text" v-html="detail.content.replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
        </vs-popup>
        <cfs-card v-for="cfs in $store.state.pending" :key='cfs._id' :content='cfs' @showDetail='show'></cfs-card>
    </div>
</template>

<script>
    import CfsCard from '@/components/Cards/CfsCard.vue'
    import swal from 'sweetalert'
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
            this.getPending()
        },
        methods: {
            show(event) {
                this.detail = event
                this.showDetail = true
            },
            getPending() {
                this.$vs.loading()
                this.$store.dispatch('getPending')
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
                let date = new Date(this.detail.timestamp)
                return `${date.toLocaleDateString().split('/').join('-')} ${date.toLocaleTimeString()}`
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
.refresh {
    position: fixed;
    bottom: 40px;
    right: 40px; 
    z-index: 100;
}
.includeIconOnly {
    width: 60px !important;
    height: 60px !important;
}
@media screen and (max-width: 530px) {
    .refresh {
        bottom: 20px;
        right: 20px; 
    }
}
</style>

<style>
    .vs-popup--close {
        background-color: #dc3545;
        color: white;
    }
    .includeIcon {
        float: none;
    }
</style>