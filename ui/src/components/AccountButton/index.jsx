import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Truncate from 'react-truncate';

import { CurrencyFormat } from '../../util/Parser';

const useStyles = makeStyles((theme) => ({
	btn: {
		width: '100%',
		fontSize: 15,
		color: theme.palette.text.alt,
		borderRadius: 0,
		display: 'block',
		textAlign: 'left',
		padding: '11px 14px',
		borderLeft: '3px solid transparent',
		transition: 'all ease-in 0.15s',
		'&:hover': {
			background: `${theme.palette.primary.main}10`,
			color: theme.palette.text.main,
			borderLeftColor: `${theme.palette.primary.main}60`,
		},
		'&.selected': {
			background: `${theme.palette.primary.main}18`,
			color: theme.palette.text.main,
			borderLeftColor: theme.palette.primary.main,
		},
		'& small': {
			display: 'block',
			fontSize: 15,
			marginTop: 3,
			color: theme.palette.success.main,
			'&::before': {
				color: theme.palette.text.alt,
				marginRight: 4,
				content: '"Balance"',
				fontSize: 13,
				letterSpacing: '0.04em',
				textTransform: 'uppercase',
			},
		},
	},
	acctName: {
		width: '100%',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		fontWeight: 500,
		fontSize: 15,
		letterSpacing: '0.01em',
	},
}));

export default ({ account, onSelected }) => {
	const classes = useStyles();
	const selected = useSelector((state) => state.bank.selected);

	const isSelected = selected == account._id;

	return (
		<Button
			className={`${classes.btn}${isSelected ? ' selected' : ''}`}
			onClick={() => onSelected(isSelected ? null : account._id)}
		>
			<div className={classes.acctName}>
				<Truncate lines={1}>{account.Name}</Truncate>
			</div>
			{account?.Permissions?.BALANCE && (
				<small>{CurrencyFormat.format(account.Balance)}</small>
			)}
		</Button>
	);
};
