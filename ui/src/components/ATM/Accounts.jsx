import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import { AccountButton } from '../';
import AccountPanel from './components/AccountPanel';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100%',
	},
	sidebar: {
		width: 280,
		flexShrink: 0,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		background: theme.palette.secondary.main,
		borderRight: `1px solid ${theme.palette.border.divider}`,
		overflowY: 'auto',
		overflowX: 'hidden',
		'&::-webkit-scrollbar': { width: 3 },
		'&::-webkit-scrollbar-thumb': {
			background: `${theme.palette.primary.main}30`,
			borderRadius: 2,
		},
	},
	sidebarSection: {
		padding: '16px 12px 6px',
	},
	sectionLabel: {
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.12em',
		textTransform: 'uppercase',
		color: theme.palette.primary.main,
		opacity: 0.7,
		paddingLeft: 4,
		marginBottom: 4,
		display: 'flex',
		alignItems: 'center',
		gap: 6,
		'&::after': {
			content: '""',
			flex: 1,
			height: 1,
			background: `${theme.palette.primary.main}20`,
		},
	},
	mainArea: {
		flex: 1,
		height: '100%',
		overflowY: 'auto',
		overflowX: 'hidden',
		background: theme.palette.secondary.dark,
		'&::-webkit-scrollbar': { width: 4 },
		'&::-webkit-scrollbar-thumb': {
			background: `${theme.palette.primary.main}30`,
			borderRadius: 2,
		},
	},
}));

export default () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const accounts = useSelector((state) => state.data.data.accounts);
	const selected = useSelector((state) => state.bank.selected);

	const [personal, setPersonal] = useState([]);
	const [savings, setSavings] = useState([]);
	const [organization, setOrganization] = useState([]);

	useEffect(() => {
		if (!Boolean(selected) && accounts.length > 0) {
			dispatch({
				type: 'SELECT_ACCOUNT',
				payload: { account: accounts[0]._id },
			});
		}
	}, [accounts, selected]);

	useEffect(() => {
		if (accounts.length > 0) {
			setPersonal(accounts.filter((a) => a.Type == 'personal'));
			setSavings(accounts.filter((a) => a.Type == 'personal_savings'));
			setOrganization(accounts.filter((a) => a.Type == 'organization'));
		} else {
			setPersonal([]);
			setSavings([]);
			setOrganization([]);
		}
	}, [accounts]);

	const onClick = (acc) => {
		dispatch({
			type: 'SELECT_ACCOUNT',
			payload: { account: acc },
		});
	};

	return (
		<div className={classes.root}>
			<div className={classes.sidebar}>
				{personal.length > 0 && (
					<div className={classes.sidebarSection}>
						<div className={classes.sectionLabel}>Personal</div>
						{personal.map((acc) => (
							<AccountButton key={acc._id} account={acc} onSelected={onClick} />
						))}
					</div>
				)}
				{savings.length > 0 && (
					<div className={classes.sidebarSection}>
						<div className={classes.sectionLabel}>Savings</div>
						{savings.map((acc) => (
							<AccountButton key={acc._id} account={acc} onSelected={onClick} />
						))}
					</div>
				)}
				{organization.length > 0 && (
					<div className={classes.sidebarSection}>
						<div className={classes.sectionLabel}>Organization</div>
						{organization.map((acc) => (
							<AccountButton key={acc._id} account={acc} onSelected={onClick} />
						))}
					</div>
				)}
			</div>
			<div className={classes.mainArea}>
				<AccountPanel />
			</div>
		</div>
	);
};
