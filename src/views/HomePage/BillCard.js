import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, grey } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Chip from '@material-ui/core/Chip';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import ClearIcon from '@material-ui/icons/Clear';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import clsx from 'clsx';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '16px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'none',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500],
    borderRadius: '100%',
    width: '75px',
    height: '75px',
    color: '#FFF',
    fontWeight: 900,
    boxShadow: '10px 17px 24px -13px rgba(0,0,0,0.5)',
    margin: theme.spacing(2),
    transition: 'all 0.5s ease-in-out',
    '&:hover,&:focus': {
      color: '#10021a',
      background: '#fa7c70',
      boxShadow: '0 14px 20px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      transform: 'scale(1.05)',
      transition: 'all 0.3s ease-in-out'
    }
  },
  billText: {
    backgroundColor: grey[200],
    transition: 'all 0.5s ease-in-out',
    '&:hover,&:focus': {
      color: '#10021a',
      background: '#fa7c70',
      boxShadow: '0 8px 10px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.22)',
      transform: 'scale(1.05)',
      transition: 'box-shadow 0.3s ease-in-out'
    }
  },
  status: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    maxWidth: '200px'
  },
  pullRight: {
    justifyContent: 'flex-end',
    fontSize: '0.8em'
  },
  billChips: {
    minWidth: '100px'
  }
}));

/**
 *
 * @param {{
 *  key: Number,
 *  setThisOneClicked: (),
 *  bill: { bill_state },
 *  style: { style_object },
 *  onRender: ()
 * }} props
 */

const EVENTS_FOR_BILL = gql`
  query Events($bill_code: String!) {
    events(bill_code: $bill_code) {
      id
      title
      publication_date
    }
  }
`;

const ADD_USER_BILL = gql`
  mutation($user_id: Int!, $bill_id: Int!) {
    addUserBill(user_id: $user_id, bill_id: $bill_id) {
      user_id
      bill_id
    }
  }
`;

const DELETE_USER_BILL = gql`
  mutation($user_id: Int!, $bill_id: Int!) {
    deleteUserBill(user_id: $user_id, bill_id: $bill_id) {
      user_id
      bill_id
    }
  }
`;

