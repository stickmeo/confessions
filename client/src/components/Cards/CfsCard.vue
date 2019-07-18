<template>
<div class="container">
    <vs-card actionable class="cardx">
        <div class="click-container" @click="$emit('showDetail', content)">
            <div class="content">
                <p class="content-text">{{ showContent }}</p>
            </div>
            <div class="date-container">
                <vs-chip v-if="content.order && isApproved" color='' class="tag">
                    <vs-avatar icon='local_offer' color='green'/>
                    {{ '#'+content.order }}
                </vs-chip>
                <vs-chip color='' class="tag">
                    <vs-avatar icon='today' color='#007bff'/>
                    {{ formatDate }}
                </vs-chip>
                <vs-chip color='' class="tag">
                    <vs-avatar icon='access_time' color='#007bff'/>
                    {{ formatTime }}
                </vs-chip>
            </div>
        </div>
        <div slot="footer" :style="!isApproved?{}:{ visibility: 'hidden' }">
            <vs-row vs-justify="flex-end">
                <vs-button color="success" :icon="added?'check':'add'" type="filled" 
                @click="add">{{added?'Đã thêm':'Thêm'}}</vs-button>
                <span class="seperator"></span>
                <vs-button color="danger" icon="close" type="filled" @click="deleteCfs">Xoá</vs-button>
            </vs-row>
        </div>
    </vs-card>
</div>
</template>

<script>
export default {
    props: {
        content: {
            type: Object,
            required: true
        },
        isApproved: {
            type: Boolean, 
            default: false
        }
    },
    data() {
        return {
            added: this.content.added
        }
    },
    computed: {
        showContent() {
            let content = this.content.content.split('\n').join('. ')
            if (content.length > 330) return content.substring(0, 300) + '...'
            else return content
        },
        formatDate() {
            let date = new Date(this.content.timestamp)
            return date.toLocaleDateString().split('/').join('-')
        },
        formatTime() {
            let date = new Date(this.content.timestamp)
            return date.toLocaleTimeString()
        }
    },
    methods: {
        add() {
            if (this.added) {
                this.added = false
                this.$store.commit('deletePendingCfs', this.content)
            } else {
                this.added = true
                this.$store.commit('addPendingCfs', this.content)
            }
        },
        deleteCfs() {
            this.$store.dispatch('deleteCfs', this.content)
        }
    }
}
</script>

<style lang='scss' scoped>
@import "~vuesax/dist/vuesax.css";
@import '~material-icons/iconfont/material-icons.css';
.container {
    width: 650px;
}
.cardx {
    margin: 0 auto 50px auto;
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
}
.click-container {
    margin: 10px;
}
.date-container {
    margin: 20px 0 0 20px;
    font-weight: normal;
}
.content-text {
    font-size: 18px;
    font-weight: normal;
    text-align: left;
    margin: 25px auto auto 20px;
}
.seperator {
    margin: 0 6px;
}
hr {
    border-color: black;
}
.tag {
    font-weight: bold;
    margin-right: 10px;
}
@media screen and (max-width: 620px) {
    .container {
        width: 90%;
    }
};
@media screen and (max-width: 590px) {
    .vs-button-filled {
        width: 100px !important;
    }
}
@media screen and (max-width: 500px) {
    .vs-button-filled {
        visibility: hidden;
    }
}
</style>

<style>
    .vs-card--content {
        padding: 1px;
    }
</style>