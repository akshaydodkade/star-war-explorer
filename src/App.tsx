import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import MovieDetails from './components/MovieDetails';
import SearchAndSorting from './components/SearchAndSorting';
import MoviesList from './components/MoviesList';

const GlobalStyle = createGlobalStyle`
   body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
`;

const AppTitle = styled.h1`
  font-weight: 400;
  text-align: center;
  font-size: 2rem;
`;

const FlexLayout = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;

  display: flex;
  flex-direction: row;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <AppTitle>Star Wars Movie Explorer</AppTitle>
        <SearchAndSorting />
        <FlexLayout>
          <MoviesList />
          <MovieDetails />
        </FlexLayout>
      </Container>
    </>
  );
}

export default App;
