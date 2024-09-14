import React from 'react'
import styled from 'styled-components';

const Button = (props: any) => {
  return (
    <StyledButton
      onClick={props.onClick}
      width={props.width}
      backgroundColor ={props.backgroundColor}
    > 
      {props.name}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ width: string; backgroundColor: string;}>`
  color: white;
  background-color: ${(props) => props.backgroundColor};
  border: 2px solid white;
  border-radius: 25px;
  padding: 5px;
  width: ${(props) => props.width}px;
  height: 30px;
`;

export default Button;
