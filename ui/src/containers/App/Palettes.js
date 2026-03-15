const TealPrimary = {
	main: '#00c9b1',
	light: '#4ddece',
	dark: '#008c7c',
	contrastText: '#0a0a0a',
};

export default (brand, theme) => {
	switch (brand) {
		case 'fleeca':
			return Fleeca(theme);
		case 'maze':
			return Maze(theme);
		case 'blaineco':
			return BlaineCo(theme);
		default:
			return StandardPalette(theme);
	}
};

export const Fleeca = (theme) => {
	return {
		...StandardPalette(theme),
		primary: TealPrimary,
	};
};

export const Maze = (theme) => {
	return {
		...StandardPalette(theme),
		primary: {
			main: '#ee222e',
			light: '#f28f95',
			dark: '#840008',
			contrastText: '#ffffff',
		},
	};
};

export const BlaineCo = (theme) => {
	return {
		...StandardPalette(theme),
		primary: {
			main: '#921b1f',
			light: '#d45054',
			dark: '#921b1f',
			contrastText: '#ffffff',
		},
	};
};

export const StandardPalette = (theme) => {
	return {
		primary: TealPrimary,
		secondary: {
			main: '#141414',
			light: '#1c1c1c',
			dark: '#0f0f0f',
			contrastText: '#ffffff',
		},
		error: {
			main: '#6e1616',
			light: '#a13434',
			dark: '#430b0b',
		},
		success: {
			main: '#52984a',
			light: '#60eb50',
			dark: '#244a20',
		},
		warning: {
			main: '#f09348',
			light: '#f2b583',
			dark: '#b05d1a',
		},
		info: {
			main: '#247ba5',
			light: '#247ba5',
			dark: '#175878',
		},
		text: {
			main: '#ffffff',
			alt: 'rgba(255, 255, 255, 0.7)',
			info: '#919191',
			light: '#ffffff',
			dark: '#000000',
		},
		border: {
			main: '#e0e0e008',
			light: '#ffffff',
			dark: '#26292d',
			input: 'rgba(255, 255, 255, 0.23)',
			divider: 'rgba(255, 255, 255, 0.12)',
			item: 'rgb(255, 255, 255)',
		},
		mode: 'dark',
	};
};
