from schema.mutations import Mutation
from schema.queries import Query
import strawberry
from strawberry.extensions import QueryDepthLimiter

schema = strawberry.Schema(query=Query, mutation=Mutation,
                           extensions=[
                               QueryDepthLimiter(max_depth=15),
                           ]
                           )
