import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import { Route, Switch } from 'react-router';
import useKeypress from 'react-use-keypress';

import { Titlebar, Loader } from '../';
import Nui from '../../util/Nui';
import Accounts from './Accounts';

const useStyles = makeStyles((theme) => ({
	container: {
		height: '100%',
		background: theme.palette.secondary.dark,
		position: 'relative',
		'&::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: 2,
			background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
			zIndex: 10,
		},
	},
	wrapper: {
		height: 'calc(100% - 64px)',
		position: 'relative',
	},
	content: {
		height: '100%',
		overflowY: 'auto',
		overflowX: 'hidden',
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-track': {
			background: 'transparent',
		},
		'&::-webkit-scrollbar-thumb': {
			background: `${theme.palette.primary.main}40`,
			borderRadius: 2,
		},
	},
	maxHeight: {
		height: '100%',
	},
}));

export default () => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const f = async () => {
			setLoading(true);
			try {
				let res = await (await Nui.send('Bank:Fetch')).json();

				if (Boolean(res?.accounts)) {
					dispatch({
						type: 'SET_DATA',
						payload: {
							type: 'accounts',
							data: res.accounts,
						},
					});
				} else toast.error('Error Loading Accounts');
			} catch (err) {
				console.log(err);
				toast.error('Error Loading Accounts');
			}

			setLoading(false);
		};
		if (process.env.NODE_ENV == 'production') f();
	}, []);

	useKeypress(['Escape'], () => {
		Nui.send('Close');
	});

	return (
		<div className={classes.container}>
			<Grid container className={classes.maxHeight}>
				<Grid item xs={12}>
					<Titlebar />
				</Grid>
				<Grid item xs={12} className={classes.wrapper}>
					<div className={classes.content}>
						{loading && <Loader static text="Loading Accounts" />}
						<Switch>
							<Route path="/" exact component={Accounts} />
						</Switch>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};
