"""
Brand Validation Script for Amazon
Validates content against Amazon brand guidelines.
"""

import re
from typing import List, Tuple
from dataclasses import dataclass


@dataclass
class BrandGuidelines:
    """Amazon brand guidelines configuration"""
    brand_name: str
    primary_colors: List[str]
    secondary_colors: List[str]
    fonts: List[str]
    tone_keywords: List[str]
    prohibited_words: List[str]


@dataclass
class ValidationResult:
    """Result of brand validation"""
    passed: bool
    score: float
    violations: List[str]
    warnings: List[str]
    suggestions: List[str]


class BrandValidator:
    """Validates content against Amazon brand guidelines"""

    def __init__(self, guidelines: BrandGuidelines):
        self.guidelines = guidelines

    def validate_colors(self, content: str) -> Tuple[List[str], List[str]]:
        """Validate color usage in content."""
        violations = []
        warnings = []

        hex_pattern = r'#[0-9A-Fa-f]{6}'
        found_colors = re.findall(hex_pattern, content)

        approved_colors = self.guidelines.primary_colors + self.guidelines.secondary_colors

        for color in found_colors:
            if color.upper() not in [c.upper() for c in approved_colors]:
                violations.append(f"Unapproved color used: {color}")

        return violations, warnings

    def validate_fonts(self, content: str) -> Tuple[List[str], List[str]]:
        """Validate font usage in content."""
        violations = []
        warnings = []

        font_pattern = r'font-family\s*:\s*["\']?([^;"\']+)["\']?'
        found_fonts = re.findall(font_pattern, content, re.IGNORECASE)

        for font in found_fonts:
            if not any(approved.lower() in font.lower() for approved in self.guidelines.fonts):
                violations.append(f"Unapproved font used: {font}")

        return violations, warnings

    def validate_tone(self, content: str) -> Tuple[List[str], List[str]]:
        """Validate tone and messaging."""
        violations = []
        warnings = []

        content_lower = content.lower()
        for word in self.guidelines.prohibited_words:
            if word.lower() in content_lower:
                violations.append(f"Prohibited word used: '{word}'")

        tone_matches = sum(1 for keyword in self.guidelines.tone_keywords
                          if keyword.lower() in content_lower)

        if tone_matches == 0 and len(content) > 100:
            warnings.append(
                f"Consider using Amazon tone keywords: {', '.join(self.guidelines.tone_keywords[:3])}"
            )

        return violations, warnings

    def validate_brand_name(self, content: str) -> Tuple[List[str], List[str]]:
        """Validate brand name usage."""
        violations = []
        warnings = []

        brand_pattern = re.compile(re.escape(self.guidelines.brand_name), re.IGNORECASE)
        matches = brand_pattern.findall(content)

        for match in matches:
            if match != self.guidelines.brand_name:
                violations.append(f"Incorrect brand name: '{match}' should be '{self.guidelines.brand_name}'")

        return violations, warnings

    def calculate_score(self, violations: List[str], warnings: List[str]) -> float:
        """Calculate compliance score (0-100)"""
        violation_penalty = len(violations) * 10
        warning_penalty = len(warnings) * 3
        return max(0, 100 - violation_penalty - warning_penalty)

    def validate(self, content: str) -> ValidationResult:
        """Perform complete brand validation."""
        all_violations = []
        all_warnings = []

        color_v, color_w = self.validate_colors(content)
        all_violations.extend(color_v)
        all_warnings.extend(color_w)

        font_v, font_w = self.validate_fonts(content)
        all_violations.extend(font_v)
        all_warnings.extend(font_w)

        tone_v, tone_w = self.validate_tone(content)
        all_violations.extend(tone_v)
        all_warnings.extend(tone_w)

        brand_v, brand_w = self.validate_brand_name(content)
        all_violations.extend(brand_v)
        all_warnings.extend(brand_w)

        score = self.calculate_score(all_violations, all_warnings)
        suggestions = [
            f"Use approved colors: {', '.join(self.guidelines.primary_colors)}",
            f"Use approved fonts: {', '.join(self.guidelines.fonts)}",
        ]

        return ValidationResult(
            passed=len(all_violations) == 0,
            score=score,
            violations=all_violations,
            warnings=all_warnings,
            suggestions=suggestions
        )


def get_amazon_brand_guidelines() -> BrandGuidelines:
    """Get Amazon brand guidelines."""
    return BrandGuidelines(
        brand_name="Amazon",
        primary_colors=["#FF9900", "#232F3E", "#FFFFFF"],
        secondary_colors=["#28A745", "#FFC107", "#DC3545", "#6C757D"],
        fonts=["Segoe UI", "system-ui", "-apple-system", "sans-serif"],
        tone_keywords=["customer obsession", "innovation", "operational excellence"],
        prohibited_words=["cheap", "inferior", "outdated"]
    )
