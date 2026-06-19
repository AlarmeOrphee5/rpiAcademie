# HDX-2801 - Capteur d'inclinaison (Ball Switch)

## Présentation

Le HDX-2801 est un capteur d'inclinaison mécanique, également appelé **Ball Switch**.

À l'intérieur du composant se trouve une petite bille métallique qui établit ou coupe un contact électrique selon l'orientation du capteur.

Contrairement à un accéléromètre ou à un gyroscope, ce capteur ne mesure pas un angle précis. Il indique simplement si le capteur est dans une certaine position ou non.

---

## Matériel nécessaire

- 1 Raspberry Pi
- 1 capteur HDX-2801 (Ball Switch)
- Quelques fils Dupont
- 1 breadboard

---

## Principe de fonctionnement

Lorsque le capteur est dans une certaine position, la bille métallique touche les contacts internes et ferme le circuit.

Lorsque le capteur est incliné dans l'autre sens, la bille se déplace et ouvre le circuit.

Le Raspberry Pi lit alors un état numérique :

```text
0 = contact fermé
1 = contact ouvert
```

ou l'inverse selon le câblage utilisé.

---

## Câblage

### Connexions

| HDX-2801 | Raspberry Pi |
|-----------|-------------|
| Broche 1 | GPIO17 |
| Broche 2 | GND |

Le capteur n'est pas polarisé. Les deux broches peuvent être inversées.

Dans ce module, une résistance de tirage interne (Pull-Up) du Raspberry Pi est utilisée. Aucune résistance externe n'est nécessaire.

---

## Qu'est-ce qu'une Pull-Up ?

Une entrée GPIO ne doit jamais être laissée "dans le vide".

Sans résistance de tirage, le Raspberry Pi pourrait lire des valeurs aléatoires.

Une résistance **Pull-Up** relie l'entrée au 3.3V lorsque le contact est ouvert.

Ainsi :

```text
Contact ouvert  -> GPIO = 1
Contact fermé   -> GPIO = 0
```

Le Raspberry Pi dispose de résistances Pull-Up internes qui peuvent être activées par logiciel.

---

## Test du capteur

Lancez le test depuis RpiAcadémie.

Le résultat affichera :

```text
tilt : normal
```

ou

```text
tilt : incline
```

selon la position du capteur.

Essayez ensuite de faire pivoter doucement le composant.

Vous devriez voir l'état changer automatiquement.

---

## Applications

Ce type de capteur est utilisé dans :

- Détecteurs de chute
- Alarmes anti-renversement
- Détection d'ouverture
- Jouets électroniques
- Systèmes de sécurité simples

---

## Limites

Le HDX-2801 est un capteur très simple.

Il ne permet pas de connaître :

- l'angle d'inclinaison
- la vitesse de déplacement
- l'accélération

Il indique uniquement si le contact interne est ouvert ou fermé.

Pour des mesures plus précises, il faut utiliser un accéléromètre ou un gyroscope.

---

## Résultat attendu

Lorsque vous inclinez le capteur :

```text
tilt : normal
```

devient :

```text
tilt : incline
```

puis revient à son état initial lorsque le capteur retrouve sa position de départ.

---

## À retenir

- Le HDX-2801 est un capteur d'inclinaison mécanique.
- Il fonctionne comme un interrupteur commandé par une bille métallique.
- Il fournit une information numérique (0 ou 1).
- Aucune résistance externe n'est nécessaire avec la Pull-Up interne du Raspberry Pi.
- Il est idéal pour découvrir les capteurs numériques simples.