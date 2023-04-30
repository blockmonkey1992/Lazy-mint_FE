import React from 'react'
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Button from '../Commons/Button/Button';

const NotFound = () => {
    const navi = useNavigate();

    return (
        <NotFoundPage className="container">
            <div style={{ fontSize: "100px", fontWeight: "800" }}>
                404
            </div>

            <div style={{ fontSize: "50px", marginBottom : "50px"}}>
                Sorry, Page not Found !
            </div>

            <Button 
                label="뒤로가기"
                loading={false}
                onClick={()=> navi("/")}
            />
       
        </NotFoundPage>
    )
}

export default NotFound;

const NotFoundPage = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

