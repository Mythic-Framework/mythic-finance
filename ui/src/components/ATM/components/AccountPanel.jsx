import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Nui from '../../../util/Nui';
import { Modal, Loader } from '../../';
import { CurrencyFormat } from '../../../util/Parser';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: '24px 20px',
	},
	emptyState: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		padding: 40,
		color: theme.palette.text.alt,
		textAlign: 'center',
	},
	emptyIcon: {
		fontSize: 32,
		color: `${theme.palette.primary.main}40`,
		marginBottom: 8,
	},
	emptyTitle: {
		fontSize: 15,
		fontWeight: 600,
		color: theme.palette.text.alt,
		letterSpacing: '0.02em',
	},
	emptySubtitle: {
		fontSize: 12,
		color: `${theme.palette.text.alt}80`,
	},
	heroCard: {
		borderRadius: 12,
		background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
		border: `1px solid ${theme.palette.border.divider}`,
		padding: '24px 28px',
		marginBottom: 16,
	},
	heroLabel: {
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.14em',
		textTransform: 'uppercase',
		color: theme.palette.primary.main,
		marginBottom: 6,
	},
	heroBalance: {
		fontSize: 32,
		fontWeight: 700,
		color: theme.palette.text.main,
		letterSpacing: '-0.02em',
		lineHeight: 1.1,
		fontVariantNumeric: 'tabular-nums',
	},
	heroAccount: {
		fontSize: 11,
		color: theme.palette.text.alt,
		marginTop: 10,
		display: 'flex',
		alignItems: 'center',
		gap: 6,
		'& span': {
			fontFamily: 'monospace',
			fontSize: 12,
			color: `${theme.palette.text.alt}cc`,
			letterSpacing: '0.05em',
		},
	},
	hiddenBalance: {
		fontSize: 28,
		color: theme.palette.text.alt,
		letterSpacing: 6,
	},
	actionsRow: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: 12,
		marginBottom: 16,
	},
	actionCard: {
		borderRadius: 10,
		padding: '16px 18px',
		border: `1px solid ${theme.palette.border.divider}`,
		background: theme.palette.secondary.main,
		cursor: 'pointer',
		transition: 'all 0.18s ease',
		display: 'flex',
		alignItems: 'center',
		gap: 14,
		textAlign: 'left',
		'&:hover:not(:disabled)': {
			borderColor: `${theme.palette.primary.main}60`,
			background: `${theme.palette.primary.main}08`,
			transform: 'translateY(-1px)',
		},
		'&:disabled': {
			opacity: 0.38,
			cursor: 'not-allowed',
		},
	},
	actionIcon: {
		width: 40,
		height: 40,
		borderRadius: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		flexShrink: 0,
	},
	depositIcon: {
		background: `${theme.palette.success.main}18`,
		color: theme.palette.success.main,
	},
	withdrawIcon: {
		background: `${theme.palette.primary.main}18`,
		color: theme.palette.primary.main,
	},
	actionLabel: {
		fontSize: 13,
		fontWeight: 600,
		color: theme.palette.text.main,
		letterSpacing: '0.01em',
	},
	actionSub: {
		fontSize: 11,
		color: theme.palette.text.alt,
		marginTop: 1,
	},
	field: {
		marginBottom: 16,
	},
}));

