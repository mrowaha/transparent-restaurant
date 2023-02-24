import React from "react";

import {
  Col,
  Divider,
  Card,
  Typography,
  Row,
  Button,
  Radio,
  Form,
  Tooltip,
} from "antd";
import { DoubleRightOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { MealsContext } from "../../context/MealsContext";

const { Title } = Typography;

const InformationDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #6950a4;
  background-color: #6950a4;

  & > span {
    padding: 0.5rem;
    background-color: white;
    border: 2px solid #79747e;
    color: #79747e;
    font-family: Roboto;
  }
`;

const RadioItemStyles = {
  width: "30%",
  padding: 5,
  borderRadius: "4px",
  border: "1px solid #79747E",
  backgroundColor: "#1D192B06",
};

function MenuItemByIdComponent({
  id,
  totalPrice,
  totalQuality,
  setTotalPrice,
  setTotalQuality,
  handleConfirmMenu,
}) {
  const [meal, setMeal] = React.useState(null);
  const [previousValues, setPreviousValues] = React.useState([]);
  const averagedQuality = React.useMemo(() => {
    if (!meal) return 0;
    return (totalQuality / meal.ingredients.length).toFixed(2);
  }, [totalQuality, meal]);

  const [previousPrices, setPreviousPrices] = React.useState([]);

  const { getMealById, getQualityPrices } = React.useContext(MealsContext);

  React.useEffect(() => {
    let mealFetched = getMealById(id);
    setMeal(mealFetched);
    setPreviousValues(() => {
      let qualityValues = [];
      for (let i = 0; i < mealFetched.ingredients.length; i++) {
        qualityValues.push(0);
      }
      return qualityValues;
    });
    setPreviousPrices(() => {
      let prices = [];
      for (let i = 0; i < mealFetched.ingredients.length; i++) {
        prices.push(0);
      }
      return prices;
    });
  }, [id]);

  if (!meal) {
    return <h1>Loading...</h1>;
  }

  const handleQualityChange = (value, name) => {
    const [qualityStr, priceStr, suffix] = value.split("|");
    let quality = parseInt(qualityStr);
    let pricePerUnit = parseFloat(priceStr);
    //subtract the previous value
    let prevQualityValueIndex = meal.ingredients.findIndex(
      (ingredient) => ingredient.name === name
    );
    let prevQualityValue = previousValues[prevQualityValueIndex];
    //update the previous values
    setPreviousValues((prev) => {
      prev[prevQualityValueIndex] = quality;
      return [...prev];
    });
    //update the total quality
    setTotalQuality((prev) => {
      let newQuality = prev - prevQualityValue;
      newQuality += quality;
      return newQuality;
    });

    //handle total price change
    const { quantity } = meal.ingredients.filter(
      (ingredient) => ingredient.name === name
    )[0];
    let priceToAdd = (quantity / 1000) * pricePerUnit;
    switch (quality) {
      case 10:
        priceToAdd += 0.1;
        break;
      case 20:
        priceToAdd += 0.05;
        break;
      default:
        break;
    }
    const prevPriceToAdd = previousPrices[prevQualityValueIndex];
    setPreviousPrices((prev) => {
      prev[prevQualityValueIndex] = priceToAdd;
      return [...prev];
    });
    setTotalPrice((prev) => {
      let newPrice = prev - prevPriceToAdd;
      newPrice += priceToAdd;
      return newPrice.toFixed(2);
    });
  };

  return (
    <Form
      style={{ display: "flex", justifyContent: "center" }}
      onFinish={handleConfirmMenu}
    >
      <Row gutter={[2, 16]} style={{ width: "80%" }}>
        <Col span={14}>
          <Title level={2} style={{ fontFamily: "Roboto" }}>
            {meal.name}
          </Title>
        </Col>
        <Col span={5}>
          <InformationDiv>
            <Title
              level={4}
              style={{ fontFamily: "Amatic SC", color: "white" }}
            >
              Quality Score :
            </Title>
            <span>{averagedQuality}</span>
          </InformationDiv>
        </Col>
        <Col span={5}>
          <InformationDiv>
            <Title
              level={4}
              style={{ fontFamily: "Amatic SC", color: "white" }}
            >
              Price ($):
            </Title>
            <span>{totalPrice}</span>
          </InformationDiv>
        </Col>
        <Divider />
        <Col span={24}>
          <Card>
            <Row gutter={[0, 20]}>
              <Col span={6}>
                <Title level={4} style={{ fontFamily: "Roboto" }}>
                  Ingredients
                </Title>
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center", gap: 5 }}
              >
                <Title level={5} style={{ fontFamily: "Roboto" }}>
                  low
                </Title>
                <Tooltip title="+$0.1 per meal">
                  <QuestionCircleOutlined style={{ color: "#79747E" }} />
                </Tooltip>
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center", gap : 5 }}
              >
                <Title level={5} style={{ fontFamily: "Roboto" }}>
                  medium
                </Title>
                <Tooltip title="+$0.05 per meal">
                  <QuestionCircleOutlined style={{ color: "#79747E" }} />
                </Tooltip>
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Title level={5} style={{ fontFamily: "Roboto" }}>
                  high
                </Title>
              </Col>
              {React.Children.toArray(
                meal.ingredients.map(({ name }, index) => {
                  const data = getQualityPrices(name);
                  return (
                    <>
                      <Col span={6}>
                        <Title level={5} style={{ fontFamily: "Roboto" }}>
                          {name}
                        </Title>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          name={`radio_${index}`}
                          rules={[
                            {
                              required: true,
                              message: "Please select an option",
                            },
                          ]}
                        >
                          <Radio.Group
                            onChange={(e) =>
                              handleQualityChange(e.target.value, name)
                            }
                            size="large"
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <Radio
                              value={`${10}|${data[2].price}|${data[2].suffix}`}
                              style={RadioItemStyles}
                            >
                              ${data[2].price}/{data[2].suffix}
                            </Radio>
                            <Radio
                              value={`${20}|${data[1].price}|${data[1].suffix}`}
                              style={RadioItemStyles}
                            >
                              ${data[1].price}/{data[1].suffix}
                            </Radio>
                            <Radio
                              value={`${30}|${data[0].price}|${data[0].suffix}`}
                              style={RadioItemStyles}
                            >
                              ${data[0].price}/{data[0].suffix}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </>
                  );
                })
              )}
            </Row>
          </Card>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            shape="round"
            className="btn-outlined"
            htmlType="submit"
            icon={<DoubleRightOutlined />}
          >
            Confirm Order
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default MenuItemByIdComponent;
