# backend/routes/reports.py
import json
from collections import Counter, defaultdict
from datetime import datetime
from fastapi import APIRouter

router = APIRouter()

LOG_FILE = "activity_log.json"   # adjust path if needed

@router.get("/reports")
def get_reports():
    with open(LOG_FILE, "r") as f:
        logs = json.load(f)

    # 1) Daily counts
    daily = defaultdict(lambda: {"total": 0, "intruders": 0})
    for e in logs:
        date = datetime.fromisoformat(e["timestamp"]).date().isoformat()
        daily[date]["total"] += 1
        if e["type"] == "Intruder":
            daily[date]["intruders"] += 1

    daily_counts = [
        {"date": d, "total": vals["total"], "intruders": vals["intruders"]}
        for d, vals in sorted(daily.items())
    ]

    # 2) Top known people
    known = [e["name"] for e in logs if e["type"] == "Known"]
    top_people = [
        {"name": name, "count": cnt}
        for name, cnt in Counter(known).most_common(5)
    ]

    # 3) Intruder vs Known ratio
    total = len(logs)
    intruders = sum(1 for e in logs if e["type"] == "Intruder")
    intruder_ratio = [
        {"name": "Intruder", "value": intruders},
        {"name": "Known",     "value": total - intruders},
    ]

    # 4) Hourly heatmap
    hours = Counter(datetime.fromisoformat(e["timestamp"]).hour for e in logs)
    hourly_heatmap = [{"hour": h, "count": hours.get(h, 0)} for h in range(24)]

    # 5) Confidence histogram
    bins = defaultdict(int)
    for e in logs:
        b = int(e["confidence"] // 10) * 10
        label = f"{b}–{b+10}"
        bins[label] += 1
    confidence_histogram = [
        {"bin": b, "count": c}
        for b, c in sorted(bins.items(), key=lambda x: int(x[0].split("–")[0]))
    ]

    return {
        "daily_counts": daily_counts,
        "top_people": top_people,
        "intruder_ratio": intruder_ratio,
        "hourly_heatmap": hourly_heatmap,
        "confidence_histogram": confidence_histogram,
    }
