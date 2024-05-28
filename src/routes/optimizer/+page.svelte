<script lang="ts">
	import { enhance } from '$app/forms';
	import JSZip from 'jszip';
	import type { PageData } from './$types';

	let files: FileList | null = null;
	let quality = 80;
	let format = 'png';
	let width = 0;
	let height = 0;

	let loading = false;
	let uploadResult: any;

	function base64ToBlob(base64: string, mimeType: any) {
		const byteCharacters = atob(base64);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);
			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		return new Blob(byteArrays, { type: mimeType });
	}

	function createDownloadUrl(base64: string, mimeType: any) {
		const blob = base64ToBlob(base64, mimeType);
		return URL.createObjectURL(blob);
	}

	async function downloadAllFiles() {
		const zip = new JSZip();
		uploadResult.data.files.forEach((file: any) => {
			const blob = base64ToBlob(file.data, file.type);
			zip.file(file.name, blob);
		});
		const content = await zip.generateAsync({ type: 'blob' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(content);
		a.download = 'optimized_images.zip';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<svelte:head>
	<title>Image Optimizer | LOST</title>
</svelte:head>

<form
	class="flex flex-col gap-3"
	method="post"
	use:enhance={() => {
		loading = true;
		return async ({ result, update }) => {
			if (result) {
				uploadResult = result;
				loading = false;
			}
		};
	}}
	enctype="multipart/form-data"
>
	<div
		class="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-md"
	>
		<h2 class="text-xl font-semibold text-gray-900">File Selector</h2>
		<label
			class="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-150 hover:bg-blue-600"
		>
			<input
				type="file"
				name="files"
				class="sr-only"
				multiple
				bind:files
				accept="image/png, image/jpeg, image/webp"
			/>
			Choose files
		</label>
	</div>

	<div class="flex w-full flex-col justify-between rounded-lg bg-white p-4 shadow-md">
		<h2 class="text-xl font-semibold text-gray-900">Optimization Settings</h2>

		<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
			<div class="flex flex-col">
				<label class="my-1 text-gray-700">Width</label>
				{#if width === 0}
					<button
						on:click={() => (width = 100)}
						class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
					>
						Enable
					</button>
				{:else}
					<input class="rounded-lg" name="width" type="number" step="1" bind:value={width} />
				{/if}
			</div>
			<div class="flex flex-col">
				<label class="my-1 text-gray-700">Height</label>
				{#if height === 0}
					<button
						on:click={() => (height = 100)}
						class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
					>
						Enable
					</button>
				{:else}
					<input class="rounded-lg" name="width" type="number" step="1" bind:value={height} />
				{/if}
			</div>
			<div class="flex flex-col">
				<label class="my-1 text-gray-700">Format</label>
				<select class="w-full rounded-lg border border-gray-300" name="format" bind:value={format}>
					<option value="png">PNG</option>
					<option value="jpeg">JPEG</option>
					<option value="webp">WebP</option>
				</select>
			</div>
			<div class="flex flex-col">
				<label class="my-1 text-gray-700">Quality</label>
				<select
					class="w-full rounded-lg border border-gray-300"
					name="quality"
					bind:value={quality}
				>
					{#each Array.from({ length: 10 }).map((_, i) => i + 1) as quality}
						<option value={quality * 10}>{quality * 10}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<div class="flex w-full flex-col justify-between gap-3 rounded-lg bg-white p-4 shadow-md">
		<h2 class="text-xl font-semibold text-gray-900">Currently Selected Files</h2>
		{#if files && files.length > 0}
			<ul class="flex flex-col gap-3">
				{#each Array.from(files) as file}
					<li class="flex items-center justify-between gap-3">
						<div class="flex items-center gap-3">
							<img
								src={URL.createObjectURL(file)}
								alt={file.name}
								class="h-12 w-12 rounded-lg object-cover"
							/>
							<span>{file.name}</span>
						</div>
						<span>{(file.size / 1024).toFixed(2)} KB</span>
					</li>
				{/each}
			</ul>
			<div class="flex w-full justify-end">
				<button
					class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-150 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
					type="submit"
					disabled={!files}
				>
					Optimize
				</button>
			</div>
		{:else}
			<span>No files selected</span>
		{/if}
	</div>
	{#if loading}
		<div class="flex w-full flex-col justify-between gap-3 rounded-lg bg-white p-4 shadow-md">
			<h2 class="text-center text-xl font-semibold text-gray-900">Optimizing Your Files</h2>
			<div class="h-2 w-full overflow-hidden rounded-lg bg-blue-100">
				<div class="h-full w-full origin-left-right animate-progress bg-blue-500"></div>
			</div>
		</div>
	{/if}
	{#if uploadResult && !loading}
		<div class="flex w-full flex-col justify-between gap-3 rounded-lg bg-white p-4 shadow-md">
			<h2 class="text-xl font-semibold text-gray-900">Results</h2>
			{#if uploadResult.data.success}
				<ul class="flex flex-col gap-2">
					{#each uploadResult.data.files as { name, type, size, data }, index}
						<li class="flex flex-wrap items-center justify-between gap-3">
							<div class="flex items-center gap-3">
								<img
									src={'data:' + type + ';base64,' + data}
									alt={`Preview of ${name}`}
									class="h-12 w-12 rounded-lg object-cover"
								/>
								<span>{name}</span>
							</div>

							<div class="flex items-center gap-3">
								<span>
									{(size / 1024).toFixed(2)} KB
								</span>
								{#if files && files[index].size / 1024 < size / 1024}
									<span class="text-red-400">
										(+{(size / 1024 - files[index].size / 1024).toFixed(2)} KB)
									</span>
								{:else}
									<span class="text-green-400">
										{#if files && files[index]}
											(-{(files[index].size / 1024 - size / 1024).toFixed(2)} KB)
										{/if}
									</span>
								{/if}
								<a
									href={createDownloadUrl(data, type)}
									download={name}
									class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
								>
									Download
								</a>
							</div>
						</li>
					{/each}
					{#if uploadResult.data.files.length > 1}
						<div class="flex w-full justify-end">
							<button
								class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-150 hover:bg-blue-700"
								on:click={downloadAllFiles}
							>
								Download All
							</button>
						</div>
					{/if}
				</ul>
				<p>Failed to convert {uploadResult.data.failedCount} images.</p>
			{:else}
				<p>Failure to optimize files.</p>
			{/if}
		</div>
	{/if}
</form>
