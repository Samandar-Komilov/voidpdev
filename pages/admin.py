from typing import ClassVar

from django.contrib import admin

from .models import BlogPost, Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display: ClassVar[list] = ["title", "featured", "created_at"]
    list_filter: ClassVar[list] = ["featured", "created_at"]
    search_fields: ClassVar[list] = ["title", "description", "technologies"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display: ClassVar[list] = ["title", "published", "created_at"]
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
