const { allure } = require("allure-mocha/runtime");
const { Builder, Browser } = require('selenium-webdriver');
const { afterEach } = require('mocha');
const HhPage2 = require('./hhPage2');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Тесты страницы "Работодателям" на HH.ru', function() {
    this.timeout(70000);
    let driver;
    let hhPage2;
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
        hhPage2 = new HhPage2(driver);
        await hhPage2.openPage();
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

    it('Должен перейти на страницу "Работодателям"', async () => {
        await allure.step("Шаг 1. Перешел на страницу 'Работодателям'", async () => {
            await hhPage2.goToEmployersPage();
            logStep("Перешел на страницу 'Работодателям'");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });
        await driver.sleep(1000);
    });

    it('Должен выполнить поиск по запросу "frontend"', async () => {
        await allure.step("Шаг 2. Ввел 'frontend' в поле поиска", async () => {
            await hhPage2.inputEmployersSearchQuery('frontend');
            logStep("Ввел 'frontend' в поле поиска");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });
        await driver.sleep(1000);
    });

    it('Должен перейти по вкладке', async () => {
        await allure.step("Шаг 3. Перешел по вкладке", async () => {
            await hhPage2.clickSearchButton();
            logStep("Открыл страницу первой вакансии");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });
        await driver.sleep(1000);
    });

    it('Должен нажать чекбокс', async () => {
        await allure.step("Шаг 4. Выбрал чекбокс 'Академический'", async () => {
            await hhPage2.selectAcademicCheckbox();
            logStep("Выбрал чекбокс 'Академический'");
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain");
        });
        await driver.sleep(1000);
    });
});
