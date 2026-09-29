# backend/rules.py
from typing import Any, Dict, List, Tuple, Union

Number = Union[int, float]

def _get(village: Dict[str, Any], field: str) -> Any:
    # Nested fields support "a.b.c" if you ever need it later
    cur = village
    for part in field.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur

def _compare(left: Any, op: str, right: Any) -> bool:
    if op == "==": return left == right
    if op == "!=": return left != right
    if op == ">":  return (left is not None) and (right is not None) and (left > right)
    if op == ">=": return (left is not None) and (right is not None) and (left >= right)
    if op == "<":  return (left is not None) and (right is not None) and (left < right)
    if op == "<=": return (left is not None) and (right is not None) and (left <= right)
    if op == "in":
        if isinstance(right, list): return left in right
        # small convenience: if right is a string like "Low|Very Low", split
        if isinstance(right, str) and "|" in right:
            return str(left) in right.split("|")
        return False
    raise ValueError(f"Unsupported operator: {op}")

def _applies_if_ok(village: Dict[str, Any], applies_if: Dict[str, Any]) -> bool:
    # applies_if has same shape as a condition: {"field","op","value"}
    if not applies_if:
        return True
    field = applies_if.get("field")
    op    = applies_if.get("op")
    val   = applies_if.get("value")
    return _compare(_get(village, field), op, val)

def evaluate_scheme_for_village(
    village: Dict[str, Any],
    scheme: Dict[str, Any]
) -> Tuple[bool, List[Dict[str, Any]]]:
    """
    Returns (eligible, matched_conditions_detail[])
    matched_conditions_detail[] = [
        {field, op, value, village_value, matched: bool, skipped_by_applies_if: bool}
    ]
    """
    # optional: target_states gate
    target_states = scheme.get("target_states")
    if target_states and village.get("state") not in target_states:
        return (False, [{"field": "state", "op": "in", "value": target_states, "village_value": village.get("state"),
                         "matched": False, "skipped_by_applies_if": False}])

    rule = scheme.get("eligibility", {})
    logic = rule.get("logic", "any")
    conditions = rule.get("conditions", [])

    details = []
    matches = []

    for cond in conditions:
        applies_if = cond.get("applies_if")
        if applies_if and not _applies_if_ok(village, applies_if):
            details.append({
                "field": cond.get("field"),
                "op": cond.get("op"),
                "value": cond.get("value"),
                "village_value": _get(village, cond.get("field")),
                "matched": True,  # treat as non-blocking (skipped) so it doesn't fail
                "skipped_by_applies_if": True
            })
            matches.append(True)
            continue

        field = cond.get("field")
        op    = cond.get("op")
        val   = cond.get("value")
        vv    = _get(village, field)
        ok    = _compare(vv, op, val)

        details.append({
            "field": field, "op": op, "value": val,
            "village_value": vv, "matched": ok, "skipped_by_applies_if": False
        })
        matches.append(ok)

    eligible = any(matches) if logic == "any" else all(matches) if logic == "all" else any(matches)
    return (eligible, details)
