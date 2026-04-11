#!/usr/bin/env ruby
# frozen_string_literal: true

# Adds listing_summary + listing_image to each post for the home layout.
# listing_image = last ![](...) in the body, or front matter image if none.
# Safe to re-run; overwrites listing_* keys.

require "date"
require "yaml"

ROOT = File.expand_path("..", __dir__)

def split_front_matter(raw)
  return [nil, raw] unless raw.start_with?("---\n")

  rest = raw[4..]
  idx = rest.index("\n---\n")
  return [nil, raw] unless idx

  [rest[0, idx], rest[idx + 4..]]
end

def squish(s)
  s.to_s.gsub(/\s+/, " ").strip
end

def strip_markdown_links(s)
  s.gsub(/\[([^\]]+)\]\([^)]*\)/, '\1')
end

def extract_summary(body)
  b = body.strip

  first_markdown_heading = b.index(/\n##\s/m)
  first_serves = b.index(/Serves:\s*[^\n]+/i)
  classic_recipe_block = first_serves && (first_markdown_heading.nil? || first_serves < first_markdown_heading)

  if classic_recipe_block
    m = b.match(/Serves:\s*[^\n]+\s*\n+([\s\S]*?)\n+\s*#*\s*\*?Ingredients\b/im)
    return squish(strip_markdown_links(m[1])) if m
  end

  opening = extract_opening_fallback_inner(b)
  m2 = b.match(/Serves:\s*[^\n]+\s*\n+([\s\S]*?)\n+\s*#*\s*\*?Ingredients\b/im)
  if m2
    tagline = squish(strip_markdown_links(m2[1]))
    if tagline.length <= 240 && opening.length > 300 && !tagline.match?(/\AHealthy\s/i)
      return tagline
    end
  end

  opening
end

def extract_opening_fallback_inner(b)
  blocks = b.split(/\n{2,}/)
  taken = []
  blocks.each do |blk|
    next if blk.strip.empty?
    break if blk.match?(/\A#+\s/)
    break if blk.strip.start_with?("![")
    break if blk.strip.start_with?("[![")

    taken << blk
    break if squish(taken.join(" ")).length > 320
    break if taken.size >= 3
  end

  text = squish(strip_markdown_links(taken.join(" ")))
  text = text.gsub(/[*_`]+/, "").strip
  max_len = 520
  return text if text.length <= max_len

  cut = text[0, max_len]
  squish(cut.sub(/\s+\S*\z/, "")) + "…"
end

def extract_listing_image(body)
  urls = body.scan(/!\[[^\]]*\]\(([^)]+)\)/).flatten
  return nil if urls.empty?

  url = urls.last.strip.split(/\s+/).first.to_s.delete('"').delete("'")
  url.empty? ? nil : url
end

Dir.glob(File.join(ROOT, "_posts", "*.md")).sort.each do |path|
  raw = File.read(path)
  fm_yaml, body = split_front_matter(raw)
  unless fm_yaml
    warn "skip #{path} (no front matter)"
    next
  end

  data = YAML.safe_load(fm_yaml, permitted_classes: [Date, Time], aliases: true)
  unless data.is_a?(Hash)
    warn "skip #{path} (bad yaml)"
    next
  end

  summary = extract_summary(body)
  img = extract_listing_image(body) || data["image"]

  data["listing_summary"] = summary unless summary.empty?
  data["listing_image"] = img if img

  new_fm = YAML.dump(data).sub(/\A---\n/, "").sub(/\n\.\.\.\n?\z/, "\n")
  out = +"---\n#{new_fm}---\n#{body}"
  File.write(path, out)
  puts path.sub(%r{\A#{Regexp.escape(ROOT)}/}, "")
end

puts "Done."
