import React from "react";

import { Row } from "antd";

import { MenuItemList, SearchBar } from "../components";
import MealsContextProvider from "../context/MealsContext";

function MenuPage() {

  return (
    <MealsContextProvider>
      <div style={{marginTop : "2rem", display : "flex", justifyContent : "center"}}>
        <Row gutter={[2, 16]} style={{ width : "50%"}}>
          <SearchBar />
          <MenuItemList />
        </Row>
      </div>
    </MealsContextProvider>
  );
}

export default MenuPage;
