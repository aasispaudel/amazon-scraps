// Function to check if the current URL is an Amazon product page with `/dp/`
const isAmazonProductPage = () => {
  return window.location.href.includes("/dp/")
}

/**
 * Converts string to number
 * Fallback value is -1. Price or Rating will not be negative so -1 suggests N/A
 */
const makeNumbersFromString = (string) => {
  return !Number.isNaN(+string) ? +string : -1
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
 * Case 2: Single price for single product
 */
const getPriceDetails = () => {
  console.log("i am here now what happen")

  const priceRange = document.querySelector(".a-price-range")

  console.log("idfferent place", priceRange)

  if (priceRange) {
    console.log({ priceRange })

    const prices = priceRange.querySelectorAll(".a-offscreen")

    return {
      startPrice: makeNumbersFromString(
        prices[0]?.textContent?.trim().replace(/\$/g, "")
      ),
      endPrice: makeNumbersFromString(
        prices[1]?.textContent?.trim().replace(/\$/g, "")
      ),
    }
  } else {
    const price =
      document.querySelector(".a-price .a-price-whole")?.textContent +
        document.querySelector(".a-price .a-price-fraction")?.textContent ?? ""

    console.log("price", { price })

    return { startPrice: makeNumbersFromString(price?.trim()) }
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

  let current = descHeader?.nextElementSibling

  if (!current) {
    return []
  }

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
  console.log("Getting product details")
  const productTitle = document
    .querySelector("#productTitle")
    ?.textContent?.trim()
    .split(" ")
    .slice(1)
    .join(" ")

  const price = getPriceDetails()

  const description = getDescriptionDetails()

  console.log("description", { description })

  const imageUrl = document
    .getElementById("imgTagWrapperId")
    .querySelector("img")
    .getAttribute("src")

  console.log({ imageUrl })

  const rating = getReviewDetails()

  return { productTitle, description, price, imageUrl, rating }
}

if (isAmazonProductPage()) {
  const productDetails = getProductDetails()

  console.log("Product detailsnew", productDetails)

  chrome.runtime.sendMessage(
    { action: "productDetails", productDetails },
    (response) => {
      console.log("received response", { response })
    }
  )

  console.log("message sent")
}
