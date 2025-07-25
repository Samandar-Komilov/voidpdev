import markdown
from django import template

register = template.Library()


@register.filter
def markdown_to_html(value):
    """Convert markdown to HTML"""
    return markdown.markdown(
        value, extensions=["codehilite", "fenced_code", "tables", "toc"]
    )


@register.filter
def reading_time(content):
    """Calculate reading time"""
    import re

    text = re.sub(r"[#*`_\[\]()]", "", content)
    word_count = len(text.split())
    return max(1, round(word_count / 200))
