package fun_tradeoxy;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import baseTest.BaseTEST;

public class Functional_Testing extends BaseTEST {

    @Test(priority = 1)
    public void testSiteNavigation() {
        SoftAssert softAssert = new SoftAssert();

        // Verify homepage title
        String expectedTitle = "Scanners";
        String actualTitle = driver.getTitle();
        System.out.println(actualTitle);
        softAssert.assertEquals(actualTitle, expectedTitle, "Homepage title does not match!");
        System.out.println("Homepage title found");

        // Navigate to Stock
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement stock = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(or.getProperty("StockLink"))));

        stock.click();
        System.out.println("StockLink clicked");
        softAssert.assertTrue(driver.getTitle().contains("Stocks"), "Failed to navigate to Stocks page!");
        //driver.navigate().back();

        // Navigate to Crypto
        WebElement crypto = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(or.getProperty("cryptoLink"))));
        crypto.click();
        System.out.println("crypto clicked");
        softAssert.assertTrue(driver.getTitle().contains("Crypto"), "Failed to navigate to Crypto page!");
        //driver.navigate().back();

        // Navigate to Forex
        WebElement forex = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(or.getProperty("forexLink"))));
        forex.click();
        System.out.println("forex clicked");
        softAssert.assertTrue(driver.getTitle().contains("Forex"), "Failed to navigate to Forex page!");
        driver.navigate().to(config.getProperty("testsuiteurl"));

     
        softAssert.assertAll();
    }

    @Test(priority = 2)
    public void elementPresence() {
        SoftAssert softAssert = new SoftAssert();

        // Verify key elements
        softAssert.assertTrue(driver.findElement(By.xpath(or.getProperty("logo"))).isDisplayed(), "Logo not found!");
        softAssert.assertTrue(driver.findElement(By.xpath(or.getProperty("Signin"))).isDisplayed(), "Sign in not found!");
        softAssert.assertTrue(driver.findElement(By.xpath(or.getProperty("Scanners"))).isDisplayed(), "Scanners link not found!");
        softAssert.assertTrue(driver.findElement(By.xpath(or.getProperty("pricing"))).isDisplayed(), "Pricing link not found!");

      
        softAssert.assertAll();
    }
}
