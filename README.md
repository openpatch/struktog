# Struktogrammeditor

Webprogramm zur Erstellung von Struktogrammen sowie zur Umwandlung dessen in Code (Python, PHP, Javascript)

# Konfiguration
Über URL-Parameter können einerseits verschiedene Konfigurationen und andererseits vorgefertigte Aufgaben geladen werden.
Für Python: config=python

```bash
{domain}/?config=python
```

Aufgaben können über Templates geladen werden.
```bash
{domain}/?template=1
```

# Download
https://dditools.inf.tu-dresden.de/releases/struktog/struktog-latest.tar.gz

# Installation
```bash
npm install
nvm use lts/erbium
```

# Deployment
```bash
npm run build
```

# Development
```bash
npm run watch
```
