/* eslint-disable no-undef */
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
	GeneralHtmlSupport
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import {
	EPPMediaEmbed,
	EPPCopyCitation
} from '../src/index.js';

/* global document, window */

ClassicEditor.create(document.querySelector('#editor'), {
	plugins: [
		EPPMediaEmbed,
		EPPCopyCitation,
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
		GeneralHtmlSupport
	],
	toolbar: [
		'undo',
		'redo',
		'sourceEditing',
		'|',
		'EPPmediaEmbedButton',
		'EPPCopyCitation',
		'EPPYoutubeEmbedButton',
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
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
	},
	htmlSupport: {
		allow: [
			{
				name: 'iframe',
				attributes: ['src', 'frameborder', 'allowfullscreen', 'allow', 'class']
			},
			{
				name: 'script',
				attributes: ['src', 'type', 'charset', 'async', 'defer']
			}
		]
	}
})
	.then(editor => {
		window.editor = editor;
		CKEditorInspector.attach(editor);
		window.console.log('CKEditor 5 is ready.', editor);

		document.getElementById('saveButton').addEventListener('click', () => {
			const data = editor.getData();
			const blob = new Blob([data], { type: 'text/html' });
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'contenu.html';
			a.click();

			URL.revokeObjectURL(url);
		});

		document.getElementById('showButton').addEventListener('click', () => {
			const data = editor.getData();
			document.getElementById('displayArea').innerHTML = data;

			if (window.twttr) {
				window.twttr.widgets.load();
			}
		});
	})
	.catch(err => {
		window.console.error(err.stack);
	});
