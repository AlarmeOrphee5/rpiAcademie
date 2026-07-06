# 🔘 Module : Bouton GPIO (Raspberry Pi + pigpio)

## 🎯 Objectif du module

Ce module permet de :
- Lire l’état d’un bouton physique (appuyé / relâché)
- Détecter les changements d’état en temps réel
- Compter les appuis
- Intégrer un bouton dans un système IoT (RpiAcadémie)

---

## ⚙️ Principe de fonctionnement

Un bouton est un **entrée digitale** branchée sur un GPIO :

- **0 (LOW)** → bouton relâché
- **1 (HIGH)** → bouton appuyé

Le Raspberry Pi ne “devine” pas l’état :
👉 il lit simplement une tension électrique.

## 🧠 Pull-up / Pull-down (IMPORTANT)

Quand un bouton est connecté à un GPIO, il faut éviter que la broche “flotte”.

### ❌ Problème sans pull-up/pull-down
Sans résistance :
- le GPIO capte des valeurs aléatoires (exemple : 0.00052 V ou 2.98V)
- faux déclenchements
- comportement instable

---

## 🔼 Pull-up (résistance de tirage vers le haut)

### Fonctionnement :
- Le GPIO est relié à **3.3V via une résistance**
- Valeur par défaut = **1 (HIGH)**
- Quand on appuie sur le bouton → on relie à GND → **0 (LOW)**

### Utilisation typique :
- Bouton connecté entre GPIO et GND

---

## 🔽 Pull-down (résistance de tirage vers le bas)

### Fonctionnement :
- Le GPIO est relié à **GND via une résistance**
- Valeur par défaut = **0 (LOW)**
- Quand on appuie sur le bouton → on relie à 3.3V → **1 (HIGH)**

### Utilisation typique :
- Bouton connecté entre GPIO et 3.3V

---

## ⚖️ Pull-up vs Pull-down (résumé)

| Type      | État au repos | État appuyé | Câblage bouton |
|-----------|--------------|--------------|----------------|
| Pull-up   | HIGH (1)     | LOW (0)      | GPIO → bouton → GND |
| Pull-down | LOW (0)      | HIGH (1)     | GPIO → bouton → 3.3V |

---

## ⚡ Pourquoi utiliser les pull internes ?

Le Raspberry Pi permet d’activer des résistances internes :

✔ évite d’ajouter des résistances physiques  
✔ simplifie le montage  
✔ réduit les erreurs de câblage 

## Cablage

GPIO17 ───────┐
              │
          [Bouton]
              │
GND ──────────┘