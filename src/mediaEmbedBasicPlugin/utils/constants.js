export const ALLOWED_SOCIAL_MEDIAS = [
	{
		name: 'twitter',
		regex:
			new RegExp([/^<blockquote.*class="twitter-tweet".*><\/blockquote>/.source +
				/.*<script.*src="https:\/\/platform\.twitter\.com\/widgets\.js".*><\/script>$/.source]),
		vendorId: 'twitter',
		missingConsentText:
			`This tweet was blocked because of your cookies settings
			 To be able to see the tweet, you must consent to the use of X on our site.`,
		image:
			'/sites/default/files/default_images/consent-image-social-network.jpeg',
		classes: 'media_embed_twitter'
	},
	{
		name: 'spotify',
		regex:
			/^<(iframe|blockquote).*src="https?:\/\/open\.spotify\.com\/embed\/.*"><\/(iframe|blockquote)>$/,
		vendorId: 'c:spotify-embed',
		missingConsentText:
			`This podcast was blocked because of your cookies settings.
			To be able to listen to the podcast, you must consent to the use of Spotify on our site.`,
		image:
			'/sites/default/files/default_images/consent-image-social-network.jpeg',
		classes: 'media_embed'
	},
	{
		name: 'youtube',
		regex:
			/^<iframe.*src="https:\/\/(www\.)?youtube.com\/embed\/.*".*><\/iframe>/,
		vendorId: 'c:youtube',
		missingConsentText:
			`This video was blocked because of your cookies settings.
			To be able to watch the video, you must consent to the use of Youtube on our site.`,
		image: '/sites/default/files/default_images/consent-image-youtube.jpeg',
		classes: 'media_embed'
	},
	{
		name: 'linkedin',
		regex:
			/^<iframe.*src="https?:\/\/(www\.)?linkedin\.com\/embed\/.*"><\/iframe>$/,
		vendorId: 'c:linkedin',
		missingConsentText:
			`This post was blocked because of your cookies settings.
			To be able to see the post, you must consent to the use of Linkedin on our site.`,
		image:
			'/sites/default/files/default_images/consent-image-social-network.jpeg',
		classes: 'media_embed'
	},
	{
		name: 'facebook',
		regex:
			/^<iframe.*src="https?:\/\/(www\.)?facebook\.com\/plugins\/.*"><\/iframe>$/,
		vendorId: 'facebook',
		missingConsentText:
			`This post was blocked because of your cookies settings.
			To be able to see the post, you must consent to the use of Facebook on our site.`,
		image:
			'/sites/default/files/default_images/consent-image-social-network.jpeg',
		classes: 'media_embed'
	}
];
