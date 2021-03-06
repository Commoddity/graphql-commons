import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import DoneItem from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5)
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

const ChipsArray = (props) => {
  const categories = props.categories;

  const classes = useStyles();
  const chipData = useState(categories);

  return (
    <div>
      {chipData[0].map((data) => {
        let backgroundColor = props.clicked[data.id] ? '#3f51b5' : '#CCC';
        let color = props.clicked[data.id] ? '#FFF' : '#000';
        return (
          <Chip
            key={data.id}
            icon={<DoneItem />}
            label={data.name}
            className={classes.chip}
            onClick={() => {
              props.setThisOneClicked(data.id);
            }}
            style={{
              backgroundColor: backgroundColor,
              color: color
            }}
          />
        );
      })}
    </div>
  );
};

export default ChipsArray;
