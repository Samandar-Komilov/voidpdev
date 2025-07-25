from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, render

from .models import BlogPost, Project


def home(request):
    """Homepage with intro and featured projects"""
    featured_projects = Project.objects.filter(featured=True)[:3]
    recent_posts = BlogPost.objects.filter(published=True)[:3]

    context = {
        "featured_projects": featured_projects,
        "recent_posts": recent_posts,
    }
    return render(request, "index.html", context)


def projects(request):
    """Projects page with filtering"""
    projects_list = Project.objects.all()

    # HTMX filtering
    tech_filter = request.GET.get("tech", "")
    if tech_filter:
        projects_list = projects_list.filter(technologies__icontains=tech_filter)

    # Get all unique technologies for filter options
    all_techs = set()
    for project in Project.objects.all():
        all_techs.update(project.get_technologies_list())

    context = {
        "projects": projects_list,
        "all_technologies": sorted(all_techs),
        "current_tech": tech_filter,
    }

    # Return partial template for HTMX requests
    if request.headers.get("HX-Request"):
        return render(request, "partials/project_list.html", context)

    return render(request, "projects.html", context)


def blog_list(request):
    """Blog list with search and pagination"""
    posts = BlogPost.objects.filter(published=True)

    # Search functionality
    search_query = request.GET.get("search", "")
    tag_filter = request.GET.get("tag", "")

    if search_query:
        posts = posts.filter(
            Q(title__icontains=search_query)
            | Q(content__icontains=search_query)
            | Q(tags__icontains=search_query)
        )

    if tag_filter:
        posts = posts.filter(tags__icontains=tag_filter)

    # Pagination
    paginator = Paginator(posts, 6)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    # Get all tags for filter
    all_tags = set()
    for post in BlogPost.objects.filter(published=True):
        all_tags.update(post.get_tags_list())

    context = {
        "page_obj": page_obj,
        "search_query": search_query,
        "all_tags": sorted(all_tags),
        "current_tag": tag_filter,
    }

    # HTMX partial response
    if request.headers.get("HX-Request"):
        return render(request, "blog/partials/blog_list_content.html", context)

    return render(request, "blog/blog_list.html", context)


def blog_detail(request, slug):
    """Individual blog post"""
    post = get_object_or_404(BlogPost, slug=slug, published=True)
    related_posts = BlogPost.objects.filter(published=True).exclude(id=post.id)[:3]

    context = {
        "post": post,
        "related_posts": related_posts,
    }
    return render(request, "blog/blog_detail.html", context)
