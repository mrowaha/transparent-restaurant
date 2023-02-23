import React from "react";
import data from "./db/dataset.json";
import CommonLayout from "./layout/CommonLayout";
import HomePage from "./pages/HomePage";

function App() {
  console.log(data);
  return (
    <CommonLayout>
      <div
        style={{
          height: "100%",
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <HomePage />
      </div>
    </CommonLayout>
  );
}

export default App;
