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
  const [searchByFilter, setSearchByFilter] = React.useState("none");
  const { filterMealsToDisplay } = React.useContext(MealsContext);

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      filterMealsToDisplay(searchByName, searchByFilter);
    }, 250);

    return () => clearTimeout(debounceTimeout);
  }, [searchByName, searchByFilter]);

  const dietaryPref = React.useMemo(() => {
    const selections = [
      {
        key: "1",
        label: (
          <DropDownItem
            type="text"
            onClick={() => setSearchByFilter("none")}
            selected={searchByFilter === "none" ? true : false}
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
            onClick={() => setSearchByFilter("vegan")}
            selected={searchByFilter === "vegan" ? true : false}
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
            onClick={() => setSearchByFilter("vegetarian")}
            selected={searchByFilter === "vegetarian" ? true : false}
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
            onClick={() => setSearchByFilter("average_lh")}
            selected={searchByFilter === "average_lh" ? true : false}
          >
            Average Price<small>(low - high)</small>
          </DropDownItem>
        ),
      },
      {
        key: "5",
        label: (
          <DropDownItem
            type="text"
            onClick={() => setSearchByFilter("average_hl")}
            selected={searchByFilter === "average_hl" ? true : false}
          >
            Average Price<small>(high - low)</small>
          </DropDownItem>
        ),
      },
    ];
    return selections;
  }, [searchByFilter]);

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
