import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, IconButton, Divider } from '@material-ui/core';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Fleeca from '../../assets/img/fleeca.png';
import Maze from '../../assets/img/maze.png';
import BlaineCo from '../../assets/img/blaineco.png';
import UnionDepo from '../../assets/img/ud.png';

import Nui from '../../util/Nui';
import { CurrencyFormat } from '../../util/Parser';

const useStyles = makeStyles((theme) => ({
	navbar: {
		backgroundColor: theme.palette.secondary.dark,
		width: '100%',
		borderBottom: `1px solid ${theme.palette.primary.main}30`,
		boxShadow: `0 1px 0 ${theme.palette.primary.main}20`,
	},
	tb: {
		minHeight: 64,
		padding: '0 16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'relative',
	},
	left: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 0,
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
	},
	bankLogoLink: {
		display: 'flex',
		alignItems: 'center',
		paddingRight: 20,
		marginRight: 4,
		transition: 'opacity ease-in 0.15s',
		'&:hover': { opacity: 0.8 },
	},
	bankLogo: {
		height: 36,
		width: 'auto',
		objectFit: 'contain',
	},
	navLink: {
		fontSize: 13,
		fontWeight: 500,
		letterSpacing: '0.06em',
		textTransform: 'uppercase',
		color: theme.palette.text.alt,
		transition: 'color ease-in 0.15s',
		padding: '4px 14px',
		borderRadius: 4,
		'&:hover': { color: theme.palette.primary.light },
		'&.active': {
			color: theme.palette.primary.main,
			background: `${theme.palette.primary.main}15`,
		},
		'&:not(:last-of-type)': { marginRight: 4 },
	},
	right: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: 12,
		flex: 1,
	},
	userInfo: {
		textAlign: 'right',
	},
	userName: {
		fontSize: 14,
		fontWeight: 600,
		color: theme.palette.text.main,
		letterSpacing: '0.02em',
		'& span': { color: theme.palette.primary.main },
	},
	userCash: {
		fontSize: 15,
		fontWeight: 500,
		color: theme.palette.success.main,
		'&::before': {
			content: '"Cash\u00a0"',
			color: theme.palette.text.alt,
			fontWeight: 400,
		},
	},
	closeBtn: {
		color: theme.palette.text.alt,
		width: 32,
		height: 32,
		transition: 'color ease-in 0.15s, background ease-in 0.15s',
		'&:hover': {
			color: '#ff5555',
			background: 'rgba(255,85,85,0.1)',
		},
	},
}));

export default () => {
	const classes = useStyles();
	const brand = useSelector((state) => state.app.brand);
	const app = useSelector((state) => state.app.app);
	const user = useSelector((state) => state.data.data.character);

	const getBranding = () => {
		switch (brand) {
			case 'fleeca': return Fleeca;
			case 'maze': return Maze;
			case 'blaineco': return BlaineCo;
			case 'ud': return UnionDepo;
			default: return Fleeca;
		}
	};

	const getNavLinks = () => {
		switch (app) {
			case 'BANK':
				return [
					{ link: '/', label: 'My Accounts', isExact: true },
					// { link: '/loans', label: 'My Loans', isExact: false },
					// { link: '/credit', label: 'My Credit', isExact: true },
				];
			case 'ATM':
				return [];
			default:
				return [];
		}
	};

	return (
		<AppBar elevation={0} position="relative" className={classes.navbar}>
			<Toolbar className={classes.tb} disableGutters>
				{/* Spacer to balance the right side so justify-content: space-between keeps right anchored */}
				<div style={{ flex: 1 }} />
				<div className={classes.left}>
					<Link to="/" className={classes.bankLogoLink}>
						<img src={getBranding()} className={classes.bankLogo} />
					</Link>
					{getNavLinks().length > 0 && (
						<>
							<Divider orientation="vertical" flexItem style={{ margin: '12px 16px 12px 0' }} />
							{getNavLinks().map((link, k) => (
								<NavLink
									key={`link-${k}`}
									className={classes.navLink}
									to={link.link}
									exact={link.isExact}
								>
									{link.label}
								</NavLink>
							))}
						</>
					)}
				</div>
				<div className={classes.right}>
					<div className={classes.userInfo}>
						<div className={classes.userName}>
							{user.First} <span>{user.Last}</span>
						</div>
						<div className={classes.userCash}>
							{CurrencyFormat.format(user.Cash)}
						</div>
					</div>
					<Divider orientation="vertical" flexItem style={{ margin: '12px 4px' }} />
					<IconButton className={classes.closeBtn} onClick={() => Nui.send('Close')} size="small">
						<FontAwesomeIcon icon={['fas', 'xmark']} size="sm" />
					</IconButton>
				</div>
			</Toolbar>
		</AppBar>
	);
};
