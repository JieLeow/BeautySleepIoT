// App.js
import React, { useState } from "react";
import SignIn from "./SignIn";
import ChartComponent from "./ChartComponent";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const headerStyle = {
    backgroundColor: "#282c34",
    color: "white",
    padding: "20px",
    textAlign: "center",
  };

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated && <h1 style={headerStyle}>Realtime GSR Data</h1>}
      </header>
      {isAuthenticated ? (
        <ChartComponent />
      ) : (
        <SignIn onSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default App;
