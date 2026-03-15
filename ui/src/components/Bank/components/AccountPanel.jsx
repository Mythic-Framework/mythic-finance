import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
	Grid,
	Button,
	List,
	ListItem,
	TextField,
	ListItemText,
	Alert,
	MenuItem,
	ListItemSecondaryAction,
	IconButton,
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';

import Nui from '../../../util/Nui';
import { Modal, Loader } from '../../';
import Transaction from './Transaction';
import { CurrencyFormat } from '../../../util/Parser';

import { getAccountType } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: 16,
		maxHeight: '100%',
	},
	card: {
		padding: '18px 20px',
		background: theme.palette.secondary.dark,
		border: `1px solid ${theme.palette.primary.main}18`,
		borderRadius: 6,
		color: theme.palette.text.main,
		height: '100%',
		boxSizing: 'border-box',
	},
	cardLabel: {
		fontSize: 10,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		color: theme.palette.text.alt,
		marginBottom: 4,
		opacity: 0.7,
		'& small': {
			color: theme.palette.primary.main,
			marginLeft: 6,
			fontSize: 10,
			opacity: 1,
		},
	},
	transactionsHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
		paddingBottom: 10,
		borderBottom: `1px solid ${theme.palette.primary.main}25`,
	},
	transactionsTitle: {
		fontSize: 14,
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		fontWeight: 700,
		color: theme.palette.text.main,
	},
	transactionsCount: {
		fontSize: 12,
		color: theme.palette.primary.main,
		fontWeight: 500,
		letterSpacing: '0.04em',
	},
	quickActionsLabel: {
		fontSize: 14,
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		fontWeight: 700,
		color: theme.palette.text.main,
		marginBottom: 14,
		paddingBottom: 10,
		borderBottom: `1px solid ${theme.palette.primary.main}25`,
	},
	actionTile: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		gap: 14,
		padding: '14px 16px',
		borderRadius: 6,
		border: '1px solid transparent',
		cursor: 'pointer',
		transition: 'all ease-in 0.15s',
		background: 'none',
		'&:not(:last-of-type)': { marginBottom: 10 },
		'&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
	},
	actionTileDeposit: {
		borderColor: `${theme.palette.success.main}40`,
		background: `${theme.palette.success.dark}30`,
		'&:hover:not(:disabled)': {
			background: `${theme.palette.success.dark}60`,
			borderColor: `${theme.palette.success.main}80`,
			transform: 'translateY(-1px)',
			boxShadow: `0 4px 12px ${theme.palette.success.dark}60`,
		},
	},
	actionTileWithdraw: {
		borderColor: `${theme.palette.warning.main}40`,
		background: `${theme.palette.warning.dark}25`,
		'&:hover:not(:disabled)': {
			background: `${theme.palette.warning.dark}50`,
			borderColor: `${theme.palette.warning.main}80`,
			transform: 'translateY(-1px)',
			boxShadow: `0 4px 12px ${theme.palette.warning.dark}60`,
		},
	},
	actionTileTransfer: {
		borderColor: `${theme.palette.primary.main}40`,
		background: `${theme.palette.primary.dark}25`,
		'&:hover:not(:disabled)': {
			background: `${theme.palette.primary.dark}50`,
			borderColor: `${theme.palette.primary.main}80`,
			transform: 'translateY(-1px)',
			boxShadow: `0 4px 12px ${theme.palette.primary.dark}60`,
		},
	},
	actionTileIcon: {
		width: 38,
		height: 38,
		minWidth: 38,
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
	},
	actionTileIconDeposit: {
		background: `${theme.palette.success.main}25`,
		color: theme.palette.success.main,
	},
	actionTileIconWithdraw: {
		background: `${theme.palette.warning.main}25`,
		color: theme.palette.warning.main,
	},
	actionTileIconTransfer: {
		background: `${theme.palette.primary.main}25`,
		color: theme.palette.primary.main,
	},
	actionTileText: {
		textAlign: 'left',
	},
	actionTileTitle: {
		fontSize: 14,
		fontWeight: 600,
		letterSpacing: '0.02em',
		color: theme.palette.text.main,
		lineHeight: 1.2,
	},
	actionTileSubtitle: {
		fontSize: 11,
		color: theme.palette.text.alt,
		marginTop: 2,
		opacity: 0.7,
	},
	cardValue: {
		fontSize: 15,
		fontWeight: 500,
		color: theme.palette.text.main,
		marginBottom: 14,
		'&:last-child': { marginBottom: 0 },
	},
	balance: {
		fontSize: 22,
		fontWeight: 700,
		color: theme.palette.primary.main,
		letterSpacing: '-0.02em',
	},
	sectionTitle: {
		fontSize: 10,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		color: theme.palette.text.alt,
		marginBottom: 10,
		opacity: 0.7,
	},
	actionBtn: {
		display: 'block',
		width: '100%',
		padding: '9px 14px',
		fontSize: 12,
		fontWeight: 600,
		letterSpacing: '0.05em',
		textTransform: 'uppercase',
		'&:not(:last-of-type)': { marginBottom: 8 },
	},
	field: {
		marginBottom: 15,
	},
}));

