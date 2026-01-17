---
title: "Introduction to GIS for a Software Engineer: PostGIS"
description: "What happens if a software engineer starts interesting Geoinformatics? He starts with bare bones, such as PostGIS!"
date: 2025-11-30
categories:
  - GIS
---

What happens if a software engineer starts interesting Geoinformatics? He starts with bare bones, such as PostGIS!

<!-- more -->

### What is a spatial database?
A spatial database is a database that stores geometry, geography, raster types and executes spatial operations on them. PostGIS is actually an extension to PostgreSQL, which adds spatial abilities through several functions and also third-party access (GDAL/OGR, PROJ and GEOS).

### How to think spatially?
Well, why we need spatial functionality, PostgreSQL already performs good enough! Well, not all cases. The following are example cases where spatial databases, for example PostGIS, helps us to solve math/geometry related problems that a traditional SQL database can't perform or performs too poor:
- "What is the area of this farmland?". Computing area on curved Earth is nontrivial: it requires complex math. PostGIS offers `ST_Area()`.
- "Find all schools within 500 meters of this road.". Distances on Earth are not straight-line Euclidean in raw numbers, it is required to use a complex geometric algorithm to compute "inside a polygon?". PostGIS provides `ST_DWithin`, `ST_Contains`, `ST_Intersects`.
- "Give me all parcels that share a boundary with parcel X.". Without spatial types, you would have to manually compare coordinate sequences, detect shared borders, handle rounding issues. Completely impractical. PostGIS provides `ST_Touches()`.

So, in conclusion:
- Anything involving distance that isn’t trivial
- Anything involving polygon inclusion/exclusion
- Anything involving adjacency or topology
- Anything involving buffers or catchment areas
- Anything involving spatial joins between datasets
- Anything involving clipping, merging, unioning geometries
- Anything involving Earth-coordinate transformations
- Anything involving true geometric measurement

requires us to use spatial databases. And PostGIS gives solution to all of these cases, which is great in fact, as it is free and it is the cousin of our dear PostgreSQL!

--- 

Soon...