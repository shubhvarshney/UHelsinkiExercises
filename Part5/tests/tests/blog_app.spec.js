const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('http://localhost:5173')

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Shubh Varshney',
        username: 'shubhv',
        password: 'password'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Shubh Fake',
        username: 'shubhf',
        password: 'passw0rd'
      }
    })
    
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    const textboxes = await page.getByRole('textbox').all()
    expect(textboxes).toHaveLength(2)
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('shubhv')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Shubh Varshney logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('shubhv')
      await page.getByTestId('password').fill('wrongPassword')
      await page.getByRole('button', { name: 'login' }).click()
      const errorDiv = await page.locator('#error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(page.getByText('Shubh Varshney logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('shubhv')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Shubh Varshney logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('How to Bake Chocolate-Hazelnut Cookies')
      await page.getByTestId('author').fill('Agatha Warmheart')
      await page.getByTestId('url').fill('https://cooking.com/cake/recent')
      await page.getByRole('button', { name: 'create' }).click()

      const notifDiv = await page.locator('#notification')
      await expect(notifDiv).toContainText('a new blog How to Bake Chocolate-Hazelnut Cookies by Agatha Warmheart added')
      await expect(page.getByText('How to Bake Chocolate-Hazelnut Cookies Agatha Warmheart')).toBeVisible()
      await page.getByText('How to Bake Chocolate-Hazelnut Cookies').getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('https://cooking.com/cake/recent')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('How to Bake Chocolate-Hazelnut Cookies')
        await page.getByTestId('author').fill('Agatha Warmheart')
        await page.getByTestId('url').fill('https://cooking.com/cake/recent')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('How to Bake Chocolate-Hazelnut Cookies').getByRole('button', { name: 'view' }).click()
      })

      test('the blog can be liked', async ({ page }) => {
        const likeButton = await page.getByRole('button', { name: 'like' })
        await expect(likeButton).toBeVisible()
        await likeButton.click()
        await expect(page.getByText('likes')).toContainText('1')
      })

      test('the user who added the blog can delete the blog', async ({ page }) => {
        const deleteButton = await page.getByRole('button', { name: 'remove' })
        await expect(deleteButton).toBeVisible()
        page.on('dialog', dialog => dialog.accept())
        await deleteButton.click()
        await expect(page.getByText('How to Bake Chocolate-Hazelnut Cookies Agatha Warmheart')).not.toBeVisible()
      })

      test('the user who did not add the blog cannot delete it', async ({ page }) => {
        await page.getByRole('button', { name: 'logout'}).click()
        await page.getByTestId('username').fill('shubhf')
        await page.getByTestId('password').fill('passw0rd')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByText('How to Bake Chocolate-Hazelnut Cookies').getByRole('button', { name: 'view' }).click()
        const deleteButton = await page.getByRole('button', { name: 'remove' })
        await expect(deleteButton).not.toBeVisible()
      })
      test('the blogs are arranged in the order according to their likes, with the most likes first', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('How to Bake Chocolate-Walnut Cookies')
        await page.getByTestId('author').fill('Agatha Coldheart')
        await page.getByTestId('url').fill('https://cooking.com/cake/old')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('How to Bake Chocolate-Walnut Cookies').getByRole('button', { name: 'view' }).click()
        await page.getByText('How to Bake Chocolate-Walnut Cookies').locator('..').getByRole('button', { name: 'like' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('How to Bake Chocolate-Peanut Cookies')
        await page.getByTestId('author').fill('Agatha Normalheart')
        await page.getByTestId('url').fill('https://cooking.com/cake/recent')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('How to Bake Chocolate-Peanut Cookies').getByRole('button', { name: 'view' }).click()
        await page.getByText('How to Bake Chocolate-Peanut Cookies').locator('..').getByRole('button', { name: 'like' }).click()
        await page.getByText('How to Bake Chocolate-Peanut Cookies').locator('..').getByRole('button', { name: 'like' }).click()

        const blogs = await page.locator('.blog').all()
        await expect(blogs[0]).toContainText('How to Bake Chocolate-Peanut Cookies')
        await expect(blogs[1]).toContainText('How to Bake Chocolate-Walnut Cookies')
        await expect(blogs[2]).toContainText('How to Bake Chocolate-Hazelnut Cookies')
      })
    })
  })
})