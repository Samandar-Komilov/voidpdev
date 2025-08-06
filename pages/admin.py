from typing import ClassVar

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

from .models import BlogPost, Project

User = get_user_model()

admin.site.unregister(User)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display: ClassVar[list] = ["id", "username", "email", "first_name", "last_name", "last_login"]
    list_display_links: ClassVar[list] = ["id", "username"]
    list_filter = ["is_active", "is_staff", "is_superuser"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display: ClassVar[list] = ["id", "title", "featured", "created_at"]
    list_display_links: ClassVar[list] = ["id", "title"]
    list_filter: ClassVar[list] = ["featured", "created_at"]
    search_fields: ClassVar[list] = ["title", "description", "technologies"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display: ClassVar[list] = ["id", "title", "published", "created_at"]
    list_display_links: ClassVar[list] = ["id", "title"]
    list_filter: ClassVar[list] = ["published", "created_at"]
    search_fields: ClassVar[list] = ["title", "content", "tags"]
    prepopulated_fields: ClassVar[list] = {"slug": ("title",)}

    fieldsets: ClassVar[tuple] = (
        (None, {"fields": ("title", "slug", "excerpt", "featured_image")}),
        (
            "Content",
            {
                "fields": ("content",),
                "description": "Write your content in Markdown. It will be automatically converted to HTML.",
            },
        ),
        ("Meta", {"fields": ("tags", "published")}),
    )
