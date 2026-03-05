import os
import re

POSTS_DIR = r"c:\Users\ichikawa\Desktop\sparks-station\src\content\posts"

# 15種類の新しいタグ (The 15 allowed tags)
# "SuccessCase", "FailureCase", "Concept", "AI", "SaaS", "MobileApp", "DeepTech", "Strategy", "GTM", "Product", "TechStack", "Monetization", "Bootstrapped", "Exit", "BuildInPublic"

# Mapping rules (old tag -> new tag)
TAG_MAPPING = {
    # 記事の性質 (優先して先頭に置くもの)
    "successcase": "SuccessCase",
    "failurecase": "FailureCase",
    "concept": "Concept",
    "outcomeeconomy": "Concept",
    "singularity": "Concept",
    "narrativeengineering": "Concept",
    "evaluationeconomy": "Concept",
    "mathematicalmarketing": "Concept",
    "instinctengineering": "Concept",
    "reputationtech": "Concept",
    "structuralthinking": "Concept",

    # テーマ / ドメイン
    "ai_agent": "AI",
    "ai-agent": "AI",
    "ai agent": "AI",
    "agent": "AI",
    "ai": "AI",
    "llm": "AI",
    "agi": "AI",
    "saas_trend": "SaaS",
    "saas": "SaaS",
    "microsaas": "SaaS",
    "verticalsaas": "SaaS",
    "service-as-a-software": "SaaS",
    "electronicsignature": "SaaS",
    "mobileapp": "MobileApp",
    "healthcare": "DeepTech",
    "spacetech": "DeepTech",
    "climatetech": "DeepTech",
    "fintech": "DeepTech",
    "deeptech": "DeepTech",

    # 戦略 / 実行フェーズ
    "strategy": "Strategy",
    "pricingstrategy": "Monetization",
    "monetization": "Monetization",
    "buildvsbuy": "Strategy",
    "portfoliostrategy": "Strategy",
    "productstrategy": "Strategy",
    "businessmodel": "Strategy",
    "gtm": "GTM",
    "seo": "GTM",
    "aso": "GTM",
    "marketing": "GTM",
    "partnership": "GTM",
    "distributionfirst": "GTM",
    "videopodcast": "GTM",
    "ltd": "GTM",
    "productdesign": "Product",
    "ux": "Product",
    "api design": "Product",
    "automation": "Product",
    "techstack": "TechStack",
    "edge-computing": "TechStack",
    "devtools": "TechStack",
    "graphdb": "TechStack",
    "futuretech": "TechStack",
    "openclaw": "TechStack",
    "series b": "Strategy", # Or potentially funded... we will use Strategy or Exit
    "bootstrap": "Bootstrapped",
    "bootstrapped": "Bootstrapped",
    "exit": "Exit",
    "buildinpublic": "BuildInPublic",
}

def map_tags(old_tags):
    new_tags_set = set()
    for t in old_tags:
        clean_tag = t.strip('"\', ').lower()
        if clean_tag in TAG_MAPPING:
            new_tags_set.add(TAG_MAPPING[clean_tag])
        else:
            # マッピングにない場合は残すが、後で手動確認が必要かもしれない
            pass 

    new_tags_list = list(new_tags_set)

    # 既存のロジックを壊さないために、"FailureCase", "Concept", "SuccessCase" を最優先で先頭に配置
    ordered_tags = []
    
    # Priority 1: 記事の性質 (Category Type deciding tags)
    if "FailureCase" in new_tags_list:
        ordered_tags.append("FailureCase")
        new_tags_list.remove("FailureCase")
    elif "Concept" in new_tags_list:
        ordered_tags.append("Concept")
        new_tags_list.remove("Concept")
    elif "SuccessCase" in new_tags_list:
        ordered_tags.append("SuccessCase")
        new_tags_list.remove("SuccessCase")
    else:
        # もし上記のいずれもなければ、既存タグから推測するか、デフォルトで SuccessCase を追加
        ordered_tags.append("SuccessCase")

    # Priority 2: その他のカテゴリ
    # 特定の順番にソートして一貫性を持たせる
    domain_tags = ["AI", "SaaS", "MobileApp", "DeepTech"]
    strategy_tags = ["Strategy", "GTM", "Product", "TechStack", "Monetization", "Bootstrapped", "Exit", "BuildInPublic"]

    for dt in domain_tags:
        if dt in new_tags_list:
            ordered_tags.append(dt)
            new_tags_list.remove(dt)
            
    for st in strategy_tags:
        if st in new_tags_list:
            ordered_tags.append(st)
            new_tags_list.remove(st)

    # 残りのタグ（もしあれば）
    ordered_tags.extend(new_tags_list)
    
    # 最大4つまでに絞る（オプション）
    # return ordered_tags[:4]
    return ordered_tags

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the tags line in frontmatter
    # e.g., tags: ["Concept", "AI Agent"]
    pattern = re.compile(r'^(tags:\s*\[)(.*?)(\])', re.MULTILINE)
    match = pattern.search(content)

    if match:
        old_tags_str = match.group(2)
        old_tags = [t.strip().strip('"\'') for t in old_tags_str.split(',')]
        new_tags = map_tags(old_tags)
        
        # Format the new tags array
        new_tags_str = ', '.join([f'"{t}"' for t in new_tags])
        new_line = f"tags: [{new_tags_str}]"
        
        new_content = content[:match.start()] + new_line + content[match.end():]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {os.path.basename(file_path)} | {old_tags} -> {new_tags}")
    else:
        print(f"No tags found in: {os.path.basename(file_path)}")

def main():
    for filename in os.listdir(POSTS_DIR):
        if filename.endswith(".md") or filename.endswith(".mdx"):
            process_file(os.path.join(POSTS_DIR, filename))

if __name__ == "__main__":
    main()
