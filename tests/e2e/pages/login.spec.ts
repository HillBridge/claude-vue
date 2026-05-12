import { expect, test } from '@playwright/test'

test.describe('登录页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('正常渲染登录表单', async ({ page }) => {
    await expect(page.getByRole('heading')).toBeVisible()
    await expect(page.getByPlaceholder('请输入用户名')).toBeVisible()
    await expect(page.getByPlaceholder('请输入密码')).toBeVisible()
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
  })

  test('空表单提交显示校验错误', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page.getByText('请输入用户名')).toBeVisible()
    await expect(page.getByText('请输入密码')).toBeVisible()
  })

  test('登录成功跳转到控制台', async ({ page }) => {
    await page.getByPlaceholder('请输入用户名').fill('admin')
    await page.getByPlaceholder('请输入密码').fill('password123')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('权限控制', () => {
  test('未登录访问受保护页面重定向到登录', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
