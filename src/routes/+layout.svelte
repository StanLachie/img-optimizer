<script>
	import '../app.css';
	import { page } from '$app/stores';

	$: currentRoute = $page.url.pathname;

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
	<div id="sidebar" class="h-[100dvh] w-80 bg-white shadow-lg">
		<div class="flex h-32 items-center justify-center">
			<h1 class="text-4xl font-bold text-blue-500">LOTS</h1>
		</div>

		<div class="flex flex-col divide-y border-y">
			{#each menuRows as menuRow}
				<a href={menuRow.url}>
					<div
						class="w-full p-4 text-left text-lg {currentRoute === menuRow.url
							? 'bg-blue-500 text-white'
							: 'hover:bg-neutral-100'}"
					>
						{menuRow.title}
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div class="m-6 flex-1">
		<slot />
	</div>
</div>
