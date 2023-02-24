import React, { useState } from "react";
import { Input } from "antd";
import styled from "styled-components";

const FloatInputWrapper = styled.div`
  .float-label {
    position: relative;
  }

  .label {
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 12px;
    top: 11px;
    transition: 0.2 ease all;
    color : #6750A4;
  }

  .as-placeholder {
    color: grey;
  }

  .as-label {
    top: -8px;
    font-size: 12px !important;
    background-color: white;
    padding : 0 4px;
    margin-left: ${props => props.long? '4px' : '-4px'};
  }
`;

//implementation of an mui input in antd
export default function FloatInputComponent(props) {
  const [focus, setFocus] = useState(false);
  let { label, value, placeholder, required } = props;
  if (!placeholder) {
    placeholder = label;
  }

  const isOccupied = focus || (value && value.length !== 0);
  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";
  const asterisk = required ? <span className="text-danger">*</span> : null;

  return (
    <FloatInputWrapper
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      {...props}
    >
      <Input {...props} />
      <label className={labelClass}>
        {isOccupied && label} {isOccupied && asterisk}
      </label>
    </FloatInputWrapper>
  );
}
