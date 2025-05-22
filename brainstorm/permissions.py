from rest_framework import permissions

class IsPromptVariationCreator(permissions.BasePermission):
    """
    Custom permission to only allow creation of variations for publicly available prompts
    or prompts the user has previously interacted with.
    """

    def has_permission(self, request, view):
        # Always allow GET, HEAD or OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For POST, require authentication
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions for variations based on prompt access
        if hasattr(obj, 'prompt'):
            # Check if user has spun this prompt before
            return obj.prompt.roulettespin_set.filter(user=request.user)
        
        return False