<template>
    <div class="form-group">
        <p v-if='label' class="label-inp">{{ label }}</p>
        <div v-if='label' class="seperator" :style="{width: '20px'}"></div>
        <p class="text-danger warn-msg" v-if='warn'>* {{ warnMsg }}</p>
        <textarea :placeholder="placeholder" class="form-control" :class="{'input-error':warn}" spellcheck='false' autocomplete='off' v-if="type==='textarea'" v-model='content' autofocus></textarea>
        <input :type="type" name="form-email" :placeholder="placeholder" class="form-control"
        :class="{'input-error':warn}" spellcheck='false' autocomplete='off' v-else v-model='content'>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                validator: value => ['text', 'textarea', 'password'].indexOf(value) !== -1,
                required: true
            },
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            warn: {
                type: Boolean,
                default: false
            },
            warnMsg: {
                type: String,
                default: 'Missing field'
            }
        },
        created() {
            this.$on('submitted', data => {
                this.content = ''
            })
        },
        data() {
            return {
                content: ''
            }
        },
        watch: {
            content() {
                this.$emit('input', this.content)
            }
        }
    }
</script>

<style scoped>
.label-inp {
    font-weight: normal;
    font-size: 16px;
    color: white;
}
.form-group {
    margin: 20px auto 30px auto;
}
.warn-msg, .label-inp, .seperator {
    display: inline-block;
}
</style>
