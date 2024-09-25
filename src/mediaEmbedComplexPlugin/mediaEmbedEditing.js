import { Plugin } from 'ckeditor5';

export default class MediaEmbedEditing extends Plugin {
	init() {
		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		// // Extend the text node's schema to accept the mediaEmbed attribute.
		// schema.extend('$text', {
		// 	allowAttributes: ['mediaEmbed', 'title', 'class']
		// });

		schema.register('mediaEmbed', {
			inheritAllFrom: '$blockObject',
			allowAttributes: ['title', 'class', 'iframeRawHtml', 'socialMedia']
		});

		schema.register('mediaEmbedIframeContainer', {
			allowIn: 'mediaEmbed',
			inheritAllFrom: '$container',
			isSelectable: false,
			isObject: true,
			allowContentOf: '$root',
			allowAttributes: ['class']
		});

		// schema.register('mediaEmbedIframe', {
		// 	allowIn: 'mediaEmbedIframeContainer',
		// 	isObject: false,
		// 	allowAttributes: [
		// 		'src',
		// 		'frameborder',
		// 		'allowfullscreen',
		// 		'allow',
		// 		'class'
		// 	]
		// });

		// schema.register('mediaEmbedImage', {
		// 	allowIn: 'mediaEmbed',
		// 	inheritAllFrom: '$block',
		// 	isObject: false,
		// 	allowAttributes: ['src', 'alt', 'class']
		// });

		// schema.register('mediaEmbedVendorScript', {
		// 	allowIn: 'mediaEmbed',
		// 	inheritAllFrom: '$block',
		// 	isObject: false,
		// 	allowAttributes: ['cald-gdpr', 'type']
		// });

		// schema.register('mediaEmbedCaldGdprContainer', {
		// 	allowIn: 'mediaEmbed',
		// 	inheritAllFrom: '$container',
		// 	isObject: false,
		// 	allowAttributes: ['class', 'cald-gdpr', 'type']
		// });

		// schema.register('mediaEmbedNoConsentImage', {
		// 	allowIn: 'mediaEmbedCaldGdprContainer',
		// 	inheritAllFrom: 'imageBlock',
		// 	isObject: false,
		// 	allowAttributes: ['src', 'alt', 'class', 'style']
		// });

		// schema.register('mediaEmbedNoConsentOverlay', {
		// 	allowIn: 'mediaEmbedCaldGdprContainer',
		// 	inheritAllFrom: '$block',
		// 	isObject: false,
		// 	allowAttributes: ['class', 'style']
		// });
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for('dataDowncast').elementToElement({
			model: 'mediaEmbed',
			view: (modelElement, { writer }) => {
				// console.log('modelElement', modelElement);
				// const socialMedia = modelElement.getAttribute('socialMedia');

				return writer.createRawElement('div', {
					value: modelElement.getAttribute('iframeRawHtml')
				},
				el => {
					el.innerHTML = '<p>test</p>';
				});
			}
		});

		conversion.for('downcast').elementToElement({
			model: 'mediaEmbed',
			view: (modelElement, { writer }) => {
				const socialMedia = modelElement.getAttribute('socialMedia');
				const iframe = modelElement.getAttribute('iframeRawHtml');

				if (!socialMedia || !iframe) {
					return null;
				}

				const previewImageAttributes = {
					src: socialMedia.image,
					style: 'width: 100%; height: 56.15%',
					alt: 'Video image test',
					class: 'consent-image-placeholder'
				};

				// const previewImage = writer.createEmptyElement(
				// 	'img',
				// 	previewImageAttributes
				// );
				const previewImageVisible = writer.createEmptyElement(
					'img',
					previewImageAttributes
				);

				writer.addClass('epp-iframe-image-placeholder', previewImageVisible);

				// const iframeContainer = writer.createRawElement(
				// 	'div'
				// );

				// const domDocumentFragment = writer.createContextualFragment(
				// 	iframe
				// );

				// iframeContainer.appendChild(domDocumentFragment);

				const mainContainer = writer.createContainerElement(
					'div',
					{
						class: 'cald_consent_wrapper'
					},
					[
						// writer.createRawElement('div', {}, domDocument => {
						// 	this.createPreviewContainer({
						// 		writer,
						// 		domDocument,
						// 		rawHTMLValue: iframe
						// 	});
						// }, true),

						// writer.createRawElement('div', {}, domDocument => {
						// 	// const domRange = writer.createRangeOn(domDocument);
						// 	domDocument.innerHTML = domDocumentFragment;
						// }, true),
						// iframeContainer,

						writer.createRawElement(
							'div',
							{
								class: `epp-ckeditor-iframe ${ socialMedia.classes }`
							},
							element => {
								element.innerHTML = iframe;
							},
							true
						),
						previewImageVisible,

						writer.createRawElement(
							'script',
							{
								'cald-gdpr': 'definition',
								type: 'text/plain'
							},
							element => {
								element.innerHTML = `{"vendor_id":"${ socialMedia.vendorId }","tag":"div"}`;
							},
							true
						),

						writer.createContainerElement(
							'script',
							{
								'cald-gdpr': 'consent',
								type: 'text/plain',
								class: 'consent-content'
							},
							[
								writer.createRawElement(
									'div',
									{
										class: socialMedia.classes
									},
									element => {
										element.innerHTML = iframe
											.replace('<script', '<custom_script')
											.replace('</script>', '</custom_script>');
									}
								)
							],
							true
						)

						// writer.createContainerElement(
						// 	'script',
						// 	{
						// 		'cald-gdpr': 'no-consent',
						// 		type: 'text/plain'
						// 	},
						// 	[]
						// )
					]
				);

				return mainContainer;
			}
		});
	}

	createPreviewContainer({ writer, domDocument, rawHTMLValue }) {
		const domPreviewContent = writer.createRawElement(domDocument, 'div', {
			class: 'raw-html-embed__preview-content'
		});
		// Creating a contextual document fragment allows executing scripts when inserting into the preview element.
		// See: #8326.
		const domRange = domDocument.createRange();
		const domDocumentFragment = domRange.createContextualFragment(
			rawHTMLValue
		);
		domPreviewContent.appendChild(domDocumentFragment);
		return domPreviewContent;
	}
}
