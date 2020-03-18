import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Parallax from 'components/Parallax/Parallax.js';
// sections for this page
import styles from 'assets/jss/material-kit-react/views/components.js';
import CategoryDropdown from '../HomePage/CategoryDropdown';
import Bills from '../HomePage/Bills';

import image from 'assets/img/bg8.jpg';

const useStyles = makeStyles(styles);

export default function WatchListPage(props) {
  const [childCategory, setChildCategory] = useState(0);

  const history = useHistory();

  useEffect(() => {
    if (!props.loggedInStatus) {
      history.push('/');
    }
  });

  const bills = props.bills.filter((bill) => {
    return props.user ? props.user.bills.includes(bill.id) : undefined;
  });

  const classes = useStyles();

  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: 'url(' + image + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      ></div>
      <Parallax image={require('assets/img/bg8.jpg')}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 style={{ textAlign: 'center', fontWeight: 900 }}>
                  My Watch List
                </h1>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <CategoryDropdown
          categories={props.categories}
          passCategory={setChildCategory}
        />
        {props.user && (
          <Bills
            user={props.user}
            setUser={props.setUser}
            bills={bills}
            childCategory={childCategory}
          />
        )}
      </div>
    </div>
  );
}
