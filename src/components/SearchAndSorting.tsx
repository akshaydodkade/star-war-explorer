import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setSearch, setSortBy } from '../redux/movieSlice';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: none;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (min-width: 769px) {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  flex: 1;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;

  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='%23666' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;

  min-width: 180px;
`;

const SearchAndSorting = () => {
  const dispatch = useDispatch();
  const { search, sortBy } = useSelector((state: RootState) => state.movies);

  return (
    <Wrapper>
      <Input
        type='text'
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder='Search by Movie Title'
      />
      <Select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value as any))}>
        <option value="episode">Sort by Episode</option>
        <option value="year">Sort by Year</option>
        <option value="rating">Sort by Rating</option>
      </Select>
    </Wrapper>
  )
}

export default SearchAndSorting;