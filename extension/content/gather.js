// Function to check if the current URL is an Amazon product page with `/dp/`
const isAmazonProductPage = () => {
  return window.location.href.includes("/dp/")
}

/**
 * Converts string to number
 * Fallback value is null.
 */
const makeNumbersFromString = (string) => {
  return !Number.isNaN(+string) ? +string : null
}

/**
 * Gets element by tag name + its text
 */
function getElementByText(tags, text) {
  for (const tag of tags) {
    const elements = document.getElementsByTagName(tag)

    const foundElement = Array.from(elements).find((el) =>
      el.textContent.includes(text)
    )
    if (foundElement) return foundElement
  }
  return null
}

/**
 * Gets price details
 * Case 1: Price range for multiple options for products like colors or sizes
 *        Structure: {startPrice, endPrice}
 * Case 2: Single price for single product
 *        Structure: {startPrice} endPrice is null | undefined
 *
 */
const getPriceDetails = () => {
  const priceRange = document.querySelector(".a-price-range")

  if (priceRange) {
    const prices = priceRange.querySelectorAll(".a-offscreen")

    return {
      startPrice: makeNumbersFromString(
        prices[0]?.textContent?.trim().replace(/\$/g, "") * 100
      ),
      endPrice: makeNumbersFromString(
        prices[1]?.textContent?.trim().replace(/\$/g, "") * 100
      ),
    }
  } else {
    const price =
      document.querySelector(".a-price .a-price-whole")?.textContent +
        document.querySelector(".a-price .a-price-fraction")?.textContent ?? ""

    return { startPrice: makeNumbersFromString(price?.trim()) * 100 }
  }
}

/**
 * Get description details
 * Found cases via trial:
 * Case 1: <h1> About this item </h1> <ul> <li></ul> <ul> <li></ul> ...
 * Case 2: <h3> About this item </h3> <ul> <li><li> ... </ul>
 */
const getDescriptionDetails = () => {
  const descHeader = getElementByText(["h1", "h3"], "About this item")

  let current = descHeader.nextElementSibling

  // Array to store the collected descriptions
  const descriptions = []

  // Traverse through the siblings
  while (current) {
    // Check if the current element is a <ul>
    if (current.tagName === "UL") {
      const listItems = Array.from(current.querySelectorAll("li")).map((li) =>
        li.innerText.trim()
      )
      // Add listItems to descriptions if it's non-empty
      if (listItems.length > 0) {
        descriptions.push(...listItems) // Gather all <li> texts into descriptions
      }

      // If no <li> found, move to the next sibling
      current = current.nextElementSibling
    } else {
      current = null
    }
  }

  return descriptions
}

/**
 * Finds reviews via
 * Every review has alt-text with format 'x out of 5 stars'
 * We find the value of x
 * It is more reliable than finding the review count with its span tag directly
 * because it lacks unique id.
 */
const getReviewDetails = () => {
  const spans = document.querySelectorAll("span")

  let rating = null
  for (let span of spans) {
    const text = span.textContent.trim()

    // Check if the text matches the pattern "x out of 5 stars"
    const match = text.match(/^(\d+(\.\d+)?) out of 5 stars$/)

    if (match) {
      rating = match[1]
      break
    }
  }

  return makeNumbersFromString(rating)
}

const getProductDetails = () => {
  const name = document
    .querySelector("#productTitle")
    ?.textContent?.trim()
    .split(" ")
    .slice(1)
    .join(" ")

  console.log("Name scrap complete", name)

  const price = getPriceDetails()

  console.log("Price scrap complete", price)

  const description = getDescriptionDetails()

  console.log("Description scrap complete", description)

  const imageUrl = document
    .getElementById("imgTagWrapperId")
    .querySelector("img")
    .getAttribute("src")

  console.log("Image URL scrap complete", imageUrl)

  const review = getReviewDetails()

  console.log("Review scrap complete", review)

  return { name, description, price, imageUrl, review }
}

const scrapeDataParent = () => {
  if (isAmazonProductPage()) {
    const productDetails = getProductDetails()

    console.log("Product details to send to background", productDetails)

    chrome.runtime.sendMessage({ action: "productDetails", productDetails })
  }
}

const d = chrome.storage.local.get("scrapingEnabled", (data) => {
  if (!!data.scrapingEnabled) {
    scrapeDataParent()
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TOGGLE_SCRAPING") {
    if (request.enabled) {
      scrapeDataParent()
    }
  }
})
