import { createElement, HtmlEmbedEditing, toWidget } from 'ckeditor5';
import { getCustomIframeElementString } from './utils/utils.js';

export default class MediaEmbedEditing extends HtmlEmbedEditing {
	localInit() {
		const editor = this.editor;
		const schema = editor.model.schema;
		schema.extend('rawHtml', {
			allowAttributes: ['value', 'socialMedia', 'customIframeProperties']
		});
	}

	/**
	 * Prepares converters for the feature.
	 */
	_setupConversion() {
		this.localInit();
		const editor = this.editor;
		const t = editor.t;
		// const view = editor.editing.view;
		const widgetButtonViewReferences = this._widgetButtonViewReferences;
		const htmlEmbedConfig = editor.config.get('htmlEmbed');
		// Destroy UI buttons created for widgets that have been removed from the view document (e.g. in the previous conversion).
		// This prevents unexpected memory leaks from UI views.
		this.editor.editing.view.on(
			'render',
			() => {
				for (const buttonView of widgetButtonViewReferences) {
					if (buttonView.element && buttonView.element.isConnected) {
						return;
					}
					buttonView.destroy();
					widgetButtonViewReferences.delete(buttonView);
				}
			},
			{ priority: 'lowest' }
		);
		// Register div.raw-html-embed as a raw content element so all of it's content will be provided
		// as a view element's custom property while data upcasting.
		editor.data.registerRawContentMatcher({
			name: 'div',
			classes: 'raw-html-embed'
		});
		editor.conversion.for('upcast').elementToElement({
			view: {
				name: 'div',
				classes: 'raw-html-embed'
			},
			model: (viewElement, { writer }) => {
				// The div.raw-html-embed is registered as a raw content element,
				// so all it's content is available in a custom property.
				return writer.createElement('rawHtml', {
					value: viewElement.getCustomProperty('$rawContent')
				});
			}
		});
		editor.conversion.for('dataDowncast').elementToElement({
			model: 'rawHtml',
			view: (modelElement, { writer }) => {
				const socialMedia = modelElement.getAttribute('socialMedia');
				const customIframeProperties = modelElement.getAttribute('customIframeProperties');

				const definitionContainer = writer.createRawElement('script', {
					'cald-gdpr': 'definition',
					'type': 'text/plain'
				}, element => {
					element.innerHTML = JSON.stringify({
						vendor_id: socialMedia.vendorId,
						tag: 'div'
					});
				});

				// Consent part
				let iframeContainer;
				if (customIframeProperties) {
					iframeContainer = writer.createRawElement(
						'div',
						{ class: socialMedia.classes },
						function (domElement) {
							domElement.innerHTML = getCustomIframeElementString(customIframeProperties);
						}
					);
				} else {
					iframeContainer = writer.createRawElement(
						'div',
						{ class: socialMedia.classes },
						function (domElement) {
							domElement.innerHTML = modelElement.getAttribute('value')
								.replace('<script', '<custom_script')
								.replace('</script>', '</custom_script>') || '';
						}
					);
				}
				const consentContainer = writer.createContainerElement('script', {
					'cald-gdpr': 'consent',
					type: 'text/plain',
					class: 'consent-content'
				}, [iframeContainer]);

				// No Consent part
				const placeholderImage = writer.createEmptyElement('img', {
					src: socialMedia.image,
					alt: t('Placeholder image'),
					class: 'consent-image-placeholder',
					style: 'width: 100%; height: 56.15%'
				});

				const noConsentOverlay = writer.createContainerElement('div', {
					class: 'no-consent-overlay'
				}, [
					writer.createContainerElement('div', {
						class: 'overlay-wrapper'
					}, [
						writer.createRawElement('p', {}, e => { e.innerHTML = socialMedia.missingConsentText; }),
						writer.createContainerElement('div', {
							class: 'no-consent-link-to-cmp'
						}, [
							writer.createRawElement('a', {
								href: '#',
								class: 'epp-prevent-link link-to-cmp btn-solid-md'
							}, element => {
								element.innerHTML = 'Change my consent settings';
							})
						])
					])
				]);

				const noConsentContainer = writer.createContainerElement('script', {
					'cald-gdpr': 'no-consent',
					type: 'text/plain'
				}, [
					placeholderImage,
					noConsentOverlay
				]);

				const container = writer.createContainerElement('div', {
					class: 'cald_consent_wrapper'
				}, [
					// iframeContainer,
					definitionContainer,
					consentContainer,
					noConsentContainer
				]);
				return container;
			}
		});

		editor.conversion.for('editingDowncast').elementToStructure({
			model: { name: 'rawHtml', attributes: ['value'] },
			view: (modelElement, { writer }) => {
				let domContentWrapper;
				let state;
				let props;
				const customIframeProperties = modelElement.getAttribute('customIframeProperties');
				const viewContentWrapper = writer.createRawElement(
					'div',
					{
						class: 'raw-html-embed__content-wrapper'
					},
					function (domElement) {
						domContentWrapper = domElement;
						renderContent({ editor, domElement, state, props });
						// Since there is a `data-cke-ignore-events` attribute set on the wrapper element in the editable mode,
						// the explicit `mousedown` handler on the `capture` phase is needed to move the selection onto the whole
						// HTML embed widget.
						domContentWrapper.addEventListener(
							'mousedown',
							() => {
								if (state.isEditable) {
									const model = editor.model;
									const selectedElement =
										model.document.selection.getSelectedElement();
									// Move the selection onto the whole HTML embed widget if it's currently not selected.
									if (selectedElement !== modelElement) {
										model.change(writer =>
											writer.setSelection(modelElement, 'on')
										);
									}
								}
							},
							true
						);
					}
				);

				state = {
					showPreviews: htmlEmbedConfig.showPreviews,
					isEditable: false,
					getRawHtmlValue: () => {
						if (customIframeProperties) {
							return getCustomIframeElementString(customIframeProperties);
						}
						return modelElement.getAttribute('value') ?? '';
					}
				};
				props = {
					sanitizeHtml: htmlEmbedConfig.sanitizeHtml,
					textareaPlaceholder: t('Paste raw HTML here...')
				};
				const viewContainer = writer.createContainerElement(
					'div',
					{
						class: 'raw-html-embed',
						'data-html-embed-label': t('HTML snippet'),
						dir: editor.locale.uiLanguageDirection
					},
					viewContentWrapper
				);
				// writer.setCustomProperty('rawHtmlApi', rawHtmlApi, viewContainer);
				writer.setCustomProperty('rawHtml', true, viewContainer);
				return toWidget(viewContainer, writer, {
					label: t('HTML snippet'),
					hasSelectionHandle: true
				});
			}
		});
		function renderContent({ editor, domElement, state, props }) {
			// Remove all children;
			domElement.textContent = '';
			const domDocument = domElement.ownerDocument;
			const previewContainerProps = {
				sanitizeHtml: props.sanitizeHtml
			};
			domElement.append(
				createPreviewContainer({
					domDocument,
					state,
					props: previewContainerProps,
					editor
				})
			);
		}

		function createPreviewContainer({ editor, domDocument, state, props }) {
			const sanitizedOutput = props.sanitizeHtml(state.getRawHtmlValue());
			const placeholderText =
				state.getRawHtmlValue().length > 0 ?
					t('No preview available') :
					t('Empty snippet content');
			const domPreviewPlaceholder = createElement(
				domDocument,
				'div',
				{
					class: 'ck ck-reset_all raw-html-embed__preview-placeholder'
				},
				placeholderText
			);
			const domPreviewContent = createElement(domDocument, 'div', {
				class: 'raw-html-embed__preview-content',
				dir: editor.locale.contentLanguageDirection
			});
			// Creating a contextual document fragment allows executing scripts when inserting into the preview element.
			// See: #8326.
			const domRange = domDocument.createRange();
			const domDocumentFragment = domRange.createContextualFragment(
				sanitizedOutput.html
			);
			domPreviewContent.appendChild(domDocumentFragment);
			const domPreviewContainer = createElement(
				domDocument,
				'div',
				{
					class: 'raw-html-embed__preview'
				},
				[domPreviewPlaceholder, domPreviewContent]
			);
			return domPreviewContainer;
		}
	}
}
