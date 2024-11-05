document.addEventListener("DOMContentLoaded", async () => {
  const toggle = document.getElementById("scrapingToggle")

  chrome.storage.local.get("scrapingEnabled", ({ scrapingEnabled }) => {
    toggle.checked = !!scrapingEnabled
  })

  // Listen for toggle changes
  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked
    chrome.storage.local.set({ scrapingEnabled: isEnabled })

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "TOGGLE_SCRAPING",
        enabled: isEnabled,
      })
    })
  })
})

document.addEventListener("DOMContentLoaded", async () => {
  const query = `query GetAmazonProducts($currentPage: Int!, $itemsPerPage: Int!) {
    amazonProducts(currentPage: $currentPage, itemsPerPage: $itemsPerPage) {
      data {
        id
        name
        imageUrl
      }
      nextPage
    }
  }
  `

  const variables = {
    currentPage: 1,
    itemsPerPage: 3,
  }
  const response = await fetch("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const { data, errors } = await response.json()

  if (errors) {
    console.error("Error getting amazon products", errors)
    return
  }

  const products = data.amazonProducts.data

  renderProducts(products)
})

function renderProducts(products) {
  const productContainer = document.getElementById("product-container")

  products.forEach((product) => {
    const productElement = document.createElement("div")
    productElement.classList.add("product")

    const imageElement = document.createElement("img")
    imageElement.src = product.imageUrl
    imageElement.alt = product.name

    const nameElement = document.createElement("h3")
    nameElement.textContent = product.name

    productElement.appendChild(imageElement)
    productElement.appendChild(nameElement)
    productContainer.appendChild(productElement)
  })
}
