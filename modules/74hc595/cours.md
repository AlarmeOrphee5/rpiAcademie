# 74HC595 - Bits, Clock et Latch

## Introduction

Le 74HC595 est un registre à décalage.  
Il permet de transformer une suite de bits envoyés par le Raspberry Pi en 8 sorties indépendantes.

Pour comprendre son fonctionnement, il faut maîtriser trois notions essentielles :

- les **bits**
- la **clock (horloge)**
- le **latch (validation)**

---

## 1. Qu’est-ce qu’un bit ?

Un **bit** est la plus petite unité d’information en informatique.

Il ne peut avoir que deux valeurs :

```text
0 = OFF
1 = ON
```

Dans notre cas :

- 0 → LED éteinte
- 1 → LED allumée

---

### Exemple simple

```text
00000001 → seule la LED 1 est allumée
00000010 → seule la LED 2 est allumée
11111111 → toutes les LED sont allumées
```

Le 74HC595 ne comprend que cette suite de 0 et de 1.

---

## 2. La clock (horloge)

La **clock** est un signal électrique qui dit :

> “Lis le prochain bit maintenant”

Chaque impulsion de clock permet de déplacer un bit dans le registre.

---

### Image mentale

Imagine une chaîne de personnes :

- chaque personne représente un bit
- la clock dit “avance d’une place”

À chaque impulsion :

```text
bit 1 → bit 2 → bit 3 → ... → sortie
```

---

### Sans clock

Rien ne bouge.

### Avec clock

Les bits avancent un par un dans le registre.

---

## 3. Le latch (validation)

Le latch est une étape très importante.

Il sert à :

> “Afficher le résultat final sur les sorties”

---

### Pourquoi c’est nécessaire ?

Sans latch, les LED changeraient pendant l’envoi des bits.

Avec latch :

1. Le Raspberry Pi envoie tous les bits
2. Le 74HC595 les stocke en interne
3. Le latch applique le résultat d’un coup

---

### Image mentale

```text
Envoi des bits → invisible
Latch activé → affichage instantané
```

---

## 4. Résumé du fonctionnement

Le cycle complet est :

```text
1. Le Raspberry Pi envoie un bit (DATA)
2. Il active la clock → le bit est stocké
3. Répété 8 fois
4. Le latch valide et affiche les LED
```

---

## 5. Schéma mental complet

```text
DATA  → envoie les bits
CLOCK → décale les bits
LATCH → affiche le résultat
```

---

## 6. Exemple concret

On veut afficher :

```text
00001111
```

Le Raspberry Pi :

1. envoie 0 → clock
2. envoie 0 → clock
3. envoie 0 → clock
4. envoie 0 → clock
5. envoie 1 → clock
6. envoie 1 → clock
7. envoie 1 → clock
8. envoie 1 → clock
9. latch → affichage

---

## 7. À retenir

- Un bit = 0 ou 1
- La clock fait avancer les bits
- Le latch affiche le résultat final
- Le 74HC595 permet d’augmenter les sorties du Raspberry Pi

---

## 8. Pourquoi c’est important

Ce module est une étape clé car il introduit :

- la logique binaire réelle
- le contrôle bas niveau du matériel
- la notion de séquence électrique

C’est la base de tous les systèmes embarqués avancés.

## Présentation

Le 74HC595 est un composant électronique appelé **registre à décalage**.

Son rôle est simple :

> Permettre au Raspberry Pi de contrôler jusqu’à 8 sorties (LED, afficheurs…) avec seulement 3 GPIO.

C’est un module très utilisé en électronique embarquée pour économiser les broches du microcontrôleur.

---

## À quoi ça sert concrètement ?

Le Raspberry Pi possède un nombre limité de GPIO.

Sans 74HC595 :

- 1 LED = 1 GPIO
- 8 LED = 8 GPIO
- 16 LED = 16 GPIO

Avec le 74HC595 :

- 8 LED = 3 GPIO seulement
- Possibilité de chaîner plusieurs modules

👉 On peut donc créer des :
- compteurs LED
- animations lumineuses
- afficheurs 7 segments
- matrices LED

---

## Broches du 74HC595

Le module possède 16 broches, mais seules quelques-unes sont essentielles.

### Côté logique (Raspberry Pi)

| Broche | Nom | Rôle |
|--------|-----|------|
| 14 | DS | Données (DATA) |
| 11 | SHCP | Clock (horloge) |
| 12 | STCP | Latch (validation) |

---

### Alimentation et contrôle

| Broche | Nom | Rôle |
|--------|-----|------|
| 16 | VCC | 3.3V |
| 8 | GND | Masse |
| 13 | OE | Activation sortie (LOW = actif) |
| 10 | MR | Reset (LOW = reset) |

---

### Sorties vers les LED

| Broche | Nom |
|--------|-----|
| 15, 1, 2, 3, 4, 5, 6, 7 | Q0 → Q7 |

Ce sont les 8 sorties du registre.

---

## 🔌 Plan de câblage

```text
74HC595

GPIO17 ───────── DS (Data)
GPIO27 ───────── SH_CP (Clock)
GPIO22 ───────── ST_CP (Latch)

3.3V     ───────── VCC
GND    ───────── GND
3.3V     ───────── MR
GND    ───────── OE
```

## Fonctionnement simplifié

Le module fonctionne en 3 étapes :

### 1. Envoi des bits

Le Raspberry Pi envoie des 0 et des 1 via la broche DATA.

---

### 2. Horloge (clock)

Chaque impulsion de clock fait avancer un bit dans le registre.

---

### 3. Latch (validation)

Une fois les 8 bits envoyés :

> Le latch affiche toutes les sorties en même temps

---
