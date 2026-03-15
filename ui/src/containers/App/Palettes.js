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
		primary: TealPrimary,
	};
};

export const BlaineCo = (theme) => {
	return {
		...StandardPalette(theme),
		primary: TealPrimary,
	};
};

export const StandardPalette = (theme) => {
	return {
		primary: TealPrimary,
		secondary: {
			main: '#111518',
			light: '#181d22',
			dark: '#0c0e11',
			contrastText: '#ffffff',
		},
		error: {
			main: '#008c7c',
			light: '#00c9b1',
			dark: '#005a4f',
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
			alt: 'rgba(255, 255, 255, 0.55)',
			info: '#919191',
			light: '#ffffff',
			dark: '#000000',
		},
		border: {
			main: '#e0e0e008',
			light: '#ffffff',
			dark: '#1e2328',
			input: 'rgba(255, 255, 255, 0.12)',
			divider: 'rgba(0, 201, 177, 0.1)',
			item: 'rgb(255, 255, 255)',
		},
		mode: 'dark',
	};
};
