from typing import Any

from slowapi import Limiter
from slowapi.util import get_remote_address
from strawberry.types import Info
from strawberry.permission import BasePermission
from starlette.requests import Request


# Initialize the limiter with a rate limit of 5 requests per minute per IP
limiter = Limiter(key_func=get_remote_address)

class RateLimiter(BasePermission):
    message = "Rate limit exceeded"

    async def has_permission(self, source: Any, info: Info, **kwargs
                             ) -> bool:
        """
            Effectively rate limits based on strawberry permissions

            :return: Boolean that will determine whether we can access our api or not
        """
        call_request: Request = info.context["request"]

        # Apply rate limiting for each client IP address
        try:
            limiter.limit("4000/minute")(lambda request: None)(call_request)  # 5 requests per minute
            return True  # Allow access if within limit
        except Exception as e:
            return False  # Deny access if limit is exceeded
