"""
Celestial Prediction Engine — Mirror Mirror on the Wall
Swiss Ephemeris Astronomical Calculator & Corpus Left / Right Synthesis
"""

import os
import re
import json
import random
import datetime
from pathlib import Path

try:
    # pyrefly: ignore [missing-import]
    import swisseph as swe
    HAS_SWISSEPH = True
except ImportError:
    HAS_SWISSEPH = False

# Astrological Zodiac Signs
ZODIAC_SIGNS = [
    {"name": "Aries", "symbol": "♈", "element": "Fire", "ruler": "Mars", "span": (0, 30)},
    {"name": "Taurus", "symbol": "♉", "element": "Earth", "ruler": "Venus", "span": (30, 60)},
    {"name": "Gemini", "symbol": "♊", "element": "Air", "ruler": "Mercury", "span": (60, 90)},
    {"name": "Cancer", "symbol": "♋", "element": "Water", "ruler": "Moon", "span": (90, 120)},
    {"name": "Leo", "symbol": "♌", "element": "Fire", "ruler": "Sun", "span": (120, 150)},
    {"name": "Virgo", "symbol": "♍", "element": "Earth", "ruler": "Mercury", "span": (150, 180)},
    {"name": "Libra", "symbol": "♎", "element": "Air", "ruler": "Venus", "span": (180, 210)},
    {"name": "Scorpio", "symbol": "♏", "element": "Water", "ruler": "Pluto", "span": (210, 240)},
    {"name": "Sagittarius", "symbol": "♐", "element": "Fire", "ruler": "Jupiter", "span": (240, 270)},
    {"name": "Capricorn", "symbol": "♑", "element": "Earth", "ruler": "Saturn", "span": (270, 300)},
    {"name": "Aquarius", "symbol": "♒", "element": "Air", "ruler": "Uranus", "span": (300, 330)},
    {"name": "Pisces", "symbol": "♓", "element": "Water", "ruler": "Neptune", "span": (330, 360)},
]

PLANET_NAMES = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]

PLANET_SYMBOLS = {
    "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂",
    "Jupiter": "♃", "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇"
}

ASPECTS = [
    {"name": "Conjunction", "angle": 0, "orb": 8.0, "symbol": "☌", "nature": "Harmonizing Union"},
    {"name": "Sextile", "angle": 60, "orb": 6.0, "symbol": "⚹", "nature": "Opportunity & Flow"},
    {"name": "Square", "angle": 90, "orb": 7.0, "symbol": "□", "nature": "Friction & Catalyst"},
    {"name": "Trine", "angle": 120, "orb": 8.0, "symbol": "△", "nature": "Grace & Mastery"},
    {"name": "Opposition", "angle": 180, "orb": 8.0, "symbol": "☍", "nature": "Polarity & Realization"},
]

HOUSES = [
    "1st House of Self & Presence", "2nd House of Values & Worth",
    "3rd House of Communication & Notes", "4th House of Roots & Sanctum",
    "5th House of Passion & Creation", "6th House of Routine & Discipline",
    "7th House of Encounter & Partnership", "8th House of Mystery & Transformation",
    "9th House of Horizons & Truth", "10th House of Ambition & Trajectory",
    "11th House of Alliances & Group Chats", "12th House of Intuition & Unspoken Thoughts"
]

