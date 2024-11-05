console.log("Welcome to the service")

const mutation = `
  mutation AddProductDetails($productDetails: AddProductDetailsInput!) {
  addProductDetails(productDetails: $productDetails) {
    id
  }
}
`

export async function addProductDetails(params) {
  const response = await fetch("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: mutation,
      variables: params,
    }),
  })

  const { data, errors } = await response.json()

  if (errors) {
    console.error("Error adding product details", errors)
    return
  }

  console.log("Successfully added product details", { data })

  return data
}
