from django.http import HttpResponse
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class BypassHostValidationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log all request headers
        logger.info("Request headers:")
        for header, value in request.META.items():
            if header.startswith('HTTP_'):
                logger.info(f"{header}: {value}")
        
        # Log the host
        host = request.get_host()
        logger.info(f"Request host: {host}")
        
        # Always allow the request to proceed
        return self.get_response(request)

class FaviconMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/favicon.ico':
            logger.info("Handling favicon request")
            response = HttpResponse(status=204)
            response['Content-Type'] = 'image/x-icon'
            return response
        return self.get_response(request)

class HostHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            # Get the host from the request
            host = request.get_host().split(':')[0]
            logger.info(f"Received request with host: {host}")
            logger.info(f"Current ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
            
            # Always allow the request to proceed
            return self.get_response(request)
            
        except Exception as e:
            logger.error(f"Error in HostHeaderMiddleware: {str(e)}")
            # Allow the request to proceed even if there's an error
            return self.get_response(request)

class OverrideHostMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log the original host
        original_host = request.get_host()
        logger.info(f"Original host: {original_host}")
        
        # Override the host-related headers
        request.META['HTTP_HOST'] = 'localhost'
        request.META['SERVER_NAME'] = 'localhost'
        request.META['SERVER_PORT'] = '10000'
        
        # Force the _get_raw_host method to return localhost
        request._get_raw_host = lambda: 'localhost'
        
        logger.info("Host headers overridden to localhost")
        return self.get_response(request) 