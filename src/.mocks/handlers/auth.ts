import { http, HttpResponse, delay } from 'msw'

const mockUsers = [
  { id: '1', username: 'admin', nickname: '管理员', roles: ['admin'], permissions: ['user:list', 'user:create', 'user:update', 'user:delete'], avatar: '', email: 'admin@example.com', phone: '13800138000', createdAt: '2024-01-01' },
  { id: '2', username: 'editor', nickname: '编辑', roles: ['editor'], permissions: ['user:list'], avatar: '', email: 'editor@example.com', phone: '13800138001', createdAt: '2024-01-02' },
]

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string }
    await delay(300)

    if (body.username === 'admin' && body.password === 'password123') {
      return HttpResponse.json({
        code: 200,
        success: true,
        message: 'ok',
        timestamp: Date.now(),
        data: {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 7200,
        },
      })
    }

    return HttpResponse.json(
      { code: 401, success: false, message: '用户名或密码错误', timestamp: Date.now(), data: null },
      { status: 401 },
    )
  }),

  http.post('/api/auth/logout', async () => {
    await delay(100)
    return HttpResponse.json({ code: 200, success: true, message: 'ok', timestamp: Date.now(), data: null })
  }),

  http.get('/api/auth/user/info', () => {
    return HttpResponse.json({
      code: 200,
      success: true,
      message: 'ok',
      timestamp: Date.now(),
      data: mockUsers[0],
    })
  }),

  http.post('/api/auth/refresh', async () => {
    await delay(200)
    return HttpResponse.json({
      code: 200,
      success: true,
      message: 'ok',
      timestamp: Date.now(),
      data: {
        accessToken: 'refreshed-access-token-' + Date.now(),
        refreshToken: 'refreshed-refresh-token-' + Date.now(),
        expiresIn: 7200,
      },
    })
  }),

  http.get('/api/auth/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 20

    return HttpResponse.json({
      code: 200,
      success: true,
      message: 'ok',
      timestamp: Date.now(),
      data: {
        list: mockUsers.slice((page - 1) * pageSize, page * pageSize),
        total: mockUsers.length,
        page,
        pageSize,
        totalPages: Math.ceil(mockUsers.length / pageSize),
      },
    })
  }),
]