export default () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.data.data.character);
	const accounts = useSelector((state) => state.data.data.accounts);
	const sel = useSelector((state) => state.bank.selected);

	const [loading, setLoading] = useState(null);
	const [account, setAccount] = useState(null);
	const [depositing, setDepositing] = useState(false);
	const [withdrawing, setWithdrawing] = useState(false);

	useEffect(() => {
		let f = accounts.filter((a) => a._id == sel);
		if (f.length > 0) setAccount(f[0]);
		else setAccount(null);
	}, [accounts, sel]);

	const onDeposit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			let res = await (
				await Nui.send('Bank:Deposit', {
					account: account.Account,
					amount: e.target.amount.value,
					comments: e.target.notes.value,
				})
			).json();

			if (res?.state) {
				dispatch({
					type: 'UPDATE_DATA',
					payload: {
						type: 'accounts',
						id: account._id,
						data: { ...account, Balance: +account.Balance + +e.target.amount.value },
					},
				});
				toast.success('Funds Deposited');
			} else {
				toast.error('Unable To Deposit Funds');
			}
		} catch (err) {
			console.log(err);
			toast.error('Unable To Deposit Funds');
		}
		setDepositing(false);
		setLoading(false);
	};

	const onWithdraw = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			let res = await (
				await Nui.send('Bank:Withdraw', {
					account: account.Account,
					amount: e.target.amount.value,
					comments: e.target.notes.value,
				})
			).json();

			if (res?.state) {
				dispatch({
					type: 'UPDATE_DATA',
					payload: {
						type: 'accounts',
						id: account._id,
						data: { ...account, Balance: +account.Balance - +e.target.amount.value },
					},
				});
				toast.success('Funds Withdrawn');
			} else {
				toast.error('Unable To Withdraw Funds');
			}
		} catch (err) {
			console.log(err);
			toast.error('Unable To Withdraw Funds');
		}
		setWithdrawing(false);
		setLoading(false);
	};

	if (!Boolean(account)) {
		return (
			<div className={classes.emptyState}>
				<div className={classes.emptyIcon}>
					<FontAwesomeIcon icon={['fas', 'credit-card']} />
				</div>
				<div className={classes.emptyTitle}>No Account Selected</div>
				<div className={classes.emptySubtitle}>
					Select an account from the sidebar to view details
				</div>
			</div>
		);
	}

	return (
		<>
			{loading && <Loader static text="Processing" />}

			<div className={classes.container}>
				{/* ── Balance Hero ── */}
				<div className={classes.heroCard}>
					<div className={classes.heroLabel}>Available Balance</div>
					{account?.Permissions?.BALANCE ? (
						<div className={classes.heroBalance}>
							{CurrencyFormat.format(account.Balance)}
						</div>
					) : (
						<div className={classes.hiddenBalance}>••••••</div>
					)}
					<div className={classes.heroAccount}>
						Account&nbsp;
						<span>{account.Account}</span>
					</div>
				</div>

				{/* ── Quick Actions ── */}
				<div className={classes.actionsRow}>
					<button
						className={classes.actionCard}
						disabled={!account?.Permissions?.DEPOSIT || user.Cash == 0}
						onClick={() => account?.Permissions?.DEPOSIT && setDepositing(true)}
					>
						<div className={`${classes.actionIcon} ${classes.depositIcon}`}>
							<FontAwesomeIcon icon={['fas', 'arrow-down']} />
						</div>
						<div>
							<div className={classes.actionLabel}>Deposit</div>
							<div className={classes.actionSub}>Add cash to account</div>
						</div>
					</button>

					<button
						className={classes.actionCard}
						disabled={!account?.Permissions?.WITHDRAW || account.Balance == 0}
						onClick={() => account?.Permissions?.WITHDRAW && setWithdrawing(true)}
					>
						<div className={`${classes.actionIcon} ${classes.withdrawIcon}`}>
							<FontAwesomeIcon icon={['fas', 'arrow-up']} />
						</div>
						<div>
							<div className={classes.actionLabel}>Withdraw</div>
							<div className={classes.actionSub}>Take cash from account</div>
						</div>
					</button>
				</div>
			</div>

			{/* ── Modals ── */}
			{account?.Permissions?.DEPOSIT && (
				<Modal
					open={depositing}
					title={`Deposit Into ${account.Name}`}
					closeLang="Cancel"
					maxWidth="xs"
					onClose={() => setDepositing(false)}
					onSubmit={onDeposit}
				>
					<NumberFormat
						fullWidth
						required
						label="Amount"
						name="amount"
						className={classes.field}
						disabled={loading}
						type="text"
						isNumericString
						thousandSeparator
						prefix="$"
						customInput={TextField}
						inputProps={{ autoComplete: 'off' }}
					/>
					<TextField
						fullWidth
						multiline
						minRows={3}
						disabled={loading}
						label="Transaction Comment"
						name="notes"
						variant="outlined"
						autoComplete="off"
					/>
				</Modal>
			)}
			{account?.Permissions?.WITHDRAW && (
				<Modal
					open={withdrawing}
					title={`Withdraw From ${account.Name}`}
					closeLang="Cancel"
					maxWidth="xs"
					onClose={() => setWithdrawing(false)}
					onSubmit={onWithdraw}
				>
					<NumberFormat
						fullWidth
						required
						label="Amount"
						name="amount"
						className={classes.field}
						disabled={loading}
						type="text"
						isNumericString
						thousandSeparator
						prefix="$"
						customInput={TextField}
						inputProps={{ autoComplete: 'off' }}
					/>
					<TextField
						fullWidth
						multiline
						minRows={3}
						disabled={loading}
						label="Transaction Comment"
						name="notes"
						variant="outlined"
						autoComplete="off"
					/>
				</Modal>
			)}
		</>
	);
};
