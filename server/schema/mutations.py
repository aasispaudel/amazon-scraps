import strawberry

from db_core.models import ProductDetails as ProductDetailsDbModel, Price as PriceDbModel
from db_core.mongodb import products_amazon
from schema.types import AddProductDetailsOutput
from schema.input_types import AddProductDetailsInput


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_product_details(
        self, product_details: AddProductDetailsInput
    ) -> AddProductDetailsOutput:
        # Verify with further pydantic validating before adding to database
        product_details_verified = ProductDetailsDbModel(
            name=product_details.name,
            image_url=product_details.image_url,
            description=product_details.description,
            review=product_details.review,
            price=PriceDbModel(
                start_price=product_details.price.start_price,
                end_price=product_details.price.end_price
            )
        )

        saved_id = products_amazon.insert_one(
            product_details_verified.model_dump()
        ).inserted_id

        saved_model = products_amazon.find_one({'_id': saved_id})
        out_model = AddProductDetailsOutput(id=saved_id, name=saved_model['name'])

        return out_model
