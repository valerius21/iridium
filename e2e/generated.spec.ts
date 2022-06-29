import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

    // Go to http://localhost:3000/?tic=foxtrott
    await page.goto('http://localhost:3000/?tic=foxtrott');

    // Click text=Starten
    await page.locator('text=Starten').click();
    await expect(page).toHaveURL('http://localhost:3000/register?tic=foxtrott');

    // Select 25-34
    await page.locator('select[name="age"]').selectOption('25-34');

    // Check #gender-m
    await page.locator('#gender-m').check();

    // Check input[name="country"]
    await page.locator('input[name="country"]').check();

    // Check input[name="socialNetworks"]
    await page.locator('input[name="socialNetworks"]').check();

    // Check input[name="tos"]
    await page.locator('input[name="tos"]').check();

    // Click text=Weiter
    await page.locator('text=Weiter').click();
    await expect(page).toHaveURL('http://localhost:3000/survey/1');

    // Go to http://localhost:3000/survey/3
    await page.goto('http://localhost:3000/survey/3');

    // Check input[name="sharing_personal_information_bothered"] >> nth=0
    await page.locator('input[name="sharing_personal_information_bothered"]').first().check();

    // Check input[name="sharing_personal_information_freely"] >> nth=1
    await page.locator('input[name="sharing_personal_information_freely"]').nth(1).check();

    // Check input[name="openess"] >> nth=2
    await page.locator('input[name="openess"]').nth(2).check();

    // Check input[name="worried_about_privacy"] >> nth=1
    await page.locator('input[name="worried_about_privacy"]').nth(1).check();

    // Check input[name="compare_privacy_with_others"] >> nth=2
    await page.locator('input[name="compare_privacy_with_others"]').nth(2).check();

    // Click text=18.) Für mich ist es das Wichtigste, Dinge vor anderen privat zu halten.1 - stim >> label >> nth=0
    await page.locator('text=18.) Für mich ist es das Wichtigste, Dinge vor anderen privat zu halten.1 - stim >> label').first().click();

    // Click div:nth-child(8) > .z-0 > li:nth-child(5) > .w-full
    await page.locator('div:nth-child(8) > .z-0 > li:nth-child(5) > .w-full').click();

    // Check input[name="public_self_information"] >> nth=2
    await page.locator('input[name="public_self_information"]').nth(2).check();

    // Check input[name="information_access_concerns"] >> nth=1
    await page.locator('input[name="information_access_concerns"]').nth(1).check();

    // Check input[name="out_of_context_information"] >> nth=2
    await page.locator('input[name="out_of_context_information"]').nth(2).check();

    // Check input[name="overthinking_information"] >> nth=3
    await page.locator('input[name="overthinking_information"]').nth(3).check();

    // Check input[name="paranoid"] >> nth=4
    await page.locator('input[name="paranoid"]').nth(4).check();

    // Click div:nth-child(14) > .z-0 > li:nth-child(5) > .w-full
    await page.locator('div:nth-child(14) > .z-0 > li:nth-child(5) > .w-full').click();

    // Click div:nth-child(15) > .z-0 > li >> nth=0
    await page.locator('div:nth-child(15) > .z-0 > li').first().click();

    // Check input[name="self_confident_info"] >> nth=0
    await page.locator('input[name="self_confident_info"]').first().check();

    // Check input[name="self_confident_thoughts"] >> nth=2
    await page.locator('input[name="self_confident_thoughts"]').nth(2).check();

    // Check input[name="sharing_feelings_with_others"] >> nth=3
    await page.locator('input[name="sharing_feelings_with_others"]').nth(3).check();

    // Click button:has-text("Weiter")
    await page.locator('button:has-text("Weiter")').click();


    /**
     * 
     *  Image evaluation
     * 
     * 
     */


    for (let index = 0; index < 60; index++) {

        // Check input[name="questionOne"] >> nth=1
        await page.locator('input[name="questionOne"]').nth(1).check();

        // Check input[name="confidenceOne"] >> nth=0
        await page.locator('input[name="confidenceOne"]').first().check();

        // Click text=Weiter
        await page.locator('text=Weiter').click();
        await expect(page).toHaveURL(/http:\/\/localhost:3000\/images\/.+\/qtwo\?.+/, { timeout: 15000 })
        //   await expect(page).toHaveURL('http://localhost:3000/images/09d781a6-4a4d-48db-81ac-ed485da7bc62/qtwo?confidence=1&question=stimme%20absolut%20nicht%20zu');

        // Click label:has-text("Kollegen")
        await page.locator('label:has-text("Kollegen")').click();

        // Check input[name="confidenceTwo"] >> nth=1
        await page.locator('input[name="confidenceTwo"]').nth(1).check();

        // Click button:has-text("Weiter")
        await page.locator('button:has-text("Weiter")').click();

        await expect(page).toHaveURL(/http:\/\/localhost:3000\/images\/.+\/qone/, { timeout: 15000 })

        console.log(index)
    }

    await page.screenshot({ path: 'screen.png', fullPage: true })

});