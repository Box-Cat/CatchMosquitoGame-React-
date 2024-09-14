import React from 'react'
import styled from 'styled-components';

const Score = (props :any) => {
    return (
        <FlexBox>
            <StyledScore>당신은 {props.score}마리의 모기를 잡았습니다.</StyledScore> 
        </FlexBox>
  )
}

const StyledScore = styled.button`
   color:white;
   width: 1000px; 
   background-color:black;
   border: 2px solid white;
   border-radius: 25px;
   padding: 5px;
`;

const FlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content:center;
    
    .flex-1{
        flex: 1;
    }
`


export default Score