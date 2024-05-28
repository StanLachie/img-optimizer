import sharp from 'sharp';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const files = formData.getAll('files');
		const width = parseInt(formData.get('width'));
		const height = parseInt(formData.get('height'));
		const format = formData.get('format');
		const quality = parseInt(formData.get('quality'));

		const optimizedFiles = [];
		let failedCount = 0; // Counter for failed conversions

		for (const file of files) {
			if (file instanceof File) {
				try {
					const buffer = await file.arrayBuffer();
					let image = sharp(Buffer.from(buffer)).rotate(); // Automatically orient the image

					if (width > 0 || height > 0) {
						image = image.resize(width, height);
					}

					switch (format) {
						case 'jpeg':
							image = image.jpeg({ quality });
							break;
						case 'png':
							image = image.png({ quality });
							break;
						case 'webp':
							image = image.webp({ quality });
							break;
					}

					const optimizedBuffer = await image.toBuffer();
					const fileName = file.name.split('.').slice(0, -1).join('.');
					optimizedFiles.push({
						name: `optimized-${fileName}.${format}`,
						type: `image/${format}`,
						size: optimizedBuffer.length,
						data: optimizedBuffer.toString('base64')
					});
				} catch (error) {
					console.error(`Failed to process file ${file.name}:`, error);
					failedCount++; // Increment failed count
					continue; // Skip this file and continue with the next one
				}
			}
		}

		return { success: true, files: optimizedFiles, failedCount }; // Include failed count in the response
	}
};
