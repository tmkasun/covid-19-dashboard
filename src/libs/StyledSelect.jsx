import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

// Original design here: https://github.com/siriwatknp/mui-treasury/issues/540

import { deepPurple } from "@material-ui/core/colors";

const useMinimalSelectStyles = makeStyles(() => ({
  select: {
    minWidth: 200,
    background: "white",
    color: deepPurple[500],
    fontWeight: 200,
    borderStyle: "none",
    borderWidth: 2,
    borderRadius: 12,
    paddingLeft: 24,
    paddingTop: 14,
    paddingBottom: 15,
    boxShadow: "0px 5px 8px -3px rgba(0,0,0,0.14)",
    "&:focus": {
      borderRadius: 12,
      background: "white",
      borderColor: deepPurple[100]
    }
  },
  icon: {
    color: deepPurple[300],
    right: 12,
    position: "absolute",
    userSelect: "none",
    pointerEvents: "none"
  },
  paper: {
    borderRadius: 12,
    marginTop: 8
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    background: "white",
    "& li": {
      fontWeight: 200,
      paddingTop: 12,
      paddingBottom: 12
    },
    "& li:hover": {
      background: deepPurple[100]
    },
    "& li.Mui-selected": {
      color: "white",
      background: deepPurple[400]
    },
    "& li.Mui-selected:hover": {
      background: deepPurple[500]
    }
  }
}));

const MinimalSelect = (props) => {
  const { lastXDays, setLastXDays } = props;

  const handleChange = (event) => {
    setLastXDays(event.target.value);
  };

  const minimalSelectClasses = useMinimalSelectStyles();

  const iconComponent = (props) => {
    return (
      <ExpandMoreIcon
        className={props.className + " " + minimalSelectClasses.icon}
      />
    );
  };

  // moves the menu below the select input
  const menuProps = {
    classes: {
      paper: minimalSelectClasses.paper,
      list: minimalSelectClasses.list
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    getContentAnchorEl: null
  };

  return (
    <FormControl>
      <Select
        disableUnderline
        classes={{ root: minimalSelectClasses.select }}
        MenuProps={menuProps}
        IconComponent={iconComponent}
        value={lastXDays}
        onChange={handleChange}
      >
        <MenuItem value={0}>All Time</MenuItem>
        <MenuItem value={30}>Last Month</MenuItem>
        <MenuItem value={7}>Last Week</MenuItem>
      </Select>
    </FormControl>
  );
};

export default MinimalSelect;
