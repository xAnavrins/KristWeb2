import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import rootReducer from "./store/reducers/RootReducer";
import { getInitialWalletManagerState } from "./store/reducers/WalletManagerReducer";

// Set up localisation
import "./utils/i18n";

import "./App.less";
import { AppLayout } from "./layout/AppLayout";

export const store = createStore(
  rootReducer,
  {
    walletManager: getInitialWalletManagerState()
  },
  devToolsEnhancer({})
);
export type AppDispatch = typeof store.dispatch;

function App() {
  return <Suspense fallback="Loading (TODO)"> {/* TODO */}
    <Provider store={store}>
      <Router>
        <AppLayout />
      </Router>
    </Provider>
  </Suspense>
}

export default App;
