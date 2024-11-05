import strawberry
from typing import List, Optional
from strawberry.permission import PermissionExtension
from db_core.mongodb import products_amazon
from permissions.rate_limiter import RateLimiter, limiter
from schema.types import ProductDetails, ProductDetailsPage, Price


@strawberry.type
class Query:
    """
        - Query for amazon product scraps
        - Exposes ProductDetailsPage based on current_page and items_per_page
        - Exposes next_page for easy infinite scroll
    """
    @strawberry.field(extensions=[PermissionExtension(permissions=[RateLimiter()])])
    def amazon_products(
        self,
        current_page: Optional[int] = 1,
        items_per_page: Optional[int] = 10
    ) -> ProductDetailsPage:
        products = (products_amazon.find().sort('created_at', -1)
                    .skip((current_page - 1) * items_per_page)
                    .limit(items_per_page)
                    )

        product_details = [ProductDetails(
            id=product['_id'],
            name=product['name'],
            price=Price(
                start_price=product['price']['start_price'],
                end_price=product['price']['end_price']
            ),
            image_url=product['image_url'],
            description=product['description'],
            review=product['review']
        ) for product in products]

        return ProductDetailsPage(data=product_details, next_page=current_page + 1)
