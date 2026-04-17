"""
Brand application module for Amazon corporate document styling.
Applies consistent branding to Excel, PowerPoint, and PDF documents.
"""

from typing import Dict, Any, List


class BrandFormatter:
    """Apply Amazon brand guidelines to documents."""

    # Amazon brand color definitions
    COLORS = {
        "primary": {
            "amazon_orange": {"hex": "#FF9900", "rgb": (255, 153, 0)},
            "amazon_black": {"hex": "#232F3E", "rgb": (35, 47, 62)},
            "white": {"hex": "#FFFFFF", "rgb": (255, 255, 255)},
        },
        "secondary": {
            "success_green": {"hex": "#28A745", "rgb": (40, 167, 69)},
            "warning_amber": {"hex": "#FFC107", "rgb": (255, 193, 7)},
            "error_red": {"hex": "#DC3545", "rgb": (220, 53, 69)},
            "neutral_gray": {"hex": "#6C757D", "rgb": (108, 117, 125)},
            "light_gray": {"hex": "#F8F9FA", "rgb": (248, 249, 250)},
        },
    }

    # Font definitions
    FONTS = {
        "primary": "Segoe UI",
        "fallback": ["system-ui", "-apple-system", "sans-serif"],
        "sizes": {"h1": 32, "h2": 24, "h3": 18, "body": 11, "caption": 9},
        "weights": {"regular": 400, "semibold": 600, "bold": 700},
    }

    # Company information
    COMPANY = {
        "name": "Amazon",
        "tagline": "Work Hard. Have Fun. Make History.",
        "copyright": "© 2025 Amazon. All rights reserved.",
        "website": "www.amazon.com",
        "logo_path": "assets/amazon_logo.png",
    }

    def __init__(self):
        """Initialize brand formatter with standard settings."""
        self.colors = self.COLORS
        self.fonts = self.FONTS
        self.company = self.COMPANY

    def format_excel(self, workbook_config: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Amazon brand formatting to Excel workbook."""
        branded_config = workbook_config.copy()

        branded_config["header_style"] = {
            "font": {
                "name": self.fonts["primary"],
                "size": self.fonts["sizes"]["body"],
                "bold": True,
                "color": self.colors["primary"]["white"]["hex"],
            },
            "fill": {"type": "solid", "color": self.colors["primary"]["amazon_black"]["hex"]},
            "alignment": {"horizontal": "center", "vertical": "center"},
        }

        branded_config["chart_colors"] = [
            self.colors["primary"]["amazon_orange"]["hex"],
            self.colors["secondary"]["success_green"]["hex"],
            self.colors["secondary"]["warning_amber"]["hex"],
        ]

        return branded_config

    def format_powerpoint(self, presentation_config: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Amazon brand formatting to PowerPoint presentation."""
        branded_config = presentation_config.copy()

        branded_config["master"] = {
            "background_color": self.colors["primary"]["white"]["hex"],
            "title_area": {
                "font": self.fonts["primary"],
                "size": self.fonts["sizes"]["h1"],
                "color": self.colors["primary"]["amazon_black"]["hex"],
                "bold": True,
            },
        }

        branded_config["charts"] = {
            "color_scheme": [
                self.colors["primary"]["amazon_orange"]["hex"],
                self.colors["secondary"]["success_green"]["hex"],
            ],
        }

        return branded_config

    def format_pdf(self, document_config: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Amazon brand formatting to PDF document."""
        branded_config = document_config.copy()

        branded_config["styles"] = {
            "heading1": {
                "font": self.fonts["primary"],
                "size": self.fonts["sizes"]["h1"],
                "color": self.colors["primary"]["amazon_orange"]["hex"],
                "bold": True,
            },
            "body": {
                "font": self.fonts["primary"],
                "size": self.fonts["sizes"]["body"],
                "color": self.colors["primary"]["amazon_black"]["hex"],
            },
        }

        return branded_config


def apply_brand_to_document(document_type: str, config: Dict[str, Any]) -> Dict[str, Any]:
    """Apply Amazon branding to any document type."""
    formatter = BrandFormatter()

    if document_type.lower() == "excel":
        return formatter.format_excel(config)
    elif document_type.lower() in ["powerpoint", "pptx"]:
        return formatter.format_powerpoint(config)
    elif document_type.lower() == "pdf":
        return formatter.format_pdf(config)
    else:
        raise ValueError(f"Unsupported document type: {document_type}")
