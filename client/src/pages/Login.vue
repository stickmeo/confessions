<template>
    <div id='app'>
        <div class="modal" id="modal-register" tabindex="-1" role="dialog" aria-labelledby="modal-register-label" aria-hidden="true" style="display: block">
        	<div class="modal-dialog">
        		<div class="modal-content">
        			<div class="modal-header">
        				<h3 class="modal-title" id="modal-register-label">Đăng Nhập</h3>
        				<!-- <p class="modal-description">Hãy thổ lộ đi nào!</p> -->
        			</div>
        			
        			<div class="modal-body">
        				
	                    <form role="form">
							<user-input type='text' placeholder='Type here...' :warn='!isValidUsername'
							@input='username=$event' ref='usernameInp' label="Username/Email"></user-input>
							<user-input type='password' placeholder='Type here...' :warn='!isValidPassword'
							@input='password=$event' ref='passwordInp' label="Password"></user-input>
	                        <button type="submit" class="btn" @click.prevent='submit'>Submit</button>
	                    </form>
	                    
        			</div>
        			
        		</div>
        	</div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios'
	import userInput from '@/components/userInput.vue'
	import swal from 'sweetalert'
    export default {
		data() {
			return {
                username: '',
                password: '',
                isValidUsername: true,
                isValidPassword: true
			}
		},
		components: {
			'user-input': userInput
		},
		methods: {
			submit(e) {
				this.isValidUsername = this.username ? true : false
				this.isValidPassword = this.password ? true : false
				if (this.isValidUsername && this.isValidPassword) {
                    this.$vs.loading()
                    this.$store.dispatch('login', { username: this.username, password: this.password})
					.then(data => {
                        this.$vs.loading.close()
						if (data.status===200) return this.$router.push({ path: '/admin/dashboard' })
                        else {
                            swal('Thất bại', `${data.message}\nXin hãy thử lại sau`, 'error')
                        }
					})
					.catch(err => {
						swal('Lỗi', 'Xin hãy thử lại sau', 'error')
						console.log(err)
						this.$vs.loading.close()
					})
				}
			}
		}
	}
</script>

<style>
	.swal-text {
		text-align: center;
	}
</style>

<style scoped lang="scss">
	#app /deep/ {
		@import "~@/assets/css/form/css/style.scss";
		@import "~@/assets/css/form/css/form-elements.scss";
	}
	#modal-register {
		background-color: #aaa;
		overflow-y: scroll !important;
	}
    .modal-content {
        width: 60%;
        margin: 100px auto !important;
    }
</style>

<style>
</style>
