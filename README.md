## PWA for cleaning (not testing) fuel injectors

### WebSocket protocol

#### Ping
```json
{ "type": "system.ping", "id": 123 }
```
```json
{ "type": "system.pong", "id": 123 }
``` 

#### Pump control
```json
{ "type": "pump.set", "on": true, "cutoff": 3800 }
```
```json
{ "type": "pump.status", "on": false, "cutoff": 3800, "pressure": 3752 }
```

#### Injector control
```json
{ "type": "inj.status", "running": true, "delay": 10, "pulse": 10 }
```
```json
{ "type": "inj.set", "delay": 10, "pulse": 10 }
```
```json
{ "type": "inj.open", "pattern": [1, 2, 3, 4], "repeat": 0 }
```
```json
{ "type": "inj.stop" }
```