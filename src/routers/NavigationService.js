import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

const navigate = (routeName, params) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

const nav = (routeName, params) => () => {
  navigate(routeName, params);
}

function reset(routeName, params) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })],
    }),
  );
}

const pop = () => {
  _navigator.dispatch(NavigationActions.back());
}

export default {
  reset,
  navigate,
  nav,
  setTopLevelNavigator,
  pop,
};
