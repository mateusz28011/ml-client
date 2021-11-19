import { useColorModeValue } from '@chakra-ui/color-mode';
import { Container, Flex } from '@chakra-ui/layout';
import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useLazyGetLoggedUserQuery } from './app/services/split/auth';
import doesHttpOnlyCookieExist from './common/doesHttpOnlyCookieExist';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import Navbar from './components/sections/Navbar';
import Dataset from './features/datasets/Dataset';
import Datasets from './features/datasets/Datasets';
import PrivateRoute from './PrivateRoute';

function App() {
  const location = useLocation();
  const [trigger] = useLazyGetLoggedUserQuery();

  useEffect(() => {
    if (doesHttpOnlyCookieExist('refresh')) {
      trigger();
      console.log('getUser');
    }
  }, [trigger]);

  return (
    <Flex flexDir='column' minH='100vh'>
      <Navbar />
      <Container
        flex='1 1 auto'
        maxW='8xl'
        py='5'
        borderX={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
      >
        <Switch location={location} key={location.pathname}>
          {/* <Route exact path='/'>
            <Home />
          </Route> */}
          <Route exact path='/signin'>
            <SignIn />
          </Route>
          <Route exact path='/signup'>
            <SignUp />
          </Route>
          <PrivateRoute exact path='/datasets' component={Datasets} />
          <Route exact path='/datasets/:id' component={Dataset} />
          {/* <Route>
            <Home />
          </Route> */}
        </Switch>
      </Container>
    </Flex>
  );
}

export default App;
