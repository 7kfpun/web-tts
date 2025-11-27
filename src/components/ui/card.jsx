import styled from 'styled-components'
import { forwardRef } from 'react'

const BaseCard = styled.div`
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(15, 23, 42, 0.75);
  box-shadow: 0 30px 60px rgba(2, 6, 23, 0.65);
  backdrop-filter: blur(18px);
`

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: 0.03em;
  color: #f8fafc;
`

const Content = styled.div`
  padding: 1.5rem;
`

export const Card = forwardRef((props, ref) => <BaseCard ref={ref} {...props} />)
export const CardHeader = forwardRef((props, ref) => <Header ref={ref} {...props} />)
export const CardTitle = forwardRef((props, ref) => <Title ref={ref} {...props} />)
export const CardContent = forwardRef((props, ref) => <Content ref={ref} {...props} />)
