import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Slide from "@material-ui/core/Slide";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import StyledSelect from "./StyledSelect";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

const useStylesAppBar = makeStyles((theme) => ({
  title: {
    flexGrow: 1
  }
}));

export default function HideAppBar(props) {
  const {
    dataType,
    setDataType,
    children,
    isLoading,
    lastXDays,
    setLastXDays,
    ...rest
  } = props;
  const classes = useStylesAppBar();
  return (
    <>
      <CssBaseline />
      <HideOnScroll {...rest}>
        <AppBar variant="dense">
          <Toolbar>
            <Typography className={classes.title} variant="h6">
              Stats
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                onChange={(e) => {
                  setDataType(e.currentTarget.value);
                }}
                value={dataType}
                defaultValue="total"
              >
                <FormControlLabel
                  value="total"
                  control={<Radio color="secondary" />}
                  label="Total"
                  labelPlacement="top"
                />
                <FormControlLabel
                  value="Dose1"
                  control={<Radio color="secondary" />}
                  label={
                    <>
                      1<sup>st</sup> Dose
                    </>
                  }
                  labelPlacement="top"
                />
                <FormControlLabel
                  value="dose2"
                  control={<Radio color="secondary" />}
                  label={
                    <>
                      2<sup>nd</sup> Dose
                    </>
                  }
                  labelPlacement="top"
                />
              </RadioGroup>
            </FormControl>
            <StyledSelect lastXDays={lastXDays} setLastXDays={setLastXDays} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Box mt={5}>
        {isLoading && <LinearProgress />}
        {children}
      </Box>
    </>
  );
}
