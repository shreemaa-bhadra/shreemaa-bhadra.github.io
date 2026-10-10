---
description: Add a new recipe post to the blog
---

# Add New Recipe Post

This workflow guides you through creating a new recipe post following the blog's format.

## Prerequisites

- Recipe name decided
- Quick recipe description ready
- Images ready for upload
- Date decided for publishing

## Steps

### 1. Ask for Basic Information

Ask the user:

- **Recipe name**: What is the dish called?
- **Quick recipe summary**: A 1-2 sentence description of the dish
- **Publish date**: What date should this be published? (default: today)
- **Categories**: Which categories apply? (refer to existing ones in `/categories/` folder)
- **Tags**: Any specific tags? (e.g., difficulty level, ingredients, cooking time)

### 2. Ask for the Quick Recipe

Ask the user to provide the quick recipe - ingredients and steps in any format they prefer (can be informal, just the key points).

### 3. Ask for Images

Ask the user to provide all images for this recipe. Ask:

- Which image should be the **featured/hero image** (main image for the post)?
- Any additional process shots or final dish photos?

For each image:

- **Add watermark** "COOKSPAN.COM" at the bottom center of the image (use semi-transparent white or light text that contrasts with the image background)
- **Compress the image** using maximum compression that preserves image dimensions and maintains acceptable visual quality (target ~80-85% quality, or use tools like ImageMagick, Sharp, or similar)
- Save it to `/assets/uploads/YYYY/MM/` folder (create if doesn't exist)
- Use lowercase, hyphenated filenames
- Note the relative path for referencing in the post

### 4. Ask Clarifying Questions

Before writing, ask about anything unclear:

- **Prep time**: How long does preparation take?
- **Cook time**: How long does cooking take?
- **Servings**: How many people does it serve?
- **Cuisine type**: Indian, Odia, Bengali, Mexican, etc.?
- **Recipe type**: Breakfast, lunch, dinner, snack, dessert, etc.?
- **Difficulty**: Easy, medium, hard?
- **Dietary info**: Vegetarian, vegan, eggless, gluten-free?

### 5. Generate the Post Content

Based on the user's input, write the post following this structure.

> **SEO fields are required** — always fill in every field in the `# --- SEO fields ---` section. Do not leave them as placeholders. Use the information gathered in steps 1–4 to generate:
> - `description`: ≤160 chars, includes dish name + key appeal, used as the `<meta name="description">` and Open Graph description.
> - `keywords`: 5–8 comma-separated search terms the recipe would rank for.
> - `cuisine`, `diet`, timing fields, `recipe_yield`, `ingredients` list: power the Schema.org Recipe structured data that enables Google's rich recipe results.

**Frontmatter:**

```yaml
---
layout: post
title: [Recipe Name]
date: "YYYY-MM-DD 00:00:00 +0000"
categories:
  - [category1]
  - [category2]
tags:
  - [tag1]
  - [tag2]
image: "/assets/uploads/YYYY/MM/filename.jpg"
listing_summary: "[Brief 1-2 sentence description for cards/listings]"
listing_image: "/assets/uploads/YYYY/MM/filename.jpg"

# --- SEO fields ---
# description: used by jekyll-seo-tag for <meta name="description"> and OG description.
#   Write 1-2 sentences (≤160 chars) highlighting the dish, key flavors, and a hook.
description: "[SEO meta description: 1-2 sentences, ≤160 chars, include the dish name and main appeal]"
# keywords: comma-separated search terms someone might type to find this recipe.
keywords: "[dish name], [cuisine] recipe, [key ingredient] recipe, [occasion/difficulty], [descriptors]"
# cuisine / diet: used in Schema.org Recipe structured data
cuisine: "[Indian / Odia / Bengali / etc.]"
diet: "[Vegetarian / NonVegetarian / Vegan / Eggless — must be a valid Schema.org DietRestriction]"
# timing: ISO 8601 duration format (PT15M = 15 min, PT1H30M = 1h30m)
prep_time: "PT[X]M"
cook_time: "PT[X]M"
total_time: "PT[X]M"
recipe_yield: "[X servings]"
# ingredients: machine-readable list for Schema.org (mirrors the Ingredients section below)
ingredients:
  - "[quantity + unit + ingredient name]"
  - "[quantity + unit + ingredient name]"
---
```

**Content body structure:**

1. Featured image with alt text
2. Personal story/intro paragraph (warm, conversational tone like other posts)
3. `<!--more-->` separator
4. Additional context/story if relevant
5. `## Ingredients` or `### Ingredients for [Dish Name]:` (numbered list)
6. `## Steps of Preparation` or `### Steps of Preparation of [Dish Name]:` (numbered steps)
7. Additional images with captions
8. Serving suggestions
9. Optional: A thoughtful quote at the end
10. `<div class="recipe-meta">` with Recipe Type, Cuisine, Prep time, Total time, Serves

**Writing style notes:**

- Use warm, personal tone like existing posts
- Include brief anecdotes or context when relevant
- Format ingredients as numbered list with measurements
- Format steps as numbered list with clear, actionable instructions
- Include `_Preparation Time: X mins_ _Cooking Time: Y mins_` before steps when relevant
- Reference other related posts on the blog where applicable (e.g., "This pairs well with [Mango Chutney](link)")
- Avoid using em dashes (—) in recipe content; use spaces or hyphens instead.

### 6. Create the File

Create the file with the format: `YYYY-MM-DD-slugified-title.md` in `/_posts/` folder.

Slug rules:

- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Example: "Egg Biryani" → `egg-biryani`

### 7. Update References

After creating the post, check if any existing posts should reference this new recipe:

- Look for posts in similar categories
- Look for posts with related ingredients or cuisine types
- Update those posts to link to the new recipe where relevant

Example: If adding "Mango Chutney", update posts like "Bara Ghuguni" that mention "serve with Green chutney or Mango chutney" to link to the new post.

### 8. Confirm Completion

Show the user:

- The path to the new post file
- Summary of categories and tags used
- Confirmation that images are properly placed, watermarked, and compressed
- List of any posts updated with references
