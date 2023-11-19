import ReactDOM from "react-dom";
import App from './App.js';

function Index() {
  return <App />
}

ReactDOM.render(<Index />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
