from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import RepairProvider
from app.schemas.schemas import RepairGuide, RepairProviderResponse, RepairTroubleshootStep
from app.services.matching import haversine_distance_km

router = APIRouter(prefix="/repair", tags=["Repair Assistant"])

# Catalog of verified circular troubleshooting guides
REPAIR_GUIDES = {
    ("Electronics", "battery"): RepairGuide(
        category="Electronics",
        problem_type="battery",
        difficulty="Moderate",
        diy_suitable=True,
        estimated_cost_savings="$60 - $120 vs new device",
        environmental_benefit="Saves ~15 kg CO2e and keeps lithium cells out of general waste",
        troubleshooting_steps=[
            RepairTroubleshootStep(
                step_number=1,
                title="Inspect Charging Port & Cable",
                instruction="Use an anti-static brush or wooden toothpick to clean lint out of the USB-C or charging port.",
                caution="Never use metal needles or conductive pins inside electrical ports."
            ),
            RepairTroubleshootStep(
                step_number=2,
                title="Perform Battery Calibration Cycle",
                instruction="Charge the device to 100%, keep it plugged in for 1 hour, discharge to 5%, and recharge uninterrupted."
            ),
            RepairTroubleshootStep(
                step_number=3,
                title="Check Battery Health Metric",
                instruction="Navigate to System Settings -> Battery -> Health. If maximum capacity is below 70%, replacement is recommended."
            ),
            RepairTroubleshootStep(
                step_number=4,
                title="Modular Battery Swapping",
                instruction="Many modern laptops and gadgets feature modular screw-fastened batteries available online for $35."
            )
        ],
        disposal_recommendation="Take old battery to a certified e-waste or retail battery drop box (e.g., Best Buy, campus depot)."
    ),
    ("Electronics", "screen"): RepairGuide(
        category="Electronics",
        problem_type="screen",
        difficulty="Advanced / Professional",
        diy_suitable=False,
        estimated_cost_savings="$150 - $300 vs new device",
        environmental_benefit="Diverts complex display glass and rare-earth components",
        troubleshooting_steps=[
            RepairTroubleshootStep(
                step_number=1,
                title="Test with External Display",
                instruction="Plug your laptop into an external HDMI/USB-C monitor to determine if the GPU/motherboard is intact."
            ),
            RepairTroubleshootStep(
                step_number=2,
                title="Check Display Cable Seating",
                instruction="Flickering displays are frequently caused by loose LVDS/eDP ribbon cables at the hinge."
            ),
            RepairTroubleshootStep(
                step_number=3,
                title="Consult Local Repair Specialist",
                instruction="Screen panel replacement requires heat guns and digitizer adhesive. We recommend our campus repair clinic."
            )
        ],
        disposal_recommendation="Do not throw in household bins. If unusable, disassemble for certified electronics recycling."
    ),
    ("Furniture", "wobbly"): RepairGuide(
        category="Furniture",
        problem_type="wobbly",
        difficulty="Easy",
        diy_suitable=True,
        estimated_cost_savings="$50 - $150 vs replacement furniture",
        environmental_benefit="Prevents ~18 kg timber & steel landfill disposal",
        troubleshooting_steps=[
            RepairTroubleshootStep(
                step_number=1,
                title="Identify Loose Joinery",
                instruction="Turn the chair/table upside down on a soft rug and check each leg socket and crossbar."
            ),
            RepairTroubleshootStep(
                step_number=2,
                title="Tighten Hex Bolts & Screws",
                instruction="Use an Allen wrench or Phillips screwdriver to tighten all fasteners progressively in an X-pattern."
            ),
            RepairTroubleshootStep(
                step_number=3,
                title="Apply Wood Glue / Threadlocker",
                instruction="For wooden dowels, apply PVA wood glue and clamp for 4 hours. For metal bolts, apply blue threadlocker."
            ),
            RepairTroubleshootStep(
                step_number=4,
                title="Add Felt Leveling Pads",
                instruction="Attach self-adhesive silicone or felt floor pads to uneven legs to stabilize contact."
            )
        ],
        disposal_recommendation="If structural timber has split beyond repair, list as 'Free for Upcycling / Woodcraft'."
    ),
    ("Home appliances", "motor"): RepairGuide(
        category="Home appliances",
        problem_type="motor",
        difficulty="Moderate",
        diy_suitable=True,
        estimated_cost_savings="$40 - $90 vs new appliance",
        environmental_benefit="Saves ~8 kg copper and metal casing scrap",
        troubleshooting_steps=[
            RepairTroubleshootStep(
                step_number=1,
                title="Disconnect From Power",
                instruction="Always unplug the appliance completely and wait 5 minutes before touching internal components.",
                caution="High voltage warning! Never attempt motor work with power connected."
            ),
            RepairTroubleshootStep(
                step_number=2,
                title="Check for Mechanical Jamming",
                instruction="Ensure blades or rotors spin freely by hand. Remove tangled hair, strings, or food residue."
            ),
            RepairTroubleshootStep(
                step_number=3,
                title="Reset Thermal Fuse",
                instruction="Many blenders and vacuums have a red reset button on the base that trips during overheating."
            )
        ],
        disposal_recommendation="Recycle copper motor and stainless chassis at local municipal e-waste drive."
    ),
    ("Clothing and accessories", "zipper"): RepairGuide(
        category="Clothing and accessories",
        problem_type="zipper",
        difficulty="Easy",
        diy_suitable=True,
        estimated_cost_savings="$30 - $80 vs new jacket",
        environmental_benefit="Saves ~10 kg CO2e and prevents microplastic textile waste",
        troubleshooting_steps=[
            RepairTroubleshootStep(
                step_number=1,
                title="Lubricate Zipper Teeth",
                instruction="Rub a graphite pencil lead, beeswax, or lip balm along both sides of the stuck teeth."
            ),
            RepairTroubleshootStep(
                step_number=2,
                title="Tighten Slider Jaws",
                instruction="If the zipper separates behind the slider, gently squeeze the slider jaws with small pliers."
            ),
            RepairTroubleshootStep(
                step_number=3,
                title="Replace Slider Head",
                instruction="Universal clip-on zipper pull replacements cost less than $3 and install in 30 seconds."
            )
        ],
        disposal_recommendation="If fabric is worn out, donate to textile recycling drop boxes for insulation fiber."
    )
}

