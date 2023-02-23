import React from "react";

import { Row, Col, Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const FoodCircleDiv = styled.div`
  width: clamp(350px, 60%, 500px);
  aspect-ratio: 1 / 1;
  border-radius: 100%;
  background-image: linear-gradient(to right, white, #6950a4);
  animation: spin infinite 16s ease-in-out;
  overflow: show;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ImageWrapper = styled.div`
  rotate: ${(props) => {
    switch (props.position) {
      case "top":
        return "0deg";
      case "left":
        return "270deg";
      case "right":
        return "90deg";
      case "bottom":
        return "180deg";
    }
  }};
  translate: ${(props) => {
    switch (props.position) {
      case "left":
        return "-50%";
      case "right":
        return "50%";
      case "top":
        return "0 -50%";
      case "bottom":
        return "0 50%";
    }
  }};
`;

const GreetingsWrapper = styled.div`
  position: relative;
  width: clamp(350px, 60%, 500px);
  aspect-ratio: 1 / 1;
  translate: 0 -50%;

  & > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -10rem;
    right: -10rem;
    padding-top : 1rem;
    background-color: white;
    border-top: 2px solid #79747e;
  }
`;

function Banner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: "12rem",
      }}
    >
      <FoodCircleDiv>
        <Row style={{ height: "100%" }} gutter={[16, 16]}>
          <Col span={8} />
          <Col span={8}>
            <ImageWrapper position="top">
              <img
                src={process.env.PUBLIC_URL + "/img/meals/rice_and_chicken.jpg"}
                style={{ width: "100%", borderRadius: 200 }}
              />
            </ImageWrapper>
          </Col>
          <Col span={8} />
          <Col span={8}>
            <ImageWrapper position="left">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/img/meals/pasta_with_marinara_sauce_and_vegetables.jpg"
                }
                style={{ width: "100%", borderRadius: 200 }}
              />
            </ImageWrapper>
          </Col>
          <Col span={8} />
          <Col span={8}>
            <ImageWrapper position="right">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/img/meals/pasta_with_marinara_sauce_and_vegetables.jpg"
                }
                style={{ width: "100%", borderRadius: 200 }}
              />
            </ImageWrapper>
          </Col>
          <Col span={8} />
          <Col span={8}>
            <ImageWrapper position="bottom">
              <img
                src={process.env.PUBLIC_URL + "/img/meals/rice_and_chicken.jpg"}
                style={{ width: "100%", borderRadius: 200 }}
              />
            </ImageWrapper>
          </Col>
          <Col span={8} />
        </Row>
      </FoodCircleDiv>
      <GreetingsWrapper>
        <div>
          <Row>
            <Col span={24} style={{display : "flex", justifyContent : "center"}}>
              <Title level={1} style={{fontSize : "clamp(3rem, 12vw, 12rem)", color : "#79747E", fontFamily : "Amatic SC"}}>Welcome</Title>
            </Col>
          </Row>
        </div>
      </GreetingsWrapper>
    </div>
  );
}

export default Banner;
