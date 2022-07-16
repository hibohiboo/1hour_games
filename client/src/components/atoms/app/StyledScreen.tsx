import styled from 'styled-components'
export const StyledWindowScreen = styled.div.attrs(() => ({
  className: `cg-windowScreen`, // 使用先でclassNameを使って型エラーになるときは as string をつけたほうがよさそう
}))`
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
