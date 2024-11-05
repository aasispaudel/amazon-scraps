import strawberry
from typing import Optional, List


@strawberry.input
class PriceInput:
    """
        Amazon scraps price
        start_price: If price is range, startPrice else, price
        end_price: If price is range, endPrice else, not applicable

        All prices are in cents for better precision
    """
    start_price: Optional[int]
    end_price: Optional[int] = None

@strawberry.input
class AddProductDetailsInput:
    """
        Amazon product details schema
    """
    name: str
    price: Optional[PriceInput] = None
    image_url: Optional[str] = None
    description: Optional[List[str]] = None
    review: Optional[float] = None
