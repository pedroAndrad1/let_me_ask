import { UserContextProvider } from '../contexts/UserContext';
import '../styles/globals.scss';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system">
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
