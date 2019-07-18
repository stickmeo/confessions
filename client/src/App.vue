<template>
	<div :class="{'nav-open': $sidebar.showSidebar}">
		<notifications></notifications>
		<router-view></router-view>
	</div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import '~@/assets/sass/paper-dashboard.scss';
@import '~@/assets/css/themify-icons.css';
.vue-notifyjs.notifications {
	.alert {
		z-index: 10000;
	}
	.list-move {
		transition: transform 0.3s, opacity 0.4s;
	}
	.list-item {
		display: inline-block;
		margin-right: 10px;
	}
	.list-enter-active {
		transition: transform 0.2s ease-in, opacity 0.4s ease-in;
	}
	.list-leave-active {
		transition: transform 1s ease-out, opacity 0.4s ease-out;
	}

	.list-enter {
		opacity: 0;
		transform: scale(1.1);
	}
	.list-leave-to {
		opacity: 0;
		transform: scale(1.2, 0.7);
	}
}
</style>


<style>
body {
	font-family: 'Roboto', sans-serif;
	font-size: 16px;
	font-weight: 300;
	line-height: 30px;
	text-align: center;
}
h1,
h2 {
	margin-top: 10px;
	font-size: 50px;
	color: #555;
	line-height: 50px;
}
</style>
