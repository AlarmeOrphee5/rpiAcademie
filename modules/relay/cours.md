# Module relais 5V

## Objectif

Apprendre à contrôler un relais à l'aide du Raspberry Pi.

Un relais est un interrupteur commandé électroniquement. Il permet d'allumer ou d'éteindre un circuit à l'aide d'un simple signal envoyé par le Raspberry Pi.

Le module relais peut être utilisé avec du 230V.

Cependant ⚠️ Ne manipulez jamais le secteur sans connaissances adaptées.
---

# À quoi sert un relais ?

Un relais permet de piloter un appareil sans être directement relié à son alimentation.

Par exemple :

- Allumer une lampe.
- Démarrer un ventilateur.
- Contrôler une pompe.
- Commander un moteur.
- Déclencher une alarme.

Le Raspberry Pi envoie simplement une commande, et le relais agit comme un interrupteur.

---

# Comment fonctionne un relais ?

À l'intérieur du module se trouve :

- Une bobine électromagnétique.
- Un contact mobile.
- Plusieurs contacts fixes.

Lorsque la bobine est alimentée :

1. Un champ magnétique est créé.
2. Le contact mobile se déplace.
3. Le circuit est ouvert ou fermé.

On entend souvent un petit :

```text
CLIC
```

lors de l'activation du relais.

Ce bruit est parfaitement normal.

---

# Pourquoi utiliser un relais ?

Les broches GPIO du Raspberry Pi peuvent seulement fournir quelques milliampères.

Elles ne peuvent pas alimenter directement :

- Une lampe.
- Un moteur puissant.
- Un appareil domestique.

Le relais sert d'intermédiaire.

Le Raspberry Pi commande le relais, et le relais commande l'appareil.

---

# Les broches du module

Côté commande :

| Broche | Fonction |
|----------|----------|
| VCC | Alimentation du module |
| GND | Masse |
| IN | Signal de commande |

---

# Câblage sur Raspberry Pi

| Relais | Raspberry Pi |
|----------|----------|
| VCC | 5V |
| GND | GND |
| IN | GPIO17 |

Le GPIO peut être remplacé par n'importe quelle autre broche configurée dans le programme.

---

# Les bornes de puissance

Le relais possède généralement trois bornes à vis.

| Borne | Signification |
|----------|----------|
| COM | Contact commun |
| NO | Normalement ouvert |
| NC | Normalement fermé |

---

# Que signifient NO et NC ?

## NO : Normally Open

Lorsque le relais est au repos :

```text
COM   NO
 X
```

Le courant ne passe pas.

Lorsque le relais est activé :

```text
COM ----- NO
```

Le courant passe.

C'est le mode le plus utilisé.

---

## NC : Normally Closed

Lorsque le relais est au repos :

```text
COM ----- NC
```

Le courant passe.

Lorsque le relais est activé :

```text
COM   NC
 X
```

Le courant est coupé.

---

# Exemple simple

Imaginons une lampe branchée entre COM et NO.

Relais désactivé :

```text
Lampe éteinte
```

Relais activé :

```text
Lampe allumée
```

Le relais agit exactement comme un interrupteur.

---

# Attention à la sécurité

Le module relais peut être utilisé avec du 230V.

Cependant :

⚠️ Ne manipulez jamais le secteur sans connaissances adaptées.

Pour les exercices de ce cours :

- Utilisez uniquement le module relais.
- Écoutez le clic de commutation.
- Observez l'allumage de la LED intégrée au module.

Aucun branchement sur le secteur n'est nécessaire.

---

# Test du module

Lors du test :

1. Lancez le test depuis RpiAcadémie.
2. Le relais doit produire un clic.
3. La LED du module doit changer d'état.

Si vous entendez le clic, le relais fonctionne correctement.

---

# Pour aller plus loin

Les relais sont très utilisés en :

- Domotique.
- Automatisation.
- Robotique.
- Contrôle d'équipements électriques.

Ils permettent à un microcontrôleur ou à un Raspberry Pi de commander des équipements beaucoup plus puissants que ce qu'une simple broche GPIO pourrait alimenter.

## 🔌 Plan de câblage

```text
Relais

5V      ───────── VCC
GPIO17  ───────── IN
GND     ───────── GND
```