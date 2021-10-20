import './App.css';
import AuthProvider from './contexts/AuthContext';
import { Providers } from './store/Providers';
import { makeStyles } from '@material-ui/core';
import Header from './components/Header';
import Screens from './components/Screens';
import ModalDisplay from './components/ModalDisplay';

const useAppStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    minHeight: '100%'
  }
}));

function App() {
  const appStyles = useAppStyles();

  return (
    <AuthProvider>
      <Providers>
        <div className={`App ${appStyles.container}`}>
          <Header/>
          <Screens/>
          <ModalDisplay/>
        </div>
      </Providers>
    </AuthProvider>
  );
}

export default App;
