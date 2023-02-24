import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Card, Typography, Button, Tag } from "antd";

import { MealsContext } from "../../context/MealsContext";

const { Title } = Typography;

function MenuItemListComponent() {
  const { mealsToDisplay } = React.useContext(MealsContext);

  return (
    <>
      {React.Children.toArray(
        mealsToDisplay.map((meal) => {
          return (
            <MenuItem
              id={meal.id}
              name={meal.name}
              ingredients={meal.ingredients}
              lowQualityPrice={meal.lowQualityPrice}
              highQualityPrice={meal.highQualityPrice}
              averagePrice={meal.averagePrice}
            />
          );
        })
      )}
    </>
  );
}

function MenuItem({ id, name, ingredients, lowQualityPrice, highQualityPrice, averagePrice }) {
  return (
    <Col span={24}>
      <Card style={{background : "#1D192B06", border : '1px solid #79747E'}}>
        <Row>
          <Col span={16}>
            <Title level={4} style={{ fontFamily: "Roboto" }}>
              {name}
            </Title>
            {React.Children.toArray(
              ingredients.map(({ name }) => {
                return <Tag color="purple">{name}</Tag>;
              })
            )}
          </Col>
          <Col span={4}>
            <Title level={5}>${lowQualityPrice?.toFixed(2)}-${highQualityPrice?.toFixed(2)}</Title>
            <Title level={5}>Avg: ${averagePrice?.toFixed(2)}</Title>
          </Col>
          <Col span={4}>
            <Link to={`${id}`}>
              <Button shape="round" className="btn-filled">
                Details
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export default MenuItemListComponent;
