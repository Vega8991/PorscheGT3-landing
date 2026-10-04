#!/usr/bin/env bash
# Uso: SHOTS='[...]' scripts/run-shots.sh <w> <h> <tier> <prefix>
W=${1:-960}; H=${2:-540}; TIER=${3:-full}; PREFIX=${4:-s}
OUT=/tmp/claude-0/shots/$PREFIX; mkdir -p $OUT; rm -f $OUT/*.png
LOG=/tmp/claude-0/shots/$PREFIX.log
setsid nohup node scripts/shoot.mjs "http://localhost:4173/?tier=$TIER&debug&noscrub&nolag&skipintro" $W $H $OUT > $LOG 2>&1 < /dev/null &
for i in $(seq 1 110); do sleep 5; if grep -q overflowX $LOG || grep -q "Error" $LOG; then break; fi; done
tail -3 $LOG
python3 scripts/grid.py "$OUT/*.png" /tmp/claude-0/shots/$PREFIX.png 2 > /dev/null
