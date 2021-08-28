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
import { makeStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';

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
    children,
    isLoading,
    ...rest
  } = props;
  const classes = useStylesAppBar();
  return (
    <>
      <CssBaseline />
      <HideOnScroll {...rest}>
        <AppBar variant="elevation">
          <Toolbar>
            <Typography className={classes.title} variant="h6">
              🇱🇰 Covid-19 Stats.
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Box mt={5}>
        {isLoading && <LinearProgress />}
        {children}
      </Box>
      <Box color="text.secondary" mt={5}>
        Data source : <Link
          target="_blank"
          rel="noopener"
          href={'https://github.com/nuuuwan/covid19/tree/data'}>
          GitHub
        </Link>
        {'    '}
        Source code : <Link
          target="_blank"
          rel="noopener"
          href={'https://github.com/tmkasun/covid-19-dashboard/tree/main/'}>
          GitHub
        </Link>
      </Box>
    </>
  );
}
