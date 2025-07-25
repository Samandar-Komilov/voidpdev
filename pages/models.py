from typing import ClassVar

import markdown
from django.db import models
from django.urls import reverse
from django.utils.text import slugify


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    technologies = models.CharField(max_length=300, help_text="Comma-separated list")
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering: ClassVar[list] = ["-created_at"]

    def __str__(self):
        return self.title

    def get_technologies_list(self):
        return [tech.strip() for tech in self.technologies.split(",") if tech.strip()]


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField(help_text="Write in Markdown")
    excerpt = models.TextField(max_length=300, blank=True)
    featured_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.CharField(
        max_length=200, blank=True, help_text="Comma-separated tags"
    )

    class Meta:
        ordering: ClassVar[list] = ["-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.excerpt and self.content:
            # Create excerpt from first 150 chars of content
            plain_text = self.get_plain_content()[:150]
            self.excerpt = plain_text + "..." if len(plain_text) == 150 else plain_text
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("blog_detail", kwargs={"slug": self.slug})

    def get_html_content(self):
        """Convert markdown to HTML with syntax highlighting"""
        return markdown.markdown(
            self.content, extensions=["codehilite", "fenced_code", "tables", "toc"]
        )

    def get_plain_content(self):
        """Get plain text version for excerpts"""
        import re

        # Simple markdown to text conversion
        text = re.sub(r"[#*`_\[\]()]", "", self.content)
        return " ".join(text.split())

    def get_tags_list(self):
        return [tag.strip() for tag in self.tags.split(",") if tag.strip()]

    def get_reading_time(self):
        """Estimate reading time in minutes"""
        word_count = len(self.get_plain_content().split())
        return max(1, round(word_count / 200))  # Average 200 words per minute
