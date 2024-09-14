import React from 'react';
import styled from 'styled-components';

const Button = (props: any) => {
  return (
    <StyledButton
      onClick={props.onClick}
      width={props.width}
      $backgroundcolor={props.backgroundcolor} // Transient prop으로 변경
    > 
      {props.name}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ width: string; $backgroundcolor: string; }>` // Transient prop으로 변경
  color: white;
  background-color: ${(props) => props.$backgroundcolor}; // Transient prop으로 변경
  border: 2px solid white;
  border-radius: 25px;
  padding: 5px;
  width: ${(props) => props.width}px;
  height: 30px;
`;

export default Button;
