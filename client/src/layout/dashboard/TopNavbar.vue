<template>
	<nav class="navbar navbar-expand-lg navbar-light">
		<vs-popup class="holamundo" title="Duyệt" :active.sync="approved">
			<vs-chips
				color="rgb(145, 32, 159)"
				v-model="$store.state.tags"
				placeholder="Tags"
				class="tag-inp"
			>
				<vs-chip
					closable
					close-icon="close"
					@click="$store.commit('removeTag',i)"
					:key="i"
					v-for="(tag,i) in $store.state.tags"
				>#{{ tag }}</vs-chip>
			</vs-chips>
			<p class="popup-text" v-html="$store.getters.approved"></p>
			<vs-row class="end-container">
				<vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
					<vs-textarea
						placeholder="Type here..."
						class="admin-inp"
						v-model="$store.state.adminMsg"
						spellcheck="false"
					></vs-textarea>
				</vs-col>
				<vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2">
					<vs-button
						color="primary"
						type="filled"
						icon="arrow_forward"
						class="post-btn"
						@click="postCfs"
					>{{''}}</vs-button>
				</vs-col>
			</vs-row>
		</vs-popup>
		<div class="container-fluid">
			<a class="navbar-brand" href="#">{{routeName}}</a>
			<button
				class="navbar-toggler navbar-burger"
				type="button"
				@click="toggleSidebar"
				:aria-expanded="$sidebar.showSidebar"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-bar"></span>
				<span class="navbar-toggler-bar"></span>
				<span class="navbar-toggler-bar"></span>
			</button>
			<div class="collapse navbar-collapse">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item" v-if="false">
						<a href="#" class="nav-link">
							<i class="ti-panel"></i>
							<p>Stats</p>
						</a>
					</li>
					<drop-down
						class="nav-item"
						title="5 Notifications"
						title-classes="nav-link"
						icon="ti-heart"
						v-if="false"
					>
						<a class="dropdown-item" href="#">Notification 1</a>
						<a class="dropdown-item" href="#">Notification 2</a>
						<a class="dropdown-item" href="#">Notification 3</a>
						<a class="dropdown-item" href="#">Notification 4</a>
						<a class="dropdown-item" href="#">Another notification</a>
					</drop-down>
					<div class="pending-btn nav-item">
						<vs-button
							:icon="$store.getters.pending.length>0?'check':'close'"
							:color="$store.getters.pending.length>0?'success':'danger'"
							:disabled="$store.getters.pending.length<=0"
							@click="showApproved"
							v-if="$route.path === '/admin/pending'"
						>Duyệt ({{this.$store.getters.pending.length}})</vs-button>
					</div>
					<div class="nav-item" @click="openSettings=!openSettings" :style="{cursor:'pointer'}">
						<div class="nav-link">
							<i class="ti-settings"></i>
							<p>Cài Đặt</p>
						</div>
					</div>
					<vs-popup class="holamundo" title="Cài Đặt" :active.sync="openSettings">
						<p class="setting-title"># Cài đặt chung</p>
						<vs-row>
							<vs-col vs-type="flex" vs-w="6">
								<vs-input icon="reorder" label="Order" v-model="$store.state.config.order"></vs-input>
							</vs-col>
							<vs-col vs-type="flex" vs-w="6">
								<vs-input icon="skip_next" label="Hastag Prefix" v-model="$store.state.config.prefix"></vs-input>
							</vs-col>
						</vs-row>
						<div style="height:40px"></div>
						<p class="setting-title"># Nâng cao</p>
						<vs-row>
							<vs-col vs-type="flex" vs-w="6">
								<vs-input icon="code" label="Page Token" v-model="$store.state.config.pageToken"></vs-input>
							</vs-col>
							<vs-col vs-type="flex" vs-w="6">
								<vs-input icon="turned_in" label="Page ID" v-model="$store.state.config.pageId"></vs-input>
							</vs-col>
						</vs-row>
						<div style="height:30px"></div>
						<vs-divider></vs-divider>
						<vs-row>
							<vs-col vs-type="flex" vs-w="3">
								<vs-button icon="save" color="success" @click="saveConfig">Lưu Cài Đặt</vs-button>
							</vs-col>
							<vs-col vs-type="flex" vs-w="3">
								<vs-button icon="subdirectory_arrow_right" color="danger" @click="logout">Đăng Xuất</vs-button>
							</vs-col>
						</vs-row>
					</vs-popup>
				</ul>
			</div>
		</div>
	</nav>
