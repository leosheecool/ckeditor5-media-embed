export const getCustomIframeElementString = customIframeProperties => {
	return `<iframe
            width="${customIframeProperties.width ?? 600}"
            height="${customIframeProperties.height ?? 400}"
            src="${customIframeProperties.src}"
            title="${customIframeProperties.title}"
            frameborder="${customIframeProperties.frameborder}"
            allow="${customIframeProperties.allow.join('; ')}"
            referrerpolicy="strict-origin-when-cross-origin"
            ${customIframeProperties.allowfullscreen ? 'allowfullscreen' : ''}>
          </iframe>` || '';
};
