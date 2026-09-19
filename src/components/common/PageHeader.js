import styled from "styled-components";

const PageHeader = styled.h2`
  margin: 65px 0 35px;
  display: flex;
  align-items: center;
  gap: 24px;
  &::after {
    content: "";
    height: 1px;
    flex: 1;
    background: ${(p) => p.theme.borderColor};
  }
  font-size: 1.5rem;
  font-family: ${(p) => p.theme.typewriter};
  font-weight: 400;
  color: ${(p) => (p.theme.dark ? p.theme.textColor : p.theme.primaryTextColor)};
  text-align: left;
  letter-spacing: -0.04em;
`;

export default PageHeader;
