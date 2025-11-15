# Struktog.

Ein freier, webbasierter Struktogrammeditor zur Erstellung von Nassi-Shneiderman-Diagrammen mit automatischer Code-Generierung.

Dieses Projekt ist ein Fork des ursprünglichen Struktogrammeditors der TU Dresden. Es wird aktiv weiterentwickelt und um neue Features erweitert.

## Features

- 🎨 Intuitive grafische Oberfläche zur Erstellung von Struktogrammen
- 🔄 Code-Generierung für Python, Python ab v3.10, PHP, Java, C#, C++ und C
- 💾 Export als PNG-Bild oder PDF
- 🔗 Teilen von Diagrammen über URL (Zustand wird in URL-Parametern gespeichert)
- 📦 Kann lokal ohne Server genutzt werden
- 🎯 Konfigurierbare Element-Auswahl für verschiedene Einsatzszenarien

## Verwendung

### Online-Nutzung
Das Tool kann direkt im Browser verwendet werden, ohne Installation.

### Lokale Nutzung
1. Lade die neueste Version herunter (siehe [Download](#download))
2. Entpacke die ZIP-Datei
3. Öffne die `index.html` Datei in einem modernen Webbrowser

## Konfiguration

Der Editor kann über URL-Parameter angepasst werden, um verschiedene Elemente ein- oder auszublenden.

### Verfügbare Elemente
* **Grundelemente:** Anweisung, Eingabe, Ausgabe
* **Schleifen:** Zählergesteuerte Schleife, Kopfgesteuerte Schleife, Fußgesteuerte Schleife
* **Verzweigungen:** Verzweigung, Fallunterscheidung
* **Weitere:** Try-Catch-Block, Funktionsblock

### Vordefinierte Konfigurationen

Als Standard werden alle Elemente geladen. Über URL-Parameter können spezifische Konfigurationen aktiviert werden:

**Für Python:**
```
index.html?config=python
```

**Für Python mit Funktionsblöcken:**
```
index.html?config=python_func
```

### Unterstützte Programmiersprachen

Der Code-Generator unterstützt folgende Sprachen:
- Python (< v3.10)
- Python ab v3.10 (mit match-case)
- PHP
- Java
- C#
- C++
- C (eingeschränkt: Try-Catch wird nicht unterstützt)

## Download

Die aktuellste Version kann von GitHub heruntergeladen werden:

- [Latest Release](https://github.com/openpatch/struktog/releases/latest)

Nach dem Herunterladen und Entpacken kann die `index.html` direkt im Browser geöffnet werden.

## Mitwirkende

Ursprüngliche Entwicklung:
- Klaus Ramm
- Thiemo Leonhardt  
- Tom-Maurice Schreiber

Weiterentwicklung und Wartung:
- Mike Barkmin ([@mikebarkmin](https://github.com/mikebarkmin))

Beiträge sind herzlich willkommen! Siehe [Entwicklung](#entwicklung) für weitere Informationen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe [license.md](license.md) für Details.

## Entwicklung

Die Entwicklung basiert auf Node.js und webpack. Das Projekt verwendet npm zur Verwaltung der Abhängigkeiten.

### Voraussetzungen
- Node.js (v14 oder höher empfohlen)
- npm (wird mit Node.js mitgeliefert)
- Git

### Installation

Klone das Repository und installiere die Abhängigkeiten:

```bash
git clone https://github.com/openpatch/struktog.git
cd struktog
npm install
```

### Development Server

Startet einen lokalen Entwicklungsserver mit Hot-Reloading:

```bash
npm run watch
```

Der Server läuft standardmäßig auf `http://localhost:8081`

### Production Build

Erstellt einen optimierten Build im Ordner `./build`:

```bash
npm run build
```

### Projektstruktur

- `src/` - Quellcode
  - `views/` - UI-Komponenten
  - `model/` - Datenmodelle
  - `presenter/` - Präsentationslogik
  - `helpers/` - Hilfsfunktionen
- `build/` - Kompilierte Dateien (wird generiert)
- `webpack.config.js` - Webpack-Konfiguration

## Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für eine detaillierte Liste der Änderungen.

## Credits

Dieses Projekt basiert auf dem ursprünglichen Struktogrammeditor der Didaktik der Informatik der TU Dresden.
