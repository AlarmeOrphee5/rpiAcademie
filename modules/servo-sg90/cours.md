# Servomoteur SG90

## Présentation

Le SG90 est un petit servomoteur très utilisé en électronique et en robotique.

Contrairement à un moteur classique qui tourne en continu, un servomoteur peut être positionné précisément à un angle donné.

Le SG90 peut généralement se déplacer entre :

```text
0°
et
180°
```

Cela le rend idéal pour :

- Robotique
- Bras articulés
- Portes automatiques
- Barrières
- Aiguilles de mesure
- Projets domotiques

---

## Matériel nécessaire

- 1 Raspberry Pi
- 1 Servomoteur SG90
- Quelques fils Dupont

---

## Câblage

### Couleurs des fils

| Couleur | Fonction |
|----------|----------|
| Marron | GND |
| Rouge | +5V |
| Orange | Signal PWM |

### Connexions

| SG90 | Raspberry Pi |
|--------|-------------|
| Marron | GND |
| Rouge | 5V |
| Orange | GPIO18 |

---

## Attention à l'alimentation

Un servomoteur consomme beaucoup plus de courant qu'une LED ou un capteur.

Pour un simple test, l'alimentation 5V du Raspberry Pi est généralement suffisante.

Pour plusieurs servomoteurs ou des mouvements fréquents, il est recommandé d'utiliser une alimentation externe.

---

## Comment fonctionne un servomoteur ?

Le SG90 utilise un signal appelé PWM.

PWM signifie :

```text
Pulse Width Modulation
Modulation de largeur d'impulsion
```

Le Raspberry Pi envoie une série d'impulsions électriques.

La durée de ces impulsions indique au servomoteur l'angle à atteindre.

---

## Exemples

```text
0°     -> bras complètement à gauche
90°    -> position centrale
180°   -> bras complètement à droite
```

---

## Qu'est-ce que le PWM ?

Le PWM consiste à envoyer des impulsions très rapides.

Exemple simplifié :

```text
█░░░░░░░░░
```
Impulsion courte.

```text
█████░░░░░
```

Impulsion plus longue.

Selon la durée de l'impulsion, le servomoteur se place à une position différente.

---

## Résultat attendu

Lors du test du module :

1. Le servo se place à 0°
2. Le servo se place à 90°
3. Le servo se place à 180°
4. Le servo revient à 90°

---

## Applications

Le SG90 est utilisé dans :

- Robots
- Portails automatiques
- Maquettes animées
- Bras robotisés
- Systèmes d'ouverture

---

## Limites

Le SG90 n'est pas conçu pour tourner en continu.

Il ne peut généralement pas dépasser :

```text
0° à 180°
```

Forcer le mouvement au-delà de cette plage peut endommager le mécanisme.

---

## À retenir

- Le SG90 est un servomoteur.
- Il peut être positionné précisément.
- Il est commandé par un signal PWM.
- Le Raspberry Pi peut contrôler son angle.
- Il est très utilisé en robotique et en automatisation.