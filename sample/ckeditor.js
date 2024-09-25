import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import {
	ClassicEditor,
	Autoformat,
	Base64UploadAdapter,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	Table,
	TableToolbar,
	SourceEditing,
	GeneralHtmlSupport,
	HtmlEmbed
	// ScriptElementSupport
} from 'ckeditor5';

import EPPMediaEmbed from '../src/mediaEmbedComplexPlugin/mediaembed.js';

import 'ckeditor5/ckeditor5.css';

/* global document, window */

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [
			EPPMediaEmbed,
			Essentials,
			Autoformat,
			BlockQuote,
			Bold,
			Heading,
			Image,
			ImageCaption,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Indent,
			Italic,
			Link,
			List,
			MediaEmbed,
			Paragraph,
			Table,
			TableToolbar,
			CodeBlock,
			Code,
			Base64UploadAdapter,
			SourceEditing,
			GeneralHtmlSupport,
			HtmlEmbed
			// ScriptElementSupport
		],
		toolbar: [
			'undo',
			'redo',
			'sourceEditing',
			'|',
			'EPPmediaEmbedButton',
			'|',
			'htmlEmbed',
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'code',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'uploadImage',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'codeBlock'
		],
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
				'|',
				'imageTextAlternative'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		htmlSupport: {
			allow: [
				{
					name: 'iframe',
					attributes: [ 'src', 'frameborder', 'allowfullscreen', 'allow', 'class' ]
				},
				{
					name: 'script',
					attributes: [ 'src', 'type', 'charset', 'async', 'defer' ]
				}
			]
		},
		htmlEmbed: {
			showPreviews: true
		}

	} )
	.then( editor => {
		window.editor = editor;
		CKEditorInspector.attach( editor );
		window.console.log( 'CKEditor 5 is ready.', editor );
	} )
	.catch( err => {
		window.console.error( err.stack );
	} );
