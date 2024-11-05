from pydantic import BaseModel, Field
from datetime import datetime
from datetime import UTC


class Price(BaseModel):
    """
        Database model for prices
        start_price: If price is range, startPrice else, price
        end_price: If price is range, endPrice else, not applicable

        All prices are in cents for better precision
    """
    start_price: int | None = None
    end_price: int | None = None

class ProductDetails(BaseModel):
    """
        Database models are represented by pydantic models.
        Since, couchdb interacts with python dicts to work with its json data,
        we will use .model_dump() from pydantic and db to convert the model to dict.
    """
    # Db specific
    id: str | None = None
    created_at: datetime = datetime.now(UTC)  # Default to current UTC time
    # Product specific
    name: str
    price: Price | None = None
    image_url: str | None = None
    description: list[str] | None = None
    review: float | None = None

