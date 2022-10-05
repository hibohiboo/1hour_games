import { rest } from 'msw'
export const handlers = [
  rest.put('/v1/api/solo-journal/scenario/:uuid', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get('/user', (req, res, ctx) => res(ctx.status(200))),
]
