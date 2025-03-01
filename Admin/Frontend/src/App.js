import React, { Suspense } from 'react';
//import Scss
import './assets/scss/themes.scss';
//imoprt Route
import Route from './Routes';
import "rc-tree/assets/index.css";
import PageLoader from './Components/Common/PageLoader';

function App() {
  return (
    <React.Fragment>
      <Suspense fallback={<PageLoader />}>
        <Route />
      </Suspense>
    </React.Fragment>
  );
}

export default App;
