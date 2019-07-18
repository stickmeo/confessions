<template>
    <div id='app'>
        <!-- MODAL -->
		<!-- <div v-if='submitted' style='margin-top:150px;font-weight:bold'>
			<h1>Uploaded</h1>
		</div> -->
        <div class="modal" id="modal-register" tabindex="-1" role="dialog" aria-labelledby="modal-register-label" aria-hidden="true" style="display: block">
        	<div class="modal-dialog">
        		<div class="modal-content">
        			<div class="modal-header">
        				<!-- <button type="button" class="close" data-dismiss="modal">
        					<span aria-hidden="true">&times;</span>
							<span class="sr-only">Close</span>
        				</button> -->
        				<h3 class="modal-title" id="modal-register-label">Confessions</h3>
        				<p class="modal-description">Hãy thổ lộ đi nào!</p>
        			</div>
        			
        			<div class="modal-body">
        				
	                    <form role="form">
							<user-input type='textarea' placeholder='Type here...' :warn='!isValid'
							@input='cfs=$event' ref='inp'></user-input>
	                        <button type="submit" class="btn" @click.prevent='submit'>Submit</button>
	                    </form>
	                    
        			</div>
        			
        		</div>
        	</div>
        </div>
    </div>
</template>

<script>
	import userInput from '@/components/userInput.vue'
	import swal from 'sweetalert'
    export default {
		data() {
			return {
				cfs: '',
				isValid: true
			}
		},
		components: {
			'user-input': userInput
		},
		methods: {
			submit() {
				this.isValid = true
				if (!this.cfs) this.isValid = false
				else {
					this.$vs.loading()
					this.$store.dispatch('uploadCfs', this.cfs)
					.then(data => {
						swal('Hoàn tất', 'Confession của bạn đã được đăng tải hoàn tất\nXin hãy chờ được kiểm duyệt', 'success')
						this.$vs.loading.close()
						this.$refs.inp.$emit('submitted')
						this.cfs = ''
					})
					.catch(err => {
						swal('Lỗi', err.response && err.status === 429 ? 
							'Bạn đã gửi quá nhiều confession cùng 1 lúc\nXin hãy thử lại sau':
							'Xin hãy thử lại sau', 
						'error')
						console.log(err.response)
						this.$vs.loading.close()
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Roboto:300');
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
        margin: 0 auto;
    }
</style>