import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html' 
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/SvelteTaag' : ''
		}
	},
};

export default config;