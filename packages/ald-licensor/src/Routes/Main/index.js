// import React, { Component } from "react";
// import { Route, Switch, Redirect } from "react-router-dom";

// fault, go to main dashboard
// const DEF_ROUTE = "/main/app";

// function Loading({ error }) {
//   if (error) {
//     return 'Something went wrong: ' + (error.message?error.message:error);
//   } else {
//     return <h3>Loading...</h3>;
//   }
// }

// const Main = Loadable({
//   loader: () => import('Views/main'),
//   loading: Loading
// });

// class App extends Component {
//   render() {
//     const { location,match } = this.props;
//     if(location.pathname === '/main') {
//       return (<Redirect to={DEF_ROUTE} />)
//     }

//     return (
//       <div className="app-container container-fluid mr-0 ml-0 pr-0 pl-0">
//             <Switch>
//               <Route path={`${match.url}/app`} component={Main} />
//               <Redirect to="/error" />
//             </Switch>
//       </div>
//     );
//   }
// }

// export default App;
