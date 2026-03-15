import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Grid,
	Chip,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';

import { Modal } from '../../';
import { CurrencyFormat } from '../../../util/Parser';

const TYPE_CONFIG = {
	transfer: {
		icon: ['fas', 'right-left'],
		colorKey: 'info',
		label: 'Transfer',
	},
	withdraw: {
		icon: ['fas', 'arrow-up'],
		colorKey: 'primary',   // teal replaces red
		label: 'Withdrawal',
	},
	deposit: {
		icon: ['fas', 'arrow-down'],
		colorKey: 'success',
		label: 'Deposit',
	},
	fine: {
		icon: ['fas', 'ticket'],
		colorKey: 'primary',   // teal replaces red
		label: 'Fine',
	},
};

const useStyles = makeStyles((theme) => ({
	row: {
		borderRadius: 8,
		marginBottom: 4,
		transition: 'background 0.15s ease',
		'&:hover': {
			background: `${theme.palette.primary.main}08`,
			cursor: 'pointer',
		},
	},
	avatar: {
		width: 38,
		height: 38,
		borderRadius: 10,
		fontSize: 15,
	},
	// Dynamic avatar colors per type
	avatarTransfer: {
		background: `${theme.palette.info.main}22`,
		color: theme.palette.info.main,
	},
	avatarWithdraw: {
		background: `${theme.palette.primary.main}22`,  // teal bg
		color: theme.palette.primary.main,               // teal icon
	},
	avatarDeposit: {
		background: `${theme.palette.success.main}22`,
		color: theme.palette.success.main,
	},
	avatarFine: {
		background: `${theme.palette.primary.main}22`,  // teal bg
		color: theme.palette.primary.main,               // teal icon
	},
	avatarDefault: {
		background: `${theme.palette.text.alt}18`,
		color: theme.palette.text.alt,
	},
	amountPositive: {
		color: theme.palette.success.main,
		fontWeight: 600,
		fontSize: 13,
		fontVariantNumeric: 'tabular-nums',
	},
	amountNeutral: {
		color: theme.palette.primary.main,
		fontWeight: 600,
		fontSize: 13,
		fontVariantNumeric: 'tabular-nums',
	},
	typeChip: {
		height: 20,
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.06em',
		textTransform: 'uppercase',
		borderRadius: 4,
	},
	detailLabel: {
		fontSize: 11,
		color: theme.palette.text.alt,
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
		fontWeight: 600,
		marginBottom: 2,
	},
	detailValue: {
		fontSize: 14,
		color: theme.palette.text.main,
	},
	detailAmount: {
		fontSize: 18,
		fontWeight: 700,
		color: theme.palette.success.main,
		fontVariantNumeric: 'tabular-nums',
	},
	modalSection: {
		padding: '10px 0',
		'&:not(:last-of-type)': {
			borderBottom: `1px solid ${theme.palette.border.divider}`,
			marginBottom: 10,
		},
	},
}));

const getAvatarClass = (type, classes) => {
	switch (type) {
		case 'transfer': return classes.avatarTransfer;
		case 'withdraw': return classes.avatarWithdraw;
		case 'deposit':  return classes.avatarDeposit;
		case 'fine':     return classes.avatarFine;
		default:         return classes.avatarDefault;
	}
};

export default ({ transaction }) => {
	const classes = useStyles();
	const [viewing, setViewing] = useState(false);

	const config = TYPE_CONFIG[transaction.Type] || {
		icon: ['fas', 'question'],
		label: transaction.Type,
	};

	const isIncoming = transaction.Type === 'deposit';

	return (
		<>
			<ListItem className={classes.row} onClick={() => setViewing(true)}>
				<Grid container alignItems="center" spacing={1}>
					<Grid item xs="auto">
						<Avatar
							className={`${classes.avatar} ${getAvatarClass(transaction.Type, classes)}`}
						>
							<FontAwesomeIcon icon={config.icon} />
						</Avatar>
					</Grid>
					<Grid item xs>
						<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
							<span style={{ fontSize: 13, fontWeight: 600 }}>
								{transaction.Title}
							</span>
						</div>
						<Moment
							style={{ fontSize: 11, opacity: 0.5 }}
							date={transaction.Timestamp * 1000}
							format="MMM D, YYYY · h:mm A"
						/>
					</Grid>
					<Grid item xs="auto" style={{ textAlign: 'right' }}>
						<div className={isIncoming ? classes.amountPositive : classes.amountNeutral}>
							{isIncoming ? '+' : ''}{CurrencyFormat.format(transaction.Amount)}
						</div>
						<div style={{ fontSize: 10, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
							{config.label}
						</div>
					</Grid>
				</Grid>
			</ListItem>

			<Modal
				open={viewing}
				title="Transaction Details"
				closeLang="Close"
				onClose={() => setViewing(false)}
			>
				<div className={classes.modalSection}>
					<div className={classes.detailLabel}>Title</div>
					<div className={classes.detailValue}>{transaction.Title}</div>
				</div>
				<div className={classes.modalSection}>
					<div className={classes.detailLabel}>Type</div>
					<div className={classes.detailValue}>{config.label}</div>
				</div>
				{transaction.Description && (
					<div className={classes.modalSection}>
						<div className={classes.detailLabel}>Description</div>
						<div className={classes.detailValue}>{transaction.Description}</div>
					</div>
				)}
				<div className={classes.modalSection}>
					<div className={classes.detailLabel}>Date</div>
					<div className={classes.detailValue}>
						<Moment date={transaction.Timestamp * 1000} format="LLLL" />
					</div>
				</div>
				<div className={classes.modalSection}>
					<div className={classes.detailLabel}>Amount</div>
					<div className={classes.detailAmount}>
						{CurrencyFormat.format(transaction.Amount)}
					</div>
				</div>
			</Modal>
		</>
	);
};