</template>
<script>
import swal from 'sweetalert'
export default {
	computed: {
		routeName() {
			const { name } = this.$route
			return this.capitalizeFirstLetter(name)
		},
	},
	data() {
		return {
			activeNotifications: true,
			approved: false,
			tags: ['love', 'chiase'],
			openSettings: false,
		}
	},
	methods: {
		capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1)
		},
		toggleNotificationDropDown() {
			this.activeNotifications = !this.activeNotifications
		},
		closeDropDown() {
			this.activeNotifications = false
		},
		toggleSidebar() {
			this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
		},
		hideSidebar() {
			this.$sidebar.displaySidebar(false)
		},
		showApproved() {
			this.approved = true
		},
		postCfs() {
			this.$vs.loading()
			this.$store
				.dispatch('postApproved')
				.then(data => {
					this.$vs.loading.close()
					this.approved = false
					swal('Thành công', 'Đã đăng thành công!', 'success')
				})
				.catch(err => {
					this.$vs.loading.close()
					console.log(err)
					this.approved = false
					let msg = 'Có vấn đề với việc đăng tải\nXin hãy thử lại sau'
					swal('Lỗi', msg, 'error')
				})
		},
		saveConfig() {
			this.$vs.loading()
			this.$store
				.dispatch('changeConfig')
				.then(() => {
					this.$vs.loading.close()
					this.openSettings = false
					swal('Thành công', 'Đã lưu thành công!', 'success')
				})
				.catch(err => {
					this.$vs.loading.close()
					console.log(err)
					this.openSettings = false
					swal('Lỗi', 'Không thể lưu\nXin hãy thử lại sau', 'error')
				})
		},
		logout() {
			this.$store.dispatch('logout').then(() => {
				this.openSettings = false
				setTimeout(() => this.$router.push('/login'), 100)
			})
		},
	},
	created() {
		this.$store.dispatch('getConfig')
	},
}
</script>
<style lang='scss' scoped>
@import '~vuesax/dist/vuesax.css';
@import '~material-icons/iconfont/material-icons.css';
.pending-btn {
	display: inline-block;
	margin-top: 10px;
}
.popup-text {
	font-size: 18px;
	font-weight: normal;
	text-align: left;
	margin: auto 1px 10px 20px;
	margin-bottom: 20px;
}
.admin-inp {
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
	width: 93%;
	height: 100%;
	margin: 10px auto;
	overflow: hidden;
	background-color: white;
	color: black !important;
	border-color: #007bff;
}
.post-btn {
	margin: 0 auto;
	width: 100%;
	height: 100%;
	box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
}
.end-container {
	margin-bottom: 30px;
}
.tag-inp {
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	width: 95%;
	margin: 10px auto;
	overflow: hidden;
	background-color: white;
	color: black !important;
	border-radius: 10px;
	font-size: 16px;
}
.tag-inp:hover {
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
	transition: 0.3s;
}
.setting-title {
	text-align: left;
	font-size: 20px;
	font-weight: bold;
	margin: 10px 0 10px 2px;
	// color: #ff4757;
}
</style>
<style>
.vs-popup--content {
	padding: 20px;
}
.vs-textarea {
	font-size: 16px;
	margin: 10px;
}
.vs-con-input {
	height: 40px;
}
.vs-inputx {
	font-size: 16px;
	padding-left: 36px !important;
	padding-bottom: 8px !important;
}
.con-chips {
	padding: 10px 10px 10px 20px;
	margin: 0 auto;
}
.vs-input {
	text-align: left;
}
.con-vs-chip.closable {
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	font-weight: 500;
	font-size: 14px;
	background-color: #007bff;
	color: white !important;
}
</style>
