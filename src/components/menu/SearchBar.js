import React from "react";

import { Row, Col, Dropdown, Button } from "antd";
import styled from "styled-components";

import { MealsContext } from "../../context/MealsContext";
import { FilterOutlined } from "@ant-design/icons";
import { FloatInput } from "..";

const DropDownItem = styled.div`
  color: #79747e;
  font-weight: ${(props) => (props.selected ? "700" : "400")};

  &:hover {
    color: #6950a4;
  }
`;

function SearchBarComponent() {
  const [searchByName, setSearchByName] = React.useState("");
  const [searchByDietaryPref, setSearchByDietaryPref] = React.useState("none");
  const { filterMealsToDisplay } = React.useContext(MealsContext);

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      filterMealsToDisplay(searchByName, searchByDietaryPref);
    }, 250);

    return () => clearTimeout(debounceTimeout);
  }, [searchByName, searchByDietaryPref]);

  const dietaryPref = React.useMemo(() => {
    const selections = [
      {
        key: "1",
        label: (
          <DropDownItem
            type="text"
            onClick={() => setSearchByDietaryPref("none")}
            selected={searchByDietaryPref === "none" ? true : false}
          >
            None
          </DropDownItem>
        ),
      },
      {
        key: "2",
        label: (
          <DropDownItem
            type="text"
            onClick={() => setSearchByDietaryPref("vegan")}
            selected={searchByDietaryPref === "vegan" ? true : false}
          >
            Vegan
          </DropDownItem>
        ),
      },
      {
        key: "3",
        label: (
          <DropDownItem
            type="text"
            onClick={() => setSearchByDietaryPref("vegetarian")}
            selected={searchByDietaryPref === "vegetarian" ? true : false}
          >
            Vegetarian
          </DropDownItem>
        ),
      },
      {
        key: "4",
        label: (
          <DropDownItem
            type="text"
            onClick={() => setSearchByDietaryPref("average_lh")}
            selected={searchByDietaryPref === "average_lh" ? true : false}
          >
            Average Price
          </DropDownItem>
        ),
      },
    ];
    return selections;
  }, [searchByDietaryPref]);

  return (
    <>
      <Col span={14}>
        <FloatInput
          label="Name"
          placeholder="Name"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
          required
          long="true"
        />
      </Col>
      <Col span={4}>
        <Dropdown menu={{ items: dietaryPref }} placement="bottom">
          <Button
            type="primary"
            icon={<FilterOutlined />}
            className="btn-outlined"
          />
        </Dropdown>
      </Col>
    </>
  );
}

export default SearchBarComponent;
