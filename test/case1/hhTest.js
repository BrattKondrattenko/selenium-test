const { allure } = require("allure-mocha/runtime");
const { Builder, Browser } = require('selenium-webdriver');
const { afterEach } = require('mocha');
const HhPage = require('./hhPage');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Тесты сайта HH.ru', function() {
    this.timeout(60000);
    let driver;
    let hhPage;
    let logs = [];

    function logStep(message) {
        logs.push(message);
        console.log(message);
    }

    async function takeScreenshot(testName) {
        const date = new Date().toISOString().replace(/:/g, '-');
        const screenshotDir = "screenshots";
        const screenshotPath = path.join(screenshotDir, `${testName}_${date}.png`);
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }
        const image = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, image, 'base64');
        logStep(`Screenshot saved to: ${screenshotPath}`);
        allure.attachment("Screenshot", fs.readFileSync(screenshotPath), "image/png");
    }

    before(async () => {
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        hhPage = new HhPage(driver);
        await hhPage.openPage();
    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            await takeScreenshot(this.currentTest.title.replace(/\s+/g, '_'));
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        }
    });

    it('Должен перейти на страницу поиска вакансий', async () => {
        await allure.step("Шаг 1. Перешел на страницу поиска вакансий", async () => {
            await hhPage.inputSearchQuery('QA Engineer');
            await hhPage.clickSearchButton();
            logStep("Перешел на страницу поиска вакансий");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });

        await driver.sleep(1000);
    });

    it('Должен показать результаты поиска', async () => {
        await allure.step("Шаг 2. Закрыл окно регистрации", async () => {
            await hhPage.closeRegistrationPopup();
            logStep("Закрыл окно регистрации");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });

        await allure.step("Шаг 3. Результаты поиска видимы", async () => {
            const isVisible = await hhPage.isJobListingVisible();
            assert.ok(isVisible, "Результаты поиска не отображаются");
            logStep("Результаты поиска видимы");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });

        await driver.sleep(1000);
    });

    it('Должен открыть страницу первой вакансии', async () => {
        await allure.step("Шаг 4. Открыл страницу первой вакансии", async () => {
            await hhPage.clickFirstJobListing();
            logStep("Открыл страницу первой вакансии");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });

        await driver.sleep(1000);
    });
});