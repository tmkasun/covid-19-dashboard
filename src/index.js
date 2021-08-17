import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import themex from "./libs/MUITheme";
import { createMuiTheme } from "@material-ui/core/styles";
import App from "./App";

const theme = createMuiTheme(themex);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  rootElement
);
