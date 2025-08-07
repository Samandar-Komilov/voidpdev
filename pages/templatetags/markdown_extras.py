from bs4 import BeautifulSoup
from django import template

register = template.Library()


@register.filter
def reading_time(content):
    """Calculate reading time from HTML content"""
    soup = BeautifulSoup(content or "", "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    word_count = len(text.split())

    return max(1, round(word_count / 200))
