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
  Input,
  Modal,
} from "antd";
import {
  DoubleRightOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
  calculateAvgQuality,
}) {
  const [meal, setMeal] = React.useState(null);

  // quality and price calculation states
  const [previousValues, setPreviousValues] = React.useState([]);
  const [previousPrices, setPreviousPrices] = React.useState([]);

  // highest quality on budget states
  const [showBudgetModal, setShowBudgetModal] = React.useState(false);
  const [budgetMeals, setBudgetMeals] = React.useState([]);

  // random meal on budget states
  const [showRandomModal, setShowRandomModal] = React.useState(false);
  const [randomMeal, setRandomMeal] = React.useState({});

  const {
    getMealById,
    getQualityPrices,
    getHighestQualityOnBudget,
    getRandomMealFromBudget,
  } = React.useContext(MealsContext);

  const averagedQuality = React.useMemo(() => {
    if (!meal) return 0;
    return (totalQuality / meal.ingredients.length).toFixed(2);
  }, [totalQuality, meal]);

  const budgetRef = React.useRef(0);

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

  const handleBudgetCheck = () => {
    if (budgetRef.current < 0) {
      window.alert("Budget Cannot be less than 0");
      return;
    }
    let budgetMeal = getHighestQualityOnBudget(id, budgetRef.current);
    setBudgetMeals(budgetMeal);
    setShowBudgetModal(true);
  };

  const handleRandomMeal = () => {
    if (budgetRef.current < 0) {
      window.alert("Budget Cannot be less than 0");
      return;
    }
    let result = getRandomMealFromBudget(id, budgetRef.current);
    if (result === null) {
      window.alert("No meal within budget");
      return;
    }
    setRandomMeal(result);
    setShowRandomModal(true);
  };

  return (
    <>
      <Modal
        title={"Searches"}
        centered={true}
        closable={false}
        open={showBudgetModal}
        okText="Close"
        onOk={() => setShowBudgetModal(false)}
        onCancel={() => setShowBudgetModal(false)}
        okButtonProps={{
          className: "btn-filled",
          shape: "round",
          style: { width: "fit-content" },
        }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <BudgetMenuModal ref={budgetRef} {...budgetMeals} />
      </Modal>
      <Modal
        title={"Random Meal"}
        centered={true}
        closable={false}
        open={showRandomModal}
        okText="Close"
        cancelText="Again"
        onOk={() => setShowRandomModal(false)}
        onCancel={handleRandomMeal}
        okButtonProps={{
          className: "btn-filled",
          shape: "round",
          style: { width: "fit-content" },
        }}
        cancelButtonProps={{
          className : 'btn-outlined',
          shape : 'round',
          style : {width : 'fit-content'}
        }}
      >
        <RandomMenuModal ref={budgetRef} {...randomMeal} />
      </Modal>

      <div style={{ width: "80%", margin: "0 auto" }}>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
          gutter={[0, 10]}
        >
          <Col span={24}>
            <Title
              level={5}
              style={{ fontFamily: "Roboto", textAlign: "center" }}
            >
              On Budget? Enter your budget below and get the best possible
              quality
            </Title>
            <Input.Search
              placeholder="enter budget"
              type="number"
              min={0}
              onSearch={handleBudgetCheck}
              onChange={(e) => (budgetRef.current = e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              shape="round"
              className="btn-outlined"
              icon={<SyncOutlined />}
              onClick={handleRandomMeal}
            >
              Randomize On Budget
            </Button>
          </Col>
        </Row>
      </div>

      <Form
        style={{ display: "flex", justifyContent: "center" }}
        onFinish={() => {
          handleConfirmMenu();
          calculateAvgQuality(meal.ingredients.length);
        }}
      >
        <Row gutter={[2, 16]} style={{ width: "80%" }}>
          <Divider />
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
                  style={{ display: "flex", justifyContent: "center", gap: 5 }}
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
                <Divider />
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
                                value={`${10}|${data[2].price}|${
                                  data[2].suffix
                                }`}
                                style={RadioItemStyles}
                              >
                                ${data[2].price}/{data[2].suffix}
                              </Radio>
                              <Radio
                                value={`${20}|${data[1].price}|${
                                  data[1].suffix
                                }`}
                                style={RadioItemStyles}
                              >
                                ${data[1].price}/{data[1].suffix}
                              </Radio>
                              <Radio
                                value={`${30}|${data[0].price}|${
                                  data[0].suffix
                                }`}
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
          <Divider />
          <MenuItemOptions
            mealId={id}
            lowQualityPrice={meal.lowQualityPrice.toFixed(2)}
            mediumQualityPrice={meal.mediumQualityPrice.toFixed(2)}
            highQualityPrice={meal.highQualityPrice.toFixed(2)}
          />
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
    </>
  );
}

function MenuItemOptions({
  mealId,
  lowQualityPrice,
  mediumQualityPrice,
  highQualityPrice,
}) {
  const [details, setDetails] = React.useState([]);
  const filteredDetails = React.useMemo(() => {
    if (details.length === 0) {
      return null;
    }
    let filtered = [];
    let lowNames = [];
    let mediumNames = [];
    let highNames = [];
    details.forEach(({ options }) => {
      options.forEach(({ name, quality }) => {
        switch (quality) {
          case "high":
            highNames.push(name);
            break;
          case "medium":
            mediumNames.push(name);
            break;
          case "low":
            lowNames.push(name);
            break;
        }
      });
    });
    filtered.push(highNames);
    filtered.push(mediumNames);
    filtered.push(lowNames);
    return filtered;
  }, [details]);
  const { getIngredientsDetails } = React.useContext(MealsContext);

  React.useEffect(() => {
    setDetails(() => getIngredientsDetails(mealId));
  }, []);

  return (
    <Col span={24}>
      <Card style={{ background: "#1D192B06", border: "1px solid #79747E" }}>
        <Row gutter={[20, 0]}>
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Title level={4} style={{ fontFamily: "Roboto" }}>
              Options
            </Title>
          </Col>
          <Divider />
          <Col span={8}>
            <Card
              title="Low"
              extra={"$" + `${lowQualityPrice}`}
              style={{ fontFamily: "Roboto" }}
            >
              {React.Children.toArray(
                filteredDetails &&
                  filteredDetails[2].map((name) => <p>{name}</p>)
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Medium"
              extra={"$" + `${mediumQualityPrice}`}
              style={{ fontFamily: "Roboto" }}
            >
              {React.Children.toArray(
                filteredDetails &&
                  filteredDetails[1].map((name) => <p>{name}</p>)
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="High"
              extra={"$" + `${highQualityPrice}`}
              style={{ fontFamily: "Roboto" }}
            >
              {React.Children.toArray(
                filteredDetails &&
                  filteredDetails[0].map((name) => <p>{name}</p>)
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

const BoxedSpan = styled.span`
  padding: 0.5rem;
  border: 2px solid #79747e;
  color: #79747e;
  font-family: inherit;
`;

const BudgetMenuModal = React.forwardRef((props, ref) => {
  return (
    <Card>
      <Row gutter={[20, 10]}>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Title level={5} style={{ fontFamily: "Roboto", marginRight: 5 }}>
            Highest Quality <BoxedSpan>{props.maxQuality.toFixed(2)}</BoxedSpan>{" "}
            is possible on budget $ <BoxedSpan>{ref.current}</BoxedSpan>
          </Title>
          <Tooltip title="additional charges may be applicable for food quality">
            <QuestionCircleOutlined style={{ color: "#79747E" }} />
          </Tooltip>
        </Col>
        {React.Children.toArray(
          props.meals.map((budgetMeal, index) => {
            let mealPrice = budgetMeal.reduce(
              (acc, curr) => acc + (curr.quantity / 1000) * curr.price,
              0
            );
            return (
              <Col span={24}>
                <Card
                  title={index + 1}
                  extra={`$${mealPrice.toFixed(2)}`}
                  style={{ fontFamily: "Roboto" }}
                >
                  {React.Children.toArray(
                    budgetMeal.map((ingredient) => {
                      return (
                        <p style={{ fontFamily: "Roboto" }}>
                          {ingredient.name}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            <small>
                              {ingredient.parentType}({ingredient.quality})
                            </small>
                          </span>
                        </p>
                      );
                    })
                  )}
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Card>
  );
});

const RandomMenuModal = React.forwardRef((props, ref) => {
  return (
    <Card>
      <Row gutter={[20, 10]}>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Title level={5} style={{ fontFamily: "Roboto", marginRight: 5 }}>
            Random Quality <BoxedSpan>{props.quality.toFixed(2)}</BoxedSpan> is
            found for budget $ <BoxedSpan>{ref.current}</BoxedSpan>
          </Title>
          <Tooltip title="additional charges may be applicable for food quality">
            <QuestionCircleOutlined style={{ color: "#79747E" }} />
          </Tooltip>
        </Col>
        <Col span={24}>
          <Card
            title={"Price"}
            extra={`$${props.meal.total.toFixed(2)}`}
            style={{ fontFamily: "Roboto" }}
          >
            {React.Children.toArray(
              props.meal.combination.map((ingredient) => {
                return (
                  <p style={{ fontFamily: "Roboto" }}>
                    {ingredient.name}{" "}
                    <span style={{ fontWeight: "bold" }}>
                      <small>
                        {ingredient.parentType}({ingredient.quality})
                      </small>
                    </span>
                  </p>
                );
              })
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
});

export default MenuItemByIdComponent;
