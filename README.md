## PWA for cleaning (not testing) fuel injectors
### WebSocket protocol

---

### 1) System ping

**Client → Server**
```json
{ "type": "system.ping", "id": 123 }
```

**Server → Client**
```json
{ "type": "system.pong", "id": 123 }
```

---

### 2) Pump (топливный насос)

**Client → Server — задать состояние**
```json
{ "type": "pump.set", "on": true, "cutoff": 3800 }
```
- `on` *(bool, optional, default=true)* — включить/выключить насос.
- `cutoff` *(int, optional)* — порог отключения (raw).

**Client → Server — запрос статуса**
```json
{ "type": "pump.status" }
```

**Server → Client — статус**
```json
{ "type": "pump.status", "on": false, "cutoff": 3800, "pressure": 3752 }
```
- `on` *(bool)* — текущее состояние насоса.
- `cutoff` *(int)* — активный порог (raw).
- `pressure` *(int)* — текущее давление (raw).

---

### 3) Injectors (форсунки)

**Client → Server — задать задержку и длительность импульса**
```json
{ "type": "inj.set", "delay": 10, "pulse": 10 }
```
- `delay` *(uint16 ms, optional)* — задержка.
- `pulse` *(uint16 ms, optional)* — длительность импульса.

**Client → Server — открыть паттерн**
```json
{ "type": "inj.open", "pattern": [1, 2, 3, 4], "repeat": 0 }
```
- `pattern` *(array<uint8>)* — последовательность инжекторов (макс. 32).
- `repeat` *(long, optional, default=0)* — число повторов.

**Client → Server — остановить паттерн**
```json
{ "type": "inj.stop" }
```

**Client → Server — запросить статус**
```json
{ "type": "inj.status" }
```

**Server → Client — статус**
```json
{ "type": "inj.status", "running": true, "delay": 10, "pulse": 10 }
```
- `running` *(bool)* — идёт ли выполнение паттерна.
- `delay` *(ms)* — активная задержка.
- `pulse` *(ms)* — активная длительность.

---

### 4) Timer (таймер)

**Client → Server — запустить**
```json
{ "type": "timer.start", "time": 10000 }
```
- `time` *(uint32 ms)* — длительность таймера.

**Client → Server — остановить**
```json
{ "type": "timer.stop" }
```

**Client → Server — запросить статус**
```json
{ "type": "timer.status" }
```

**Server → Client — статус**
```json
{ "type": "timer.status", "running": true, "remaining": 7250 }
```
- `running` *(bool)* — идёт ли отсчёт.
- `remaining` *(uint32 ms)* — оставшееся время.