export default function BillCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState('No events currently loaded.');
  const [color, setColor] = useState('');
  const [open, setOpen] = useState(false);
  const [getEvents, { loadingEvents, data }] = useLazyQuery(EVENTS_FOR_BILL);
  // IMPLEMENT THESE MUTATIONS IN WATCHLIST ADD/REMOVE BUTTON
  const [addUserBill, { loadingAddUserBill }] = useMutation(ADD_USER_BILL);
  const [deleteUserBill, { loadingRemoveUserBill }] = useMutation(
    DELETE_USER_BILL
  );

  useEffect(() => {
    props.user &&
    props.user.user_bills &&
    props.user.user_bills.includes(props.bill.id)
      ? setColor('red')
      : setColor('grey');
  }, []);

  useEffect(() => {
    if (!loadingEvents && data) {
      setEvents(data.events);
    }
  }, [data]);

  const handleWatchSubmit = async () => {
    const watchlist_bill = {
      id: { bill_id: props.bill.id, user_id: props.user.id }
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/bill_users`,
        watchlist_bill
      );
      color === 'grey' ? setColor('red') : setColor('grey');
      props.updateWatchList(response.data.watchlist);
      setOpen(true);
    } catch (error) {
      console.error(`Error occurred on handleWatchSubmit: ${error}`);
    }
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExpandClick = () => {
    getEvents({
      variables: { bill_code: props.bill.code }
    });
    if (!loadingEvents) {
      setExpanded(!expanded);
    }
  };

  // Formats the date to use "Month Day, Year" format
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const validDate = new Date(props.bill.introduced_date);
  const introduced_date = !isNaN(validDate) ? validDate : null;

  const eventCards =
    Array.isArray(events) &&
    events.map((event) => {
      const publication_date = new Date(event.publication_date);
      return (
        <CardContent key={event.id}>
          <Grid container spacing={3} justify="center">
            <Grid
              item
              xs={3}
              sm={3}
              md={2}
              lg={2}
              xl={1}
              className={classes.status}
            ></Grid>
            <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
              <Typography>
                <strong>
                  {publication_date.toLocaleDateString('en-US', options)}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={8} sm={6} md={7} lg={7} xl={7}>
              <Typography body>{event.title}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      );
    });

  return (
    <Card className={classes.root} key={props.bill.id}>
      <CardContent>
        <Grid container spacing={3} justify="center">
          <Grid
            item
            xs={6}
            sm={3}
            md={2}
            lg={2}
            xl={1}
            className={classes.status}
          >
            <Tooltip
              title="View bill page on parliament's website."
              placement="right"
            >
              <Button
                href={props.bill.page_url}
                variant="contained"
                className={classes.avatar}
                target="_blank"
              >
                Bill<br></br>
                {props.bill.code}
              </Button>
            </Tooltip>
            {props.bill.passed === true ? (
              <Tooltip title="This bill has been passed." placement="bottom">
                <Chip
                  label="Passed"
                  className={classes.billChips}
                  variant="default"
                  color="primary"
                  icon={<DoneOutlineIcon />}
                />
              </Tooltip>
            ) : props.bill.passed === false ? (
              <Tooltip title="This bill has been defeated." placement="bottom">
                <Chip
                  label="Defeated"
                  className={classes.billChips}
                  variant="default"
                  color="secondary"
                  icon={<ClearIcon />}
                />
              </Tooltip>
            ) : (
              <Tooltip
                title="This bill is currently in progress through parliament."
                placement="bottom"
              >
                <Chip
                  label="In Progress"
                  className={classes.billChips}
                  variant="outlined"
                  color="default"
                  icon={<AccessTimeIcon />}
                />
              </Tooltip>
            )}
          </Grid>
          <Grid item xs={10} sm={7} md={8} lg={8} xl={10}>
            <Typography>
              <strong>{props.bill.title}</strong>
            </Typography>
            <Typography style={{ marginBottom: '16px' }}>
              {introduced_date
                ? 'Introduced on ' +
                  introduced_date.toLocaleDateString('en-US', options)
                : 'The introduced date of this bill is not available.'}
            </Typography>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  style={{ marginBottom: '24px' }}
                >
                  {props.bill.description
                    ? props.bill.description
                    : `No description is currently available for Bill ${props.bill.code}`}
                </Typography>
                <Grid container spacing={2} style={{ display: 'flex' }}>
                  <Grid item>
                    {props.bill.full_text_url ? (
                      <Tooltip
                        title="View the full text of this bill on parliament's website."
                        placement="right"
                      >
                        <Button
                          href={props.bill.full_text_url}
                          target="_blank"
                          variant="contained"
                          className={classes.billText}
                        >
                          <LibraryBooksIcon style={{ marginRight: '8px' }} />
                          Full Text
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="The full text for this bill is not available; this link will be updated if the full text becomes available."
                        placement="right"
                      >
                        <div>
                          <Button
                            disabled
                            variant="contained"
                            className={classes.billText}
                          >
                            <LibraryBooksIcon style={{ marginRight: '8px' }} />
                            Full Text
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                  </Grid>
                  <Grid item>
                    {props.bill.summary_url ? (
                      <Tooltip
                        title="View the summary text of this bill on parliament's website."
                        placement="right"
                      >
                        <Button
                          href={props.bill.summary_url}
                          target="_blank"
                          variant="contained"
                          className={classes.billText}
                        >
                          <AccountBalanceIcon style={{ marginRight: '8px' }} />
                          Summary
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="The legislative summary for this bill is not yet available; this link will be updated if a summary is published."
                        placement="right"
                      >
                        <div>
                          <Button
                            disabled
                            variant="contained"
                            className={classes.billText}
                          >
                            <AccountBalanceIcon
                              style={{ marginRight: '8px' }}
                            />
                            Summary
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            lg={2}
            xl={1}
            style={{ textAlign: 'right' }}
          >
            {props.user ? (
              <IconButton aria-label="settings">
                <BookmarkIcon
                  style={{ color: color }}
                  onClick={() => {
                    handleWatchSubmit();
                  }}
                />
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  open={open}
                  autoHideDuration={2000}
                  onClose={handleClose}
                >
                  <SnackbarContent
                    style={{
                      backgroundColor: '#f44336'
                    }}
                    message={
                      props.user.user_bills.includes(props.bill.id)
                        ? `Bill ${props.bill.code} added to watchlist`
                        : `Bill ${props.bill.code} removed from watchlist`
                    }
                    action={
                      <>
                        <IconButton
                          size="small"
                          aria-label="close"
                          color="inherit"
                          onClick={handleClose}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </>
                    }
                  />
                </Snackbar>
              </IconButton>
            ) : (
              <Tooltip
                title="Sign in to add bills to watchlist."
                placement="right"
              >
                <IconButton aria-label="settings">
                  <BookmarkIcon style={{ color: color }} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing className={classes.pullRight}>
        <Typography xs={12} style={{ marginRight: '16px' }}>
          View events for this bill
        </Typography>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container justify="flex-end">
            <Grid item xs={3} sm={3} md={2} lg={2} xl={1}></Grid>
            <Grid
              item
              xs={12}
              sm={9}
              md={10}
              lg={10}
              xl={10}
              style={{ paddingRight: 'none' }}
            >
              <Typography>Bill Events</Typography>
            </Grid>
          </Grid>
        </CardContent>
        {eventCards}
      </Collapse>
    </Card>
  );
}
