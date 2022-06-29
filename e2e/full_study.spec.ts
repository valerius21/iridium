import { test, expect, } from '@playwright/test'
import { forIn } from 'lodash'

test.describe.parallel('Create Multiple users', () => {
    const surveySelectorsText3 = [
        ...([
            'sharing_personal_information_bothered',
            'sharing_personal_information_freely',
            'openess',
            'worried_about_privacy',
            'compare_privacy_with_others',
            'privacy_priority',
            'dont_care',
            'public_self_information',
            'information_access_concerns',
            'out_of_context_information',
            'overthinking_information',
            'paranoid',
            'consequences_of_sharing_personal_information',
            'self_confident_info',
            'self_confident_thoughts',
            'sharing_feelings_with_others',
        ].map(s => `input[name=${s}]`))
    ]
    for (let index = 0; index < 1; index++) {
        test(`basic test - ${index}`, async ({ page }) => {
            await page.goto('http://localhost:3000/?tic=foxtrott')
            await expect(page).toHaveTitle("Image Classification Study")
            await page.click('text=Starten')
            await expect(page).toHaveURL('http://localhost:3000/register?tic=foxtrott')
            await page.selectOption('#age-select', '18-24')
            await page.check('#gender-w')
            await page.check('#country-field')
            await page.check('#socialNetworks-field')
            await page.check('#tos-field')
            await page.click('text=Weiter')
            await expect(page).toHaveURL('http://localhost:3000/survey/1')
            await page.goto('http://localhost:3000/survey/3')
            for (let index = 0; index < surveySelectorsText3.length; index++) {
                const element = surveySelectorsText3[index];
                await page.check(element)
            }
            await page.click('button[type=submit]')
            await expect(page).toHaveURL(/http:\/\/localhost:3000\/images\/.+\/qone/)

            // Check input[name="questionOne"] >> nth=0
            await page.locator('input[name="questionOne"]').first().check();
            // Check input[name="confidenceOne"] >> nth=1
            await page.locator('input[name="confidenceOne"]').nth(1).check();
            // Click text=Weiter
            await page.locator('text=Weiter').click();
            await expect(page).toHaveURL(/http:\/\/localhost:3000\/images\/.+\/qtwo/)
        })
    }
})