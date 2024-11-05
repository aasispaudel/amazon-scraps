import { addProductDetails } from "./service.js"

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "productDetails") {
    console.log(
      "Received product details on service worker",
      message.productDetails
    )

    addProductDetails({ productDetails: message.productDetails })
  }
})
