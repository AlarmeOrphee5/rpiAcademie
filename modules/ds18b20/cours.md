# DS18B20 - Capteur de température numérique

## Présentation

Le DS18B20 est un capteur de température numérique très populaire sur Raspberry Pi.

Contrairement au DHT11, il mesure uniquement la température mais offre une meilleure précision et une plus grande stabilité.

Le DS18B20 communique grâce au protocole **1-Wire**, ce qui permet de connecter plusieurs capteurs sur une seule broche GPIO.

---

## Matériel nécessaire

* 1 Raspberry Pi
* 1 DS18B20
* 1 résistance 4.7 kΩ / 10kΩ
* Quelques fils Dupont
* 1 breadboard

---

## Principe de fonctionnement

Le DS18B20 mesure la température puis transmet la valeur sous forme numérique au Raspberry Pi.

Le Raspberry Pi lit ensuite cette information via le bus **1-Wire**.

Chaque capteur possède un identifiant unique, ce qui permet de connecter plusieurs DS18B20 sur le même GPIO.

---

## Câblage

### Broches du DS18B20

Face plate vers vous :

```text
   _______
  |       |
  | DS18B |
  |_______|

  GND DATA VCC
```

### Connexions

| DS18B20 | Raspberry Pi |
| ------- | ------------ |
| GND     | GND          |
| DATA    | GPIO4        |
| VCC     | 3.3V         |

Ajouter une résistance 10 kΩ entre DATA et 3.3V.

Une résistance de 4.7 kΩ est habituellement recommandée, mais une
10 kΩ fonctionne également très bien pour les montages simples de ce cours.
J'ai oublié de fournir la 4.7kΩ la seule différence sera la longueur des cables.

---

## 🔌 Plan de câblage

```text
DS18B20

3.3V    ───────── VCC
GPIO4   ───────── DATA
GND     ───────── GND

3.3V ───[4.7 kΩ]── DATA
```

## Activation du bus 1-Wire

Le Raspberry Pi doit activer le support 1-Wire.

Dans un terminal :

```bash
sudo raspi-config
```

Puis :

```text
Interface Options
└── 1-Wire
    └── Enable
```

Redémarrer ensuite le Raspberry Pi.

---

## Vérifier la détection du capteur

Après le redémarrage :

```bash
ls /sys/bus/w1/devices/
```

Vous devriez voir un dossier commençant par :

```text
28-
```

Par exemple :

```text
28-00000abcdef
```

Si aucun dossier n'apparaît :

* vérifier le câblage
* vérifier la résistance 4.7 kΩ
* vérifier l'activation du bus 1-Wire

---

## Résultat attendu

Après avoir lancé le test depuis RpiAcadémie :

```text
temperature : 23.56 °C
```

La température affichée doit évoluer lorsque vous chauffez légèrement le capteur avec vos doigts.

---

## À retenir

* Le DS18B20 mesure uniquement la température.
* Il est plus précis que le DHT11.
* Il utilise le protocole 1-Wire.
* Plusieurs capteurs peuvent partager la même broche GPIO.
* Une résistance 4.7 kΩ est obligatoire entre DATA et 3.3V.
