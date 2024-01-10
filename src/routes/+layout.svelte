<script>
	import '../app.css';
</script>

<div class="view-wrapper">
	<main>
		<slot />
	</main>
</div>
<style>
	.view-wrapper {
		background-color: #161616;
	}
	/* .view-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		overflow: hidden;
	} */

	/* main {
		overflow: auto;
		flex-grow: 1;
	} */
</style>