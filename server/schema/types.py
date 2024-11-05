import strawberry
from typing import List, Optional

from strawberry import ID


@strawberry.type
class Price:
    """
        Amazon scraps price type
        All prices are in cents for better precision
    """
    start_price: Optional[int]
    end_price: Optional[int] = None


@strawberry.type
class ProductDetails:
    """
        Amazon product details schema
    """
    id: ID
    name: str
    price: Optional[Price] = None
    image_url: Optional[str] = None
    description: Optional[List[str]] = None
    review: Optional[float] = None


@strawberry.type
class ProductDetailsPage:
    """
        Amazon product details schema
    """
    data: list[ProductDetails]
    next_page: int


@strawberry.type
class AddProductDetailsOutput:
    """
        Amazon product details schema
    """
    id: ID
    name: str
