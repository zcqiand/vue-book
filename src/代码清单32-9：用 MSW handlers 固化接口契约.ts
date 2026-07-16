import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', ({ request }) => {
    const status = new URL(request.url).searchParams.get('status')

    if (status === '500') {
      return HttpResponse.json(
        { code: 500, data: null, message: '服务器内部错误' },
        { status: 500 }
      )
    }

    return HttpResponse.json({
      code: 200,
      data: [{ id: 1, username: 'demo' }],
      message: 'success'
    })
  })
]