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

		for (const file of files) {
			if (file instanceof File) {
				const buffer = await file.arrayBuffer();
				let image = sharp(Buffer.from(buffer));

				if (width <= 0 && height <= 0) {
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
			}
		}

		return { success: true, files: optimizedFiles };
	}
};
