import styled from 'styled-components';

const Div = styled.div`
  display: flex;
  min-width: 60px;
  justify-content: flex-end;
  > div {
    width: auto;
    padding: 0 10px;
    height: 100%;
    color: #0e1622;
    &:hover > svg {
      color: rgb(0, 126, 255);
    }
  }
  > div:last-child {
    padding-right: 0;
  }
`;
export default Div;