const Types = [
	{
		value: false,
		label: 'Account Number',
	},
	{
		value: true,
		label: 'State ID',
	},
];
export default () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.data.data.character);
	const accounts = useSelector((state) => state.data.data.accounts);
	const transactions = useSelector((state) => state.data.data.transactions);
	const sel = useSelector((state) => state.bank.selected);

	const [loading, setLoading] = useState(null);

	const [account, setAccount] = useState(
		accounts.filter((a) => a._id == sel).length > 0
			? accounts.filter((a) => a._id == sel)[0]
			: null,
	);
	const [accTrans, setAccTrans] = useState(Array());
	const [page, setPage] = useState(1);

	const [viewingOwners, setViewingOwners] = useState(false);
	const [renaming, setRenaming] = useState(false);
	const [depositing, setDepositing] = useState(false);
	const [withdrawing, setWithdrawing] = useState(false);
	const [transferring, setTransferring] = useState(false);
	const [addOwner, setAddOwner] = useState(false);

	const [xferType, setXferType] = useState(false);
	useEffect(() => {
		if (transferring) setXferType(false);
	}, [transferring]);

	useEffect(() => {
		let f = accounts.filter((a) => a._id == sel);
		if (f.length > 0) {
			setAccount(f[0]);
		} else setAccount(null);
	}, [accounts, sel]);

	useEffect(() => {
		if (Boolean(account)) {
			setAccTrans(transactions[account.Account] || Array());
		} else setAccTrans(Array());
	}, [account, transactions]);

	const onRename = async (e) => {
		e.preventDefault();

		if (account.Type == 'organization' || !account?.Permissions?.MANAGE) {
			setRenaming(false);
			return;
		}

		try {
			setLoading(true);
			let res = await (
				await Nui.send('Bank:Rename', {
					account: account.Account,
					name: e.target.name.value,
				})
			).json();

			if (res) {
				dispatch({
					type: 'UPDATE_DATA',
					payload: {
						type: 'accounts',
						id: account._id,
						data: {
							...account,
							Name: e.target.name.value,
						},
					},
				});
				toast.success('Account Renamed');
			} else {
				toast.error('Unable To Rename Account');
			}
		} catch (err) {
			console.log(err);
			toast.error('Unable To Rename Account');
		}

		setLoading(false);
		setRenaming(false);
	};

	const onDeposit = async (e) => {
		e.preventDefault();

		if (!account?.Permissions?.DEPOSIT) {
			setDepositing(false);
			return;
		}

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
						data: {
							...account,
							Balance: +account.Balance + +e.target.amount.value,
						},
					},
				});

				dispatch({
					type: 'SET_DATA',
					payload: {
						type: 'character',
						data: {
							...user,
							Cash: user.Cash - +e.target.amount.value,
						},
					},
				});

				dispatch({
					type: 'ADD_DATA',
					payload: {
						type: 'transactions',
						key: account.Account,
						data: [
							...accTrans,
							{
								Amount: e.target.amount.value,
								Type: 'deposit',
								TransactionAccount: false,
								Title: 'Cash Deposit',
								Data: {
									character: user.SID,
								},
								Account: account.Account,
								Timestamp: Date.now() / 1000,
								Description:
									e.target.notes.value ?? 'No Description',
							},
						],
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

		setLoading(false);
		setDepositing(false);
	};

	const onWithdraw = async (e) => {
		e.preventDefault();

		if (!account?.Permissions?.WITHDRAW) {
			setWithdrawing(false);
			return;
		}

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
						data: {
							...account,
							Balance: +account.Balance - +e.target.amount.value,
						},
					},
				});

				dispatch({
					type: 'SET_DATA',
					payload: {
						type: 'character',
						data: {
							...user,
							Cash: user.Cash + +e.target.amount.value,
						},
					},
				});

				dispatch({
					type: 'ADD_DATA',
					payload: {
						type: 'transactions',
						key: account.Account,
						data: [
							...accTrans,
							{
								Amount: e.target.amount.value,
								Type: 'withdraw',
								TransactionAccount: false,
								Title: 'Cash Withdrawal',
								Data: {
									character: user.SID,
								},
								Account: account.Account,
								Timestamp: Date.now() / 1000,
								Description:
									e.target.notes.value ?? 'No Description',
							},
						],
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

		setLoading(false);
		setWithdrawing(false);
	};

	const onTransfer = async (e) => {
		e.preventDefault();

		if (!account?.Permissions?.WITHDRAW) {
			setWithdrawing(false);
			return;
		}

		let xferType = e.target.type.value === 'true';
		if (xferType && e.target.target.value == user.SID) {
			toast.error(
				'Cannot Transfer To Your Own State ID, Use Account Numbers',
			);
			return;
		}

		if (!xferType && e.target.target.value == account.Account) {
			toast.error('Cannot Transfer Funds To The Same Account');
			return;
		}

		try {
			setLoading(true);
			let res = await (
				await Nui.send('Bank:Transfer', {
					account: account.Account,
					type: xferType,
					target: e.target.target.value,
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
						data: {
							...account,
							Balance: +account.Balance - +e.target.amount.value,
						},
					},
				});
				dispatch({
					type: 'ADD_DATA',
					payload: {
						type: 'transactions',
						key: account.Account,
						data: [
							...accTrans,
							{
								Amount: e.target.amount.value,
								Type: 'transfer',
								TransactionAccount: false,
								Title: 'Outgoing Bank Transfer',
								Data: {
									character: user.SID,
								},
								Account: account.Account,
								Timestamp: Date.now() / 1000,
								Description: `Transfer To Account: ${
									e.target.target.value
								}.${
									e.target.notes.value != ''
										? ` Description: ${e.target.notes.value}`
										: ''
								}`,
							},
						],
					},
				});

				if (!xferType) {
					let t = accounts.filter(
						(a) => a.Account == e.target.target.value,
					);

					if (t.length > 0) {
						dispatch({
							type: 'UPDATE_DATA',
							payload: {
								type: 'accounts',
								id: t[0]._id,
								data: {
									...t[0],
									Balance:
										+t[0].Balance + +e.target.amount.value,
								},
							},
						});

						let tt = Boolean(transactions[t[0].Account])
							? transactions[t[0].Account]
							: Array();

						dispatch({
							type: 'ADD_DATA',
							payload: {
								type: 'transactions',
								key: t[0].Account,
								data: [
									...tt,
									{
										Amount: e.target.amount.value,
										Type: 'transfer',
										TransactionAccount: false,
										Title: 'Incoming Bank Transfer',
										Data: {
											character: user.SID,
										},
										Account: t[0].Account,
										Timestamp: Date.now() / 1000,
										Description: `Transfer From Account: ${
											account.Account
										}.${
											e.target.notes.value != ''
												? ` Description: ${e.target.notes.value}`
												: ''
										}`,
									},
								],
							},
						});
					}
				}

				toast.success('Funds Transferred');
			} else {
				toast.error('Unable To Transfer Funds');
			}
		} catch (err) {
			console.log(err);
			toast.error('Unable To Transfer Funds');
		}

		setTransferring(false);
		setLoading(false);
	};

	const onAddOwner = async (e) => {
		e.preventDefault();

		if (
			account.Type != 'personal_savings' ||
			account.Owner != user.SID ||
			!account?.Permissions?.MANAGE
		) {
			setAddOwner(false);
			return;
		}

		if (user.SID == e.target.target.value) {
			toast.error('You Cannot Add Yourself As A Joint Owner');
			return;
		}

		try {
			setLoading(true);
			let res = await (
				await Nui.send('Bank:AddJoint', {
					account: account.Account,
					target: e.target.target.value,
				})
			).json();

			if (res) {
				dispatch({
					type: 'UPDATE_DATA',
					payload: {
						type: 'accounts',
						id: account._id,
						data: {
							...account,
							JointOwners: [
								...account.JointOwners,
								+e.target.target.value,
							],
						},
					},
				});
				toast.success('Joint Owner Added');
			} else {
				toast.error('Unable To Add Joint Owner');
			}
		} catch (err) {
			console.log(err);
			toast.error('Unable To Add Joint Owner');
		}

		setLoading(false);
		setAddOwner(false);
	};

	const onRemoveOwner = async (stateId) => {
		if (
			account.Type != 'personal_savings' ||
			account.Owner != user.SID ||
			!account?.Permissions?.MANAGE
		) {
			setAddOwner(false);
			return;
		}

		try {
			setLoading(true);
			let res = await (
				await Nui.send('Bank:RemoveJoint', {
					account: account.Account,
					target: stateId,
				})
			).json();

			if (res) {
				dispatch({
					type: 'UPDATE_DATA',
					payload: {
						type: 'accounts',
						id: account._id,
						data: {
							...account,
							JointOwners: account.JointOwners.filter((o) => o != stateId),
						},
					},
				});
				toast.success('Joint Owner Removed');
			} else {
				toast.error('Unable To Remove Joint Owner');
			}
		} catch (err) {
			console.log(err);
			toast.error('Unable To Remove Joint Owner');
		}

		setLoading(false);
		setAddOwner(false);
	};

	return (
		<>
			{Boolean(account) ? (
				<Grid className={classes.container} container spacing={2}>
					{/* Account Info Card */}
					<Grid item xs={6}>
						<div className={classes.card}>
							<div className={classes.cardLabel}>Account Number</div>
							<div className={classes.cardValue}>{account.Account}</div>

							<div className={classes.cardLabel}>Account Type</div>
							<div className={classes.cardValue}>{getAccountType(account)}</div>

							<div className={classes.cardLabel}>Available Balance</div>
							<div className={classes.cardValue}>
								{account?.Permissions?.BALANCE ? (
									<span className={classes.balance}>
										{CurrencyFormat.format(account.Balance)}
									</span>
								) : (
									<span style={{ opacity: 0.4 }}>Hidden</span>
								)}
							</div>

							{(account.Type !== 'organization' || (account.Type === 'personal_savings' && account.Owner === user.SID)) && (
								<>
									<div className={classes.cardLabel} style={{ marginTop: 14 }}>Management</div>
									{account.Type !== 'organization' && (
										<Button
											fullWidth
											color="primary"
											variant="outlined"
											disabled={loading || !account?.Permissions?.WITHDRAW}
											className={classes.actionBtn}
											onClick={() => setRenaming(true)}
										>
											<FontAwesomeIcon icon={['fas', 'pen']} style={{ marginRight: 8 }} />
											Rename Account
										</Button>
									)}
									{account.Type === 'personal_savings' && account.Owner === user.SID && (
										<Button
											fullWidth
											color="info"
											variant="outlined"
											disabled={loading || !account?.Permissions?.WITHDRAW}
											className={classes.actionBtn}
											style={{ marginTop: 8 }}
											onClick={() => setViewingOwners(true)}
										>
											<FontAwesomeIcon icon={['fas', 'users']} style={{ marginRight: 8 }} />
											Joint Owners
										</Button>
									)}
								</>
							)}
						</div>
					</Grid>

					{/* Quick Actions Card */}
					<Grid item xs={6}>
						<div className={classes.card}>
							<div className={classes.quickActionsLabel}>Quick Actions</div>

							{/* Deposit */}
							<button
								className={`${classes.actionTile} ${classes.actionTileDeposit}`}
								disabled={!account?.Permissions?.DEPOSIT || user.Cash === 0}
								onClick={() => setDepositing(true)}
							>
								<div className={`${classes.actionTileIcon} ${classes.actionTileIconDeposit}`}>
									<FontAwesomeIcon icon={['fas', 'circle-arrow-down']} />
								</div>
								<div className={classes.actionTileText}>
									<div className={classes.actionTileTitle}>Deposit Cash</div>
									<div className={classes.actionTileSubtitle}>Add funds to this account</div>
								</div>
							</button>

							{/* Withdraw */}
							<button
								className={`${classes.actionTile} ${classes.actionTileWithdraw}`}
								disabled={!account?.Permissions?.WITHDRAW || account.Balance === 0}
								onClick={() => setWithdrawing(true)}
							>
								<div className={`${classes.actionTileIcon} ${classes.actionTileIconWithdraw}`}>
									<FontAwesomeIcon icon={['fas', 'circle-arrow-up']} />
								</div>
								<div className={classes.actionTileText}>
									<div className={classes.actionTileTitle}>Withdraw Cash</div>
									<div className={classes.actionTileSubtitle}>Take funds as cash</div>
								</div>
							</button>

							{/* Transfer */}
							<button
								className={`${classes.actionTile} ${classes.actionTileTransfer}`}
								disabled={!account?.Permissions?.WITHDRAW || account.Balance === 0}
								onClick={() => setTransferring(true)}
							>
								<div className={`${classes.actionTileIcon} ${classes.actionTileIconTransfer}`}>
									<FontAwesomeIcon icon={['fas', 'right-left']} />
								</div>
								<div className={classes.actionTileText}>
									<div className={classes.actionTileTitle}>Transfer Funds</div>
									<div className={classes.actionTileSubtitle}>Send to another account</div>
								</div>
							</button>
						</div>
					</Grid>

					{/* Transactions Card */}
					<Grid item xs={12}>
						<div className={classes.card}>
							<div className={classes.transactionsHeader}>
								<div className={classes.transactionsTitle}>Recent Transactions</div>
								{account?.Permissions?.TRANSACTIONS && (
									<div className={classes.transactionsCount}>{accTrans.length} transactions</div>
								)}
							</div>
							<List style={{ paddingRight: 10, maxHeight: 380, overflowY: 'auto' }}>
								{account?.Permissions?.TRANSACTIONS && accTrans.length > 0 ? (
									accTrans
										.sort((a, b) => b.Timestamp - a.Timestamp)
										.slice(0, page * 10)
										.map((t, k) => (
											<Transaction key={`${account._id}-${k}`} transaction={t} />
										))
								) : (
									<ListItem style={{ justifyContent: 'center', opacity: 0.4, fontSize: 15 }}>
										No Recent Transactions
									</ListItem>
								)}
								{accTrans.length > 10 && page < Math.ceil(accTrans.length / 10) && (
									<Button
										fullWidth
										color="primary"
										variant="outlined"
										style={{ marginTop: 10, fontSize: 13 }}
										onClick={() => setPage(page + 1)}
									>
										Load More
									</Button>
								)}
							</List>
						</div>
					</Grid>
				</Grid>
			) : (
				<div style={{ padding: 20 }}>
					<Alert variant="outlined" severity="info" style={{ borderColor: 'rgba(0,201,177,0.3)', color: 'rgba(255,255,255,0.5)' }}>
						Select an account from the sidebar to get started.
					</Alert>
				</div>
			)}

			{Boolean(account) && (
				<>
					{account?.Permissions?.MANAGE &&
						account.Type != 'organization' && (
							<Modal
								open={renaming}
								title={`Rename ${account.Name}`}
								closeLang="Cancel"
								maxWidth="md"
								onClose={() => setRenaming(false)}
								onSubmit={onRename}
							>
								{loading && <Loader static text="Loading" />}
								<TextField
								fullWidth
								required
								className={classes.input}
								label="Account Nickname"
								defaultValue={account.Name}
								name="name"
								variant="outlined"
								 autoComplete="off"
											/>
							</Modal>
						)}
					{account?.Permissions?.DEPOSIT && (
						<Modal
							open={depositing}
							title={`Deposit Funds Into ${account.Name}`}
							closeLang="Cancel"
							maxWidth="md"
							onClose={() => setDepositing(false)}
							onSubmit={onDeposit}
						>
							{loading && <Loader static text="Loading" />}
							<NumberFormat
							fullWidth
							required
							label="Deposit To"
							className={classes.field}
							disabled={true}
							type="tel"
							isNumericString
							value={account.Account}
							customInput={TextField}
							 inputProps={{ autoComplete: 'off' }}
							/>
							<NumberFormat
							fullWidth
							required
							label="Amount"
							name="amount"
							className={classes.field}
							disabled={loading}
							type="tel"
							isNumericString
							 customInput={TextField}
							 inputProps={{ autoComplete: 'off' }}
							/>
							<TextField
							fullWidth
							multiline
							minRows={3}
							className={classes.input}
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
							title={`Withdraw Funds From ${account.Name}`}
							closeLang="Cancel"
							maxWidth="md"
							onClose={() => setWithdrawing(false)}
							onSubmit={onWithdraw}
						>
							{loading && <Loader static text="Loading" />}
							<NumberFormat
							fullWidth
							required
							label="Withdraw From"
							className={classes.field}
							disabled={true}
							type="tel"
							isNumericString
							value={account.Account}
							customInput={TextField}
							 inputProps={{ autoComplete: 'off' }}
							/>
							<NumberFormat
							fullWidth
							required
							label="Amount"
							name="amount"
							className={classes.field}
							disabled={loading}
							type="tel"
							isNumericString
							 customInput={TextField}
							 inputProps={{ autoComplete: 'off' }}
							/>
							<TextField
							fullWidth
							multiline
							minRows={3}
							className={classes.input}
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
							open={transferring}
							title={`Transfer Funds From ${account.Name}`}
							closeLang="Cancel"
							maxWidth="md"
							onClose={() => setTransferring(false)}
							onSubmit={onTransfer}
						>
							{loading && <Loader static text="Loading" />}
							<NumberFormat
							fullWidth
							required
							label="Transfer From"
							className={classes.field}
							disabled={true}
							type="tel"
							isNumericString
							value={account.Account}
							customInput={TextField}
							 inputProps={{ autoComplete: 'off' }}
							/>
							<TextField
							select
							fullWidth
							required
							name="type"
							className={classes.field}
							label="Transfer Type"
							onChange={(e) => setXferType(e.target.value)}
							 value={xferType}
							autoComplete="off"
							>
							{Types.map((option) => (
							<MenuItem
							 key={option.value}
							value={option.value}
							>
							  {option.label}
							  </MenuItem>
							 ))}
							</TextField>
							<NumberFormat
							fullWidth
							required
							label={xferType ? 'State ID' : 'Account Number'}
							name="target"
							className={classes.field}
							disabled={loading}
							type="tel"
							 isNumericString
							 customInput={TextField}
							inputProps={{ autoComplete: 'off' }}
							/>
							<NumberFormat
							fullWidth
							required
							label="Amount"
							name="amount"
							className={classes.field}
							disabled={loading}
							 type="tel"
							 isNumericString
							customInput={TextField}
							inputProps={{ autoComplete: 'off' }}
							/>
							<TextField
							fullWidth
							multiline
							minRows={3}
							className={classes.input}
							 disabled={loading}
										label="Transaction Comment"
										name="notes"
										variant="outlined"
										autoComplete="off"
									/>
						</Modal>
					)}
					{account?.Permissions?.MANAGE &&
						account.Type == 'personal_savings' && (
							<>
								<Modal
									open={viewingOwners}
									title={`${account.Name} Joint Owners`}
									closeLang="Close"
									acceptLang="Add Owner"
									maxWidth="md"
									onClose={() => setViewingOwners(false)}
									onAccept={
										account.Owner == user.SID
											? () => setAddOwner(true)
											: null
									}
								>
									<List>
										{account.JointOwners.length > 0 ? (
											account.JointOwners.map((o) => {
												return (
													<ListItem
														key={`${account.Account}-${o}`}
													>
														<ListItemText
															primary="State ID"
															secondary={o}
														/>
														<ListItemSecondaryAction>
															<IconButton
																onClick={() =>
																	onRemoveOwner(
																		o,
																	)
																}
															>
																<FontAwesomeIcon
																	icon={[
																		'fas',
																		'x',
																	]}
																/>
															</IconButton>
														</ListItemSecondaryAction>
													</ListItem>
												);
											})
										) : (
											<ListItem>
												<Alert
													style={{ width: '100%' }}
													variant="filled"
													severity="error"
												>
													No Joint Owners
												</Alert>
											</ListItem>
										)}
									</List>
								</Modal>
								{account.Owner == user.SID && (
									<Modal
										open={addOwner}
										title={`Add Joint Owner To ${account.Name}`}
										closeLang="Cancel"
										maxWidth="md"
										onClose={() => setAddOwner(false)}
										onSubmit={onAddOwner}
									>
										{loading && (
											<Loader static text="Loading" />
										)}
										<NumberFormat
										fullWidth
										required
										label="State ID"
										name="target"
										className={classes.field}
										disabled={loading}
										type="tel"
										isNumericString
										customInput={TextField}
										variant="outlined"
										 inputProps={{ autoComplete: 'off' }}
															/>
									</Modal>
								)}
							</>
						)}
				</>
			)}
		</>
	);
};
