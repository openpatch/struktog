# Struktogrammeditor

Freies offenes Webprogramm zur Erstellung von Struktogrammen sowie zur Umwandlung dessen in Code (Python, PHP, Javascript).
Online nutzbar unter [https://dditools.inf.tu-dresden.de/struktog/](https://dditools.inf.tu-dresden.de/struktog/) oder als [Download](#download) einfach die index.html öffnen.
Freie Software lebt von [Mitarbeit](#entwicklung). Gerne Kontakt aufnehmen und mithelfen.

## Konfiguration
Der Editor kann über verschiedene URL-Parameter angepasst werden. Dabei ist es möglich die Konfiguration zu ändern, um z.B. verschiedene Elemente auszublenden oder schon vorgefertigte Templates für Aufgaben geladen werden.

### Beispiel Konfiguration
Für Python:

```bash
{domain}/?config=python
```
### Beispiel Templates
Aufgaben können über Templates geladen werden:

```bash
{domain}/?template=1
```

# Download
- [Last-Build](https://dditools.inf.tu-dresden.de/releases/struktog/struktog-latest.tar.gz)
- [Last-Release](https://dditools.inf.tu-dresden.de/releases/struktog/struktog-v.1.1.2.tar.gz)

# Contributors
Klaus Ramm,
Thiemo Leonhardt

# Lizenz
MIT

# Entwicklung
Die Entwicklung basiert auf den Paketen aus npm mit yarn und läuft momentan auf NodeJS Fermium.

## Installation
```bash
yarn
```

## Development
Startet einen lokalen Webserver und aktualisiert Inhalte während der Entwicklung.

```bash
yarn run watch
```

## Deployment
Der fertige Build wird in dem Unterordner './build ' abgelegt.

```bash
yarn run build
```