DEFAULT_GUIDE = RepairGuide(
    category="General",
    problem_type="general",
    difficulty="Easy to Moderate",
    diy_suitable=True,
    estimated_cost_savings="$25 - $100 vs buying new",
    environmental_benefit="Extends useful lifespan and reduces raw material extraction",
    troubleshooting_steps=[
        RepairTroubleshootStep(
            step_number=1,
            title="Clean & Inspect Thoroughly",
            instruction="Disassemble non-critical covers and clean dust, residue, or oxidation using isopropyl alcohol."
        ),
        RepairTroubleshootStep(
            step_number=2,
            title="Search Specific Model Manual / iFixit",
            instruction="Look up the specific model number on iFixit.com or YouTube for teardown instructions."
        ),
        RepairTroubleshootStep(
            step_number=3,
            title="Bring to Campus Repair Café",
            instruction="Attend our monthly community repair meetup where volunteer mentors provide tools and guidance."
        )
    ],
    disposal_recommendation="Use CircularLoop to list for repair enthusiasts or responsible community recycling."
)

@router.get("/guide", response_model=RepairGuide)
def get_repair_guide(category: str, problem_type: str = "general"):
    for (cat, prob), guide in REPAIR_GUIDES.items():
        if cat.lower() == category.lower() and prob.lower() in problem_type.lower():
            return guide
    # Match category only if possible
    for (cat, prob), guide in REPAIR_GUIDES.items():
        if cat.lower() == category.lower():
            return guide
    return DEFAULT_GUIDE

@router.get("/providers", response_model=List[RepairProviderResponse])
def get_repair_providers(
    category: Optional[str] = None,
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(RepairProvider)
    if category and category.lower() != "all":
        query = query.filter(RepairProvider.category.ilike(f"%{category}%"))

    providers = query.all()
    if user_lat is not None and user_lon is not None:
        providers = sorted(
            providers,
            key=lambda p: haversine_distance_km(user_lat, user_lon, p.latitude, p.longitude)
        )
    return providers
