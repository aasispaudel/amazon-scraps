import strawberry
from typing import List, Optional
from strawberry.permission import PermissionExtension
from db_core.mongodb import products_amazon
from permissions.rate_limiter import RateLimiter, limiter
from schema.types import ProductDetails, ProductDetailsPage, Price
from strawberry.dataloader import DataLoader
from functools import partial


@strawberry.type
class Query:
    """
        - Query for amazon product scraps
        - Exposes ProductDetailsPage based on current_page and items_per_page
        - Exposes next_page for easy infinite scroll
    """

    # GraphQL field definition
    @strawberry.field(extensions=[PermissionExtension(permissions=[RateLimiter()])])
    async def amazon_products(
        self,
        info,
        current_page: Optional[int] = 1,
        items_per_page: Optional[int] = 10
    ) -> ProductDetailsPage:
        product_loader = get_product_loader(items_per_page)
        return await product_loader.load(current_page)


# Define ProductLoader
async def load_products(keys: List[int], items_per_page: int) -> List[ProductDetailsPage]:
    # Here we would batch fetch the products using the keys
    pages = []
    for page in keys:
        products = (products_amazon.find().sort('created_at', -1)
                    .skip((page - 1) * items_per_page)
                    .limit(items_per_page))
        product_details = [
            ProductDetails(
                id=product['_id'],
                name=product['name'],
                price=Price(
                    start_price=product['price']['start_price'],
                    end_price=product['price']['end_price']
                ),
                image_url=product['image_url'],
                description=product['description'],
                review=product['review']
            )
            for product in products
        ]
        pages.append(ProductDetailsPage(data=product_details, next_page=page + 1))
    return pages

# Instantiate DataLoader
def get_product_loader(items_per_page: int):
    return DataLoader(partial(load_products, items_per_page=items_per_page))
