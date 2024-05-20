import {Page, expect} from '@playwright/test'

export class HelperBase{
    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async loginToConduit(email:string, password:string){
        await this.page.locator('a',{hasText: "Sign in"}).click()
        await this.page.getByPlaceholder('email').fill(email)
        await this.page.getByPlaceholder('password').fill(password)
        await this.page.locator('button',{hasText: "Sign in"}).click()
    }
}