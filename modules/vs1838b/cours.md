# Récepteur infrarouge VS1838B

## Objectif

Apprendre à recevoir des commandes envoyées par une télécommande infrarouge.

Le VS1838B est un récepteur infrarouge capable de détecter les signaux envoyés par la plupart des télécommandes TV, climatiseurs, chaînes Hi-Fi ou télécommandes de kits électroniques.

---

# À quoi sert ce module ?

Ce module permet à un Raspberry Pi ou à un microcontrôleur de recevoir des commandes à distance.

Exemples d'utilisation :

- Contrôler un robot.
- Piloter un menu sur un écran LCD.
- Allumer ou éteindre une LED à distance.
- Déclencher une alarme.
- Construire une télécommande personnalisée.

---

# Comment fonctionne une télécommande ?

Lorsqu'on appuie sur une touche :

1. La télécommande émet de la lumière infrarouge.
2. Cette lumière est invisible pour l'œil humain.
3. Le récepteur VS1838B détecte cette lumière.
4. Le Raspberry Pi décode les informations reçues.

Chaque bouton possède son propre code.

Par exemple :

| Bouton | Code reçu |
|---------|---------|
| 1 | 0xF30CFF00 |
| 2 | 0xE718FF00 |
| 3 | 0xA15EFF00 |
| On | 0xBA45FF00 |

Les codes dépendent de la télécommande utilisée.

---

# Les broches du module

Le VS1838B possède 3 broches.

| Broche | Fonction | patte |
|---------|---------|---------|
| VCC | Alimentation 3,3V ou 5V |droite|
| GND | Masse |centre|
| OUT | Signal numérique |gauche|

---

# Câblage sur Raspberry Pi

| VS1838B | Raspberry Pi |
|---------|---------|
| VCC | 3.3V |
| GND | GND |
| OUT | GPIO17 |

---

# Le protocole NEC

La plupart des télécommandes infrarouges utilisent le protocole NEC, développé à l'origine par l'entreprise japonaise NEC.

Un protocole est un ensemble de règles permettant à deux appareils de communiquer dans le même langage.

Dans notre cas :

- La télécommande envoie un message.
- Le récepteur VS1838B reçoit ce message.
- Le Raspberry Pi décode le message.

---

# Structure d'une trame NEC

Une trame NEC est généralement composée de 32 bits :

| Taille | Contenu |
|----------|----------|
| 8 bits | Adresse |
| 8 bits | Adresse inversée |
| 8 bits | Commande |
| 8 bits | Commande inversée |

Représentation :

```text
AAAAAAAA AAAAAAAA CCCCCCCC CCCCCCCC
Adresse  ~Adresse Commande ~Commande
```

L'adresse permet d'identifier l'appareil.

La commande représente la touche pressée.

Les parties inversées servent à vérifier que les données n'ont pas été corrompues pendant la transmission.

---

# Pourquoi envoyer les données deux fois ?

Imaginons que la télécommande souhaite envoyer :

```text
Adresse : 11110000
```

Elle envoie également :

```text
Adresse inversée : 00001111
```

Le Raspberry Pi peut vérifier que les deux valeurs sont cohérentes.

Si ce n'est pas le cas, le message est considéré comme invalide.

Cette technique permet de détecter certaines erreurs de transmission.

---

# Comment sont transmis les bits ?

Les données ne sont pas envoyées directement sous forme de 0 et de 1.

La télécommande allume et éteint sa LED infrarouge très rapidement.

Le récepteur mesure alors la durée des impulsions.

Par convention :

| Bit | Durée approximative |
|----------|----------|
| 0 | 560 µs + pause courte |
| 1 | 560 µs + pause longue |

Le Raspberry Pi peut ainsi reconstruire les données bit par bit.

---

# Trame de démarrage

Avant d'envoyer les 32 bits, la télécommande transmet une séquence spéciale indiquant :

```text
Attention, une nouvelle trame commence !
```

Cette séquence est composée :

- d'une impulsion d'environ 9 ms
- suivie d'une pause d'environ 4,5 ms

Cette signature permet au récepteur de se synchroniser.

---

# Répétition d'une touche

Lorsque l'on maintient une touche appuyée :

- le code complet n'est envoyé qu'une seule fois ;
- ensuite, la télécommande envoie des trames de répétition.

Cela permet à l'appareil de savoir que l'utilisateur maintient la touche enfoncée.

Exemple :

```text
Volume +
Volume +
Volume +
Volume +
```

Sans avoir à renvoyer les 32 bits à chaque fois.

---

# Exemple réel

Pendant les tests du module, nous avons reçu :

```text
0xBA45FF00
```
Cette valeur représente une touche de la télécommande.

0x -> c'est une convention de nommage pour les codes Hexadécimaux
BA45 -> Représente la commande envoyé
FF00 -> C'est l'adresse de la télécommande.

Une autre touche peut produire :

```text
0xF708FF00
```

Chaque bouton possède son propre code.

C'est pour cette raison qu'il est utile de créer une table de correspondance.
Attention ceci n'est valable que pour ma télécommande, la tienne pourra produire
une adresse et des commandes différentes, c'est normal.

---

# Pourquoi le VS1838B ne reçoit-il pas directement la lumière ?

La lumière infrarouge est présente partout :

- soleil ;
- lampes ;
- éclairages LED ;
- télécommandes.

Pour éviter les perturbations, les télécommandes utilisent une fréquence de modulation de 38 kHz.

Cela signifie que la LED infrarouge clignote environ :

```text
38 000 fois par seconde
```

Le VS1838B est spécialement conçu pour détecter cette fréquence et ignorer la plupart des autres sources lumineuses.

Cette technique améliore fortement la fiabilité de la communication.

---

# Créer sa table de correspondance

Je te l'ai écrit mais pour le moment contente toi de voir les codes, je te sortirais une table d'association
plus tard.

Chaque télécommande possède ses propres codes.

Une bonne pratique consiste à créer une table permettant d'associer chaque code à une fonction.

Exemple :

| Touche | Code |
|---------|---------|
| Power | 0xBA45FF00 |
| Vol + | 0xF708FF00 |
| Vol - | 0xE718FF00 |
| Gauche | 0xA55AFF00 |
| Droite | 0xBD42FF00 |

Cette table peut être enregistrée dans un fichier JSON afin d'être réutilisée par nos programmes.

Exemple :

```json
{
  "0xBA45FF00": "POWER",
  "0xF708FF00": "VOLUME_PLUS",
  "0xE718FF00": "VOLUME_MOINS"
}
```
---

# Exercice

1. Lancez le test du module.
2. Appuyez sur plusieurs touches de votre télécommande.
3. Notez les codes reçus.
4. Créez votre propre table de correspondance.

---

# Pour aller plus loin

Le VS1838B peut être utilisé pour :

- Créer une télécommande universelle.
- Commander un robot.
- Contrôler une maison connectée.
- Piloter un menu sur écran LCD.
- Réaliser un système domotique.

C'est un excellent module pour découvrir les protocoles de communication et le décodage de signaux numériques.