import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Grid,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';

import { Modal } from '../../';
import { CurrencyFormat } from '../../../util/Parser';

const useStyles = makeStyles((theme) => ({
	row: {
		padding: '4px 0',
		borderBottom: `1px solid ${theme.palette.border.divider}`,
		transition: 'background ease-in 0.1s',
		'&:hover': {
			background: `${theme.palette.primary.main}0a`,
			cursor: 'pointer',
		},
		'&:last-child': { borderBottom: 'none' },
	},
	trans: {
		width: 40,
		height: 40,
		minWidth: 40,
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		background: theme.palette.info.dark,
		color: '#fff',
		'&.transfer': { background: '#7c4d1a' },
		'&.withdraw': { background: theme.palette.error.dark },
		'&.deposit': { background: theme.palette.success.dark },
		'&.fine': { background: theme.palette.error.dark },
		'&.fine_profit': { background: theme.palette.success.dark },
		'&.bill': { background: theme.palette.error.dark },
		'&.paycheck': { background: theme.palette.success.dark },
	},
	amountPositive: {
		color: theme.palette.success.main,
		fontWeight: 700,
		fontSize: 15,
		fontFamily: 'Inter, Roboto, sans-serif',
		letterSpacing: '0.01em',
	},
	amountNegative: {
		color: theme.palette.error.light,
		fontWeight: 700,
		fontSize: 15,
		fontFamily: 'Inter, Roboto, sans-serif',
		letterSpacing: '0.01em',
	},
	primText: {
		fontSize: 14,
		fontWeight: 600,
		fontFamily: 'Inter, Roboto, sans-serif',
		color: theme.palette.text.main,
		lineHeight: 1.4,
		letterSpacing: '0.01em',
	},
	secText: {
		fontSize: 12,
		fontFamily: 'Inter, Roboto, sans-serif',
		fontWeight: 400,
		color: theme.palette.text.alt,
		marginTop: 3,
		letterSpacing: '0.02em',
		opacity: 0.9,
	},
	type: {
		textTransform: 'capitalize',
		fontWeight: 500,
		fontFamily: 'Inter, Roboto, sans-serif',
		letterSpacing: '0.03em',
	},
}));

export default ({ transaction }) => {
	const classes = useStyles();

	const [viewing, setViewing] = useState(false);

	const getTransIcon = () => {
		switch (transaction.Type) {
			case 'transfer':
				return <FontAwesomeIcon icon={['fas', 'right-left']} />;
			case 'withdraw':
				return <FontAwesomeIcon icon={['fas', 'money-bill-wave']} />;
			case 'deposit':
				return <FontAwesomeIcon icon={['fas', 'money-bill-wave']} />;
			case 'fine':
				return <FontAwesomeIcon icon={['fas', 'ticket']} />;
			case 'fine_profit':
				return (
					<FontAwesomeIcon icon={['fas', 'hand-holding-dollar']} />
				);
			case 'bill':
				return <FontAwesomeIcon icon={['fas', 'file-invoice-dollar']} />;
			case 'paycheck':
				return <FontAwesomeIcon icon={['fas', 'money-check-dollar']} />;
			default:
				return <FontAwesomeIcon icon={['fas', 'question']} />;
		}
	};

	const isNegative = ['withdraw', 'fine', 'bill'].includes(transaction.Type);

	return (
		<>
			<ListItem className={classes.row} onClick={() => setViewing(true)} disablePadding>
				<Grid container alignItems="center" style={{ padding: '8px 12px', gap: 0 }}>
					<Grid item style={{ marginRight: 12 }}>
						<div className={`${classes.trans} ${transaction.Type}`}>
							{getTransIcon()}
						</div>
					</Grid>
					<Grid item xs>
						<div className={classes.primText}>{transaction.Title}</div>
						<div className={classes.secText}>
							<Moment date={transaction.Timestamp * 1000} format="MMM D, YYYY · h:mm A" />
						</div>
					</Grid>
					<Grid item style={{ textAlign: 'right' }}>
						<div className={isNegative ? classes.amountNegative : classes.amountPositive}>
						{isNegative ? '-' : '+'}{CurrencyFormat.format(Math.abs(transaction.Amount))}
						</div>
						<div className={classes.secText} style={{ textAlign: 'right' }}>
							<span className={classes.type}>{transaction.Type}</span>
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
				<List>
					<ListItem>
						<ListItemText
							primary="Transaction Title"
							secondary={transaction.Title}
						/>
					</ListItem>
					<ListItem>
						<ListItemText
							primary="Transaction Type"
							secondary={
								<span className={classes.type}>
									{transaction.Type}
								</span>
							}
						/>
					</ListItem>
					<ListItem>
						<ListItemText
							primary="Transaction Description"
							secondary={transaction.Description}
						/>
					</ListItem>
					<ListItem>
						<ListItemText
							primary="Transaction Date"
							secondary={
								<Moment
									date={transaction.Timestamp * 1000}
									format="LLLL"
								/>
							}
						/>
					</ListItem>
					<ListItem>
						<ListItemText
							primary="Transaction Amount"
							secondary={
								<span className={classes.money}>
									{CurrencyFormat.format(transaction.Amount)}
								</span>
							}
						/>
					</ListItem>
				</List>
			</Modal>
		</>
	);
};
