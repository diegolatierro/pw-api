import { test, expect, request} from '@playwright/test';
import { HelperBase } from "../page-objects/helperBase";

test.beforeEach(async({page}) =>{
  await page.goto('https://conduit.bondaracademy.com/')
})

test('Basic test for tag', async ({ page }) => {
  const response = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags');
  await expect(response.status()).toBe(200)
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
});

test('Create an article as a user', async ({ page }) => {
  const hb = new HelperBase(page)
  await hb.loginToConduit("testAPI@test.com","welcome123")

  await page.locator('a', {hasText:"New Article"}).click()
  await page.getByPlaceholder('Article Title').fill("Automated Article Title")
  await page.getByPlaceholder('What\'s this article about?').fill("Article is about automation api testing")
  await page.getByPlaceholder('Write your article').fill("Content about the article that it is related to API testing")
  await page.locator('button',{hasText: "Publish Article"}).click()

  const response = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
  await expect(response.status()).toBe(201)
});

test('Create an article with API', async ({ page, request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data:{
      "user":{"email":"testAPI@test.com","password":"welcome123"}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token

  const articleReponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
    data:{
      "article":{"title":"Automated Article Title with API","description":"Test description with API","body":"Test body with API","tagList":[]}
    },
    headers:{
      Authorization: `Token ${accessToken}`
    }
  })
  await expect(articleReponse.status()).toBe(201)
});

test('Delete an article as a user', async ({ page }) => {
  const hb = new HelperBase(page)
  await hb.loginToConduit("testAPI@test.com","welcome123")
  
  await page.locator('a', {hasText:"New Article"}).click()
  await page.getByPlaceholder('Article Title').fill("Automated Article Title")
  await page.getByPlaceholder('What\'s this article about?').fill("Article is about automation api testing")
  await page.getByPlaceholder('Write your article').fill("Content about the article that it is related to API testing")
  await page.locator('button',{hasText: "Publish Article"}).click()
  
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
  const articleResponseBody = await articleResponse.json()
  const articleId = articleResponseBody.article.slug
  await page.locator('button', {hasText: "Delete Article"}).first().click()

  const response = await page.waitForResponse(`https://conduit-api.bondaracademy.com/api/articles/${articleId}`);
  await expect(response.status()).toBe(204)
});

test('Delete an article with API', async ({ page, request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data:{
      "user":{"email":"testAPI@test.com","password":"welcome123"}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
    data:{
      "article":{"title":"Auto Article Title with API to be deleted","description":"Test description with API","body":"Test body with API","tagList":[]}
    },
    headers:{
      Authorization: `Token ${accessToken}`
    }
  })
  
  const articleResponseBody = await articleResponse.json()
  const articleId = articleResponseBody.article.slug

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleId}`,{
    headers:{
      Authorization: `Token ${accessToken}`
    }
  })
  await expect(deleteArticleResponse.status()).toBe(204)
});