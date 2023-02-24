import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Modal, Row, Col, Typography } from "antd";
import styled from "styled-components";

import { MenuItemById } from "../components";

import MealsContextProvider from "../context/MealsContext";

const { Title } = Typography;

function MenuByIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [totalQuality, setTotalQuality] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [confirmation, setConfirmation] = React.useState(false);

  const handleConfirmMenu = () => {
    setConfirmation(true);
  };

  const calculateAvgQuality = (ingredients) => {
    setTotalQuality(prev => (prev / ingredients).toFixed(2))
  }

  const onModalClose = () => {
    setConfirmation(false);
    navigate("/menu");
  };

  return (
    <MealsContextProvider>
      <div style={{ marginTop: "2rem" }}>
        <MenuItemById
          id={id}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          totalQuality={totalQuality}
          setTotalQuality={setTotalQuality}
          handleConfirmMenu={handleConfirmMenu}
          calculateAvgQuality={calculateAvgQuality}
        />
      </div>
      <Modal
        title="Your Order Was Submitted"
        centered={true}
        closable={false}
        open={confirmation}
        okText="Close"
        onOk={onModalClose}
        onCancel={onModalClose}
        okButtonProps={{
          className: "btn-filled",
          shape: "round",
          style: { width: "fit-content" },
        }}
        cancelButtonProps={{
          style : {display : 'none'}
        }}
      >
        We have successfully received your order. Below are the details of your
        order:
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Title level={5}>Price ($) :</Title>
          </Col>
          <Col span={12}>
            <Title level={5}>{totalPrice}</Title>
          </Col>
          <Col span={12}>
            <Title level={5}>Quality Score :</Title>
          </Col>
          <Col span={12}>
            <Title level={5}>{totalQuality}</Title>
          </Col>
        </Row>
      </Modal>
    </MealsContextProvider>
  );
}

export default MenuByIdPage;
