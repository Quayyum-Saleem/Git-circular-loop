"""
Environmental Impact Service
Calculates diverted waste (kg) and avoided CO2 emissions (kg CO2e)
using documented category averages and circular economy emissions factors.
"""

from typing import Dict, Any

# Average item weights in kilograms by category (based on circular material balance studies)
CATEGORY_WEIGHT_KG = {
    "Electronics": 3.2,
    "Books and educational materials": 0.9,
    "Furniture": 17.5,
    "Clothing and accessories": 1.1,
    "Home appliances": 8.5,
    "Household items": 2.2,
    "Sports and recreation": 3.8,
    "Other": 2.0
}

# Emission factors (kg CO2e saved per kg diverted via circular pathways)
# Sources: EPA WARM (Waste Reduction Model), DEFRA UK GHG conversion factors, and Circularity Gap reports.
# Reusing or repairing avoids 100% of the replacement manufacturing footprint minus minor refurbishment energy.
CO2_FACTOR_PER_KG = {
    "Electronics": 15.4,          # High embodied carbon from silicon & precision metals
    "Books and educational materials": 1.8, # Paper pulping and transport footprint
    "Furniture": 3.2,            # Timber processing and upholstery manufacturing
    "Clothing and accessories": 9.5, # Textile spinning, dyeing, and supply chain emissions
    "Home appliances": 6.8,      # Steel, copper motors, and manufacturing
    "Household items": 3.1,      # Plastics, ceramics, metal components
    "Sports and recreation": 4.5,# Composites, polymers, and logistics
    "Other": 3.0
}

# Pathway efficiency multipliers
# Reuse & Repair preserve the highest embodied value (90-95%)
# Donation retains 85%
# Recycling recovers raw materials without preserving product form (40-60%)
PATHWAY_MULTIPLIER = {
    "reuse": 0.95,
    "Sell for reuse": 0.95,
    "Give away": 0.95,
    "repair": 0.90,
    "Request repair": 0.90,
    "donation": 0.85,
    "Donate": 0.85,
    "recycling": 0.50,
    "Responsible recycling": 0.50
}

def calculate_item_impact(category: str, purpose_or_type: str) -> Dict[str, float]:
    weight = CATEGORY_WEIGHT_KG.get(category, 2.0)
    co2_base_factor = CO2_FACTOR_PER_KG.get(category, 3.0)
    multiplier = PATHWAY_MULTIPLIER.get(purpose_or_type, 0.85)

    diverted_waste_kg = round(weight, 2)
    co2_avoided_kg = round(weight * co2_base_factor * multiplier, 2)

    return {
        "weight_kg": diverted_waste_kg,
        "co2_avoided_kg": co2_avoided_kg
    }

def get_methodology_meta() -> Dict[str, Any]:
    return {
        "framework": "Circular Material Flow & EPA WARM / DEFRA Hybrid Factor Model",
        "description": "Calculates direct landfill diversion (kg) and life-cycle avoided carbon emissions (kg CO2e) achieved by extending product life cycles rather than virgin manufacturing and incineration/landfilling.",
        "category_assumptions": [
            {"category": k, "avg_weight_kg": v, "embodied_co2_factor": CO2_FACTOR_PER_KG[k]}
            for k, v in CATEGORY_WEIGHT_KG.items()
        ],
        "pathway_hierarchy": {
            "Reuse / Direct Transfer": "Preserves 95% of embodied manufacturing energy and eliminates packaging.",
            "Repair & Refurbishment": "Preserves 90% of product utility with negligible repair energy overhead.",
            "Donation to Community": "Preserves 85% of utility considering minor redistribution transport.",
            "Responsible Recycling": "Recovers 50% of raw material value; avoids virgin ore/oil extraction."
        },
        "disclaimer": "Metrics are empirical engineering estimates for demonstration and campus sustainability tracking. Unverified transactions are not counted towards verified carbon offsets."
    }
