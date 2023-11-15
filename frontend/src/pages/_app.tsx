import type { AppProps } from "next/app";
import * as theme from "utils/theme";
import { ThemeProvider, createGlobalStyle } from "styled-components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    color: ${(p) => p.theme.colors.text.base};
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN',
      'Hiragino Sans', Meiryo, sans-serif;
    line-height: 1.5em;
  }

  #__next {
    z-index: 0;
    position: relative;
    height: 100%;
  }
  a {
    color: ${(p) => p.theme.colors.info[600]};
    text-decoration: none;
  }
  a:focus,
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline-color: ${(p) => p.theme.colors.primary[500]};
    outline-width: 2px;
  }
`;
