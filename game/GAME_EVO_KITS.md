# Wire the half-finished evolution kits (Hiro 2026-06-21) — src/combat/pit.js

The evolution branches advertise combat effects in their `kit:` text but several only grant the generic +6
stat focus (evoStatBonus) + a recolor. Wire the ADVERTISED effects, gated on the evo key, so un-evolved / other-
road characters stay byte-identical. Reuse existing systems (dotDamage/hex DoT, summon helpers, ward/chains,
the bone-dragon/lich pipeline). Ship through the gate; add a regression case per kit (assert the buff is active
when the key is set and absent otherwise).

## SERAPH (lv10 wrath/aegis ; lv20 judgement/bulwark) — EVOLUTIONS ~L121-135; effects today only in draw
- wrath  (ATK): halo ray hits harder + smite/judgement intensified. Gate P.evo10==='wrath' on the halo-ray
  damage and the smite/judgement effect (bump damage/AoE).
- aegis  (CON): grace ward LINGERS longer + chains of decree BIND. Gate on P.evo10==='aegis': extend the grace
  ward duration and make chains of decree root/bind enemies.
- judgement (from wrath): the smite ray REACHES FURTHER + halo judgement widened. Gate P.evo20==='judgement'.
- bulwark   (from aegis): grace deepened + chains bind ALL nearby. Gate P.evo20==='bulwark'.
(Find the seraph ability fns: halo ray / smite / ascend / grace ward / chains of decree. Apply per-key buffs.)

## DRUID (lv10 alpha/sovereign) — kit promises "claws cause bleed" (~L91,L99) but no bleed mechanic exists
- Add a BLEED DoT (new fields bleedT/bleedDmg/bleedTick) ticking via dotDamage (red #c0392b), applied by WOLF-
  form claw/bite when P.evo10==='alpha' (and deepened for evo20==='sovereign'). Mirror the hex DoT tick.
- Gate the pack size on the road: howl currently always summons 5 (~L490). For alpha: "howl summons an extra
  wolf"; for sovereign (lv20): "a 3-wolf pack". Make the base (non-alpha) summon fewer so the road is a real
  difference (e.g. base howl +0/+1, alpha +1, sovereign full pack). Keep it gated so non-alpha druids unchanged.

## WARLOCK lv20 capstones (binder->lichlord ; herald->archfiend) — currently cosmetic-only (halo color ~L3123)
- lichlord (P.evo20==='lichlord'): "lich uptime extended; raises extra undead". Extend lich duration / the
  phylactery window and have the lich raise additional undead (more zombies/archers per channel).
- archfiend (P.evo20==='archfiend'): "arch-devil duration extended; hellfire wider". Extend devil/Demon-Lord
  timer further and widen the hellfire/Sheol AoE. (Note: the binder/herald LV10 effects already shipped; this
  is the LV20 layer keyed on P.evo20.)

## QA / SHIP
node --check; run `python3 tools/safe_publish.py --check-only` (add regression cases asserting each kit's effect
is gated on its key). For each kit: a headless case that sets the evo key and asserts the buff field/behavior is
present, and absent when unset. Then `python3 tools/safe_publish.py /sessions/<id>/mnt/Neverendingnarratives`.
Verify other roads/champions unchanged. 5-Whys any surprise. STATUS + disable when done.
