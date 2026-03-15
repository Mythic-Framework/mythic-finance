import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CurrencyFormat } from '../../util/Parser';

const useStyles = makeStyles((theme) => ({
	btn: {
		width: '100%',
		borderRadius: 7,
		border: '1px solid transparent',
		background: 'transparent',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		padding: '8px 6px',
		marginBottom: 2,
		textAlign: 'left',
		transition: 'all 0.15s ease',
		color: theme.palette.text.alt,
		'&:hover': {
			background: `${theme.palette.primary.main}0c`,
			borderColor: `${theme.palette.primary.main}25`,
			color: theme.palette.text.main,
		},
		'&.selected': {
			background: `${theme.palette.primary.main}14`,
			borderColor: `${theme.palette.primary.main}50`,
			color: theme.palette.text.main,
		},
	},
	iconWrap: {
		width: 28,
		height: 28,
		flexShrink: 0,
		borderRadius: 6,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: `${theme.palette.primary.main}14`,
		color: theme.palette.primary.main,
		fontSize: 12,
	},
	info: {
		flex: 1,
		minWidth: 0,
	},
	name: {
		fontSize: 12,
		fontWeight: 500,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	},
	balance: {
		fontSize: 11,
		color: theme.palette.success.main,
		marginTop: 1,
		fontVariantNumeric: 'tabular-nums',
	},
}));

const getIcon = (type) => {
	switch (type) {
		case 'personal':         return ['fas', 'credit-card'];
		case 'personal_savings': return ['fas', 'piggy-bank'];
		case 'organization':     return ['fas', 'landmark'];
		default:                 return ['fas', 'money-bill-wave'];
	}
};

export default ({ account, onSelected }) => {
	const classes = useStyles();
	const selected = useSelector((state) => state.bank.selected);
	const isSelected = selected == account._id;

	return (
		<button
			className={`${classes.btn}${isSelected ? ' selected' : ''}`}
			onClick={() => onSelected(isSelected ? null : account._id)}
		>
			<div className={classes.iconWrap}>
				<FontAwesomeIcon icon={getIcon(account.Type)} />
			</div>
			<div className={classes.info}>
				<div className={classes.name}>{account.Name}</div>
				{account?.Permissions?.BALANCE && (
					<div className={classes.balance}>
						{CurrencyFormat.format(account.Balance)}
					</div>
				)}
			</div>
			{isSelected && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0, opacity: 0.8 }} />}
		</button>
	);
};
