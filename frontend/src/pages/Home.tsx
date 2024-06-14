import styled from "styled-components"

const Div = styled.div`
    display: flex; 
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
`

const Home = () => {
    return (
        <>  
            <Div>
            <h1>EM 2024</h1>
            <p>Tippa på alla matcher 1X2 under EM 2024</p>
            <p>OBS!! Spelstopp 1 sekund innan matchstart.</p>
            </Div>
        </>
    )
}

export default Home