class CelestialEngine:
    def __init__(self, base_dir=None):
        if base_dir is None:
            base_dir = Path(__file__).resolve().parent
        else:
            base_dir = Path(base_dir)

        self.base_dir = base_dir
        self.corpus_left = []
        self.corpus_right = []
        self.preamble = []
        self.load_corpora()

    def _parse_md_file(self, file_path):
        """Extract numbered entries and preamble from markdown corpus."""
        entries = []
        if not os.path.exists(file_path):
            print(f"[CelestialEngine] Warning: {file_path} not found.")
            return entries

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # Extract numbered lines like '1.	The chart says...' or '1\.	The chart says...'
        pattern = re.compile(r"(\d+)\s*\\?[\.\)]\s+(.+?)(?=(?:\n\s*\d+\s*\\?[\.\)]|\Z))", re.DOTALL)
        matches = pattern.findall(content)

        for num_str, text in matches:
            cleaned_text = " ".join(text.strip().split())
            if cleaned_text:
                entries.append({
                    "id": int(num_str),
                    "text": cleaned_text
                })

        return entries

    def load_corpora(self):
        """Load CORPUS -LEFT.md and CORPUS RIGHT.md from current and parent paths."""
        search_paths = [
            self.base_dir,
            self.base_dir.parent,
            self.base_dir / "web"
        ]

        left_file = None
        right_file = None

        for p in search_paths:
            candidate_left = p / "CORPUS -LEFT.md"
            if not candidate_left.exists():
                candidate_left = p / "CORPUS LEFT.md"
            if not left_file and candidate_left.exists():
                left_file = candidate_left

            candidate_right = p / "CORPUS RIGHT.md"
            if not candidate_right.exists():
                candidate_right = p / "CORPUS -RIGHT.md"
            if not right_file and candidate_right.exists():
                right_file = candidate_right

        if left_file:
            self.corpus_left = self._parse_md_file(left_file)
            print(f"[CelestialEngine] Loaded {len(self.corpus_left)} entries from CORPUS LEFT ({left_file.name})")

        if right_file:
            self.corpus_right = self._parse_md_file(right_file)
            print(f"[CelestialEngine] Loaded {len(self.corpus_right)} entries from CORPUS RIGHT ({right_file.name})")

        # Fallback if one is missing but the other contains full range (1-109)
        if not self.corpus_right and len(self.corpus_left) > 58:
            self.corpus_right = [item for item in self.corpus_left if item["id"] >= 59]
            self.corpus_left = [item for item in self.corpus_left if item["id"] < 59]
        elif not self.corpus_left and len(self.corpus_right) > 58:
            self.corpus_left = [item for item in self.corpus_right if item["id"] < 59]
            self.corpus_right = [item for item in self.corpus_right if item["id"] >= 59]

    def calculate_planets(self, dt=None):
        """Calculate real-time Swiss Ephemeris planetary coordinates."""
        if dt is None:
            dt = datetime.datetime.now()

        utc_dt = dt.astimezone(datetime.timezone.utc) if dt.tzinfo else dt - datetime.timedelta(hours=5, minutes=30)
        
        julian_day = 0.0
        if HAS_SWISSEPH:
            decimal_hour = utc_dt.hour + utc_dt.minute / 60.0 + (utc_dt.second + utc_dt.microsecond / 1e6) / 3600.0
            julian_day = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, decimal_hour, swe.GREG_CAL)

        planets_data = []
        for name in PLANET_NAMES:
            if HAS_SWISSEPH:
                try:
                    planet_const = getattr(swe, name.upper())
                    res, flag = swe.calc_ut(julian_day, planet_const)
                    longitude = res[0] % 360.0
                    latitude = res[1]
                    speed = res[3]
                    is_retrograde = speed < 0
                except Exception:
                    idx = PLANET_NAMES.index(name)
                    longitude = (idx * 36.0 + dt.hour * 15.0 + dt.minute * 0.25) % 360.0
                    latitude = 0.0
                    is_retrograde = False
            else:
                idx = PLANET_NAMES.index(name)
                longitude = (idx * 36.0 + dt.hour * 15.0 + dt.minute * 0.25) % 360.0
                latitude = 0.0
                is_retrograde = False

            sign_idx = int(longitude // 30) % 12
            deg_in_sign = longitude % 30.0
            zodiac_info = ZODIAC_SIGNS[sign_idx]

            planets_data.append({
                "name": name,
                "symbol": PLANET_SYMBOLS.get(name, "✧"),
                "longitude": round(longitude, 4),
                "latitude": round(latitude, 4),
                "sign": zodiac_info["name"],
                "sign_symbol": zodiac_info["symbol"],
                "element": zodiac_info["element"],
                "degrees_in_sign": round(deg_in_sign, 2),
                "formatted": f"{int(deg_in_sign)}° {zodiac_info['name']}",
                "is_retrograde": is_retrograde
            })

        # Calculate Active Aspects
        active_aspects = []
        for i in range(len(planets_data)):
            for j in range(i + 1, len(planets_data)):
                p1 = planets_data[i]
                p2 = planets_data[j]
                diff = abs(p1["longitude"] - p2["longitude"])
                diff = min(diff, 360.0 - diff)

                for aspect in ASPECTS:
                    orb = abs(diff - aspect["angle"])
                    if orb <= aspect["orb"]:
                        active_aspects.append({
                            "planet1": p1["name"],
                            "planet1_symbol": p1["symbol"],
                            "planet2": p2["name"],
                            "planet2_symbol": p2["symbol"],
                            "aspect": aspect["name"],
                            "symbol": aspect["symbol"],
                            "nature": aspect["nature"],
                            "exact_angle": round(diff, 2),
                            "orb": round(orb, 2),
                            "tag": f"{p1['name']} in {p1['sign']} {aspect['symbol']} {p2['name']} in {p2['sign']}"
                        })

        active_aspects.sort(key=lambda x: x["orb"])

        return {
            "timestamp": dt.strftime("%Y-%m-%dT%H:%M:%S"),
            "planets": planets_data,
            "major_aspects": active_aspects[:6]
        }

    def get_prediction(self, direction="left", dt=None):
        """
        Synthesizes an astronomical prediction by binding real-time Swiss Ephemeris
        coordinates with either CORPUS -LEFT.md or CORPUS RIGHT.md based on eye gaze.
        """
        if dt is None:
            dt = datetime.datetime.now()

        direction = direction.lower().strip()
        is_left = direction != "right"

        target_corpus = self.corpus_left if is_left else self.corpus_right
        if not target_corpus:
            target_corpus = self.corpus_left or self.corpus_right

        # Seed selection using exact timestamp
        time_seed = (dt.hour * 3600 + dt.minute * 60 + dt.second + (dt.microsecond // 1000))
        selected_entry = target_corpus[time_seed % len(target_corpus)] if target_corpus else {
            "id": 1,
            "text": "The pattern changes when you act directly instead of decoding punctuation."
        }

        # Calculate live celestial astronomy
        astronomy = self.calculate_planets(dt)
        top_aspect = astronomy["major_aspects"][0] if astronomy["major_aspects"] else {
            "planet1": "Mercury", "planet1_symbol": "☿",
            "planet2": "Jupiter", "planet2_symbol": "♃",
            "aspect": "Trine", "symbol": "△",
            "nature": "Grace & Insight", "orb": 1.2,
            "tag": "Mercury in Virgo △ Jupiter in Taurus"
        }

        # Determine house resonance
        house_idx = (dt.hour + (dt.minute // 5)) % 12
        active_house = HOUSES[house_idx]

        # Transit Headline
        p1 = top_aspect.get("planet1", "Sun")
        p2 = top_aspect.get("planet2", "Mercury")
        sym = top_aspect.get("symbol", "✧")
        transit_str = f"{p1} {sym} {p2} in your {active_house}"

        return {
            "direction": "left" if is_left else "right",
            "corpus_source": "CORPUS -LEFT.md" if is_left else "CORPUS RIGHT.md",
            "entry_id": selected_entry["id"],
            "prediction_text": selected_entry["text"],
            "transit": transit_str,
            "aspect_meta": top_aspect,
            "house": active_house,
            "timestamp": dt.strftime("%H:%M:%S"),
            "astronomy": astronomy
        }

if __name__ == "__main__":
    engine = CelestialEngine()
    print("\n--- TEST LEFT ---")
    print(json.dumps(engine.get_prediction("left"), indent=2))
    print("\n--- TEST RIGHT ---")
    print(json.dumps(engine.get_prediction("right"), indent=2))
