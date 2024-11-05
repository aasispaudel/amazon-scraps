/**
 * Converts priceString to integer
 * Fallback value is -1. Price will not be negative so -1 suggests N/A
 */
const makePricesFromString = (priceString) => {
  return !Number.isNaN(+priceString) ? +priceString : -1
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
