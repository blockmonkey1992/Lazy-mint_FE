import React from "react";
import styled from "styled-components";

interface BtnProps {
  label: string;
  loading: boolean;
  onClick: () => void;
}

const Button = ({label, loading, onClick}: BtnProps) => {
  return (
    <Btn
      disabled={loading}
      className={loading ? "btn--disabled" : ""}
      onClick={onClick}
    >
      {loading ? <Spinner /> : label}
    </Btn>
  );
};

export default Button;

const Btn = styled.button`
  border: 1px solid var(--b4-color);
  color: white;
  background-color: var(--b4-color);
  font-weight: 900;
  font-size: 25px;
  height: 70px;
  width: 80%;
  border-radius: 10px;
  margin-top: 50px;
  &.btn--disabled {
    cursor: not-allowed;
    background-color: var(--b1-color);
    border: 1px solid var(--b1-color);
  }
`;

const Spinner = styled.div`
  height: 28px;
  width: 28px;
  position: relative;
  top: 3px;
  display: inline-block;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: rotate 1s linear infinite;
  @keyframes rotate {
    0% {
      transform: rotate(0); }
    100% {
      transform: rotate(360deg); }
  }
`;
