<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: currentRoute = $page.url.pathname;

	let sidebar = false;

	const menuRows = [
		{
			title: 'Image Optimizer',
			url: '/optimizer'
		},
		{
			title: 'About',
			url: '/about'
		}
	];
</script>

<div class="flex min-h-[100dvh] w-full max-w-[100dvw] bg-slate-100">
	<div
		id="sidebar"
		class="{sidebar
			? 'absolute w-screen'
			: 'hidden'} h-[100dvh] bg-white shadow-lg md:block md:w-80"
	>
		<div class="flex h-32 items-center justify-center">
			<h1 class="text-4xl font-bold text-blue-500">L.O.S.T</h1>
		</div>

		<div class="flex flex-col divide-y border-y">
			{#each menuRows as menuRow}
				<button
					on:click={() => {
						sidebar = false;
						goto(menuRow.url);
					}}
				>
					<div
						class="w-full p-4 text-left text-lg {currentRoute === menuRow.url
							? 'bg-blue-500 text-white'
							: 'hover:bg-neutral-100'}"
					>
						{menuRow.title}
					</div>
				</button>
			{/each}
		</div>
	</div>
	<div class="m-6 flex-1">
		<slot />
	</div>

	<div>
		<button
			class="fixed bottom-4 left-4 rounded-full bg-blue-500 p-2 text-white shadow-lg md:hidden"
			on:click={() => (sidebar = !sidebar)}
		>
			{#if sidebar}
				<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 12L7 7m5 5l5 5m-5-5l5-5m-5 5l-5 5"
					/></svg
				>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 8h12M6 12h12M6 16h12"
					/></svg
				>
			{/if}
		</button>
	</div>
</div>
