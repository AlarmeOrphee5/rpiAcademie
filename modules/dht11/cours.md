# DHT11

## Qu'est-ce qu'un DHT11 ?

Le DHT11 est un capteur capable de mesurer :

* La température de l'air
* L'humidité de l'air

Il est souvent utilisé dans les projets de domotique, de surveillance environnementale ou de jardinage.

Grâce à lui, un Raspberry Pi peut connaître les conditions de son environnement et prendre des décisions en conséquence.

---

## À quoi sert un DHT11 ?

Le DHT11 peut être utilisé pour :

* Mesurer la température d'une pièce.
* Surveiller l'humidité d'une serre.
* Déclencher un ventilateur lorsqu'il fait trop chaud.
* Contrôler un système d'arrosage.
* Afficher les conditions météo sur un écran.

Le DHT11 est l'un des capteurs les plus populaires pour débuter avec les Raspberry Pi et les Arduino.

---

## Que mesure-t-il ?

### La température

La température est exprimée en degrés Celsius (°C).

Exemples :

* 0 °C : eau qui gèle.
* 20 °C : température confortable dans une maison.
* 35 °C : journée très chaude.

---

### L'humidité

L'humidité représente la quantité d'eau présente dans l'air.

Elle est exprimée en pourcentage (%).

Exemples :

* 20 % : air très sec.
* 50 % : humidité confortable.
* 80 % : air très humide.

---

## Les broches du DHT11

Selon les modèles, le DHT11 peut être vendu seul ou monté sur une petite carte électronique.

Dans ce cours, nous utilisons la version sur module.

Le module possède trois broches :

### +

Alimentation du capteur.

À connecter au 3.3V du Raspberry Pi.

### OUT ou S

Broche de données.

Elle transmet les mesures au Raspberry Pi.

### -

Masse (GND).

À connecter à une broche GND du Raspberry Pi.

---

## Comment fonctionne le DHT11 ?

Le capteur effectue une mesure puis l'envoie au Raspberry Pi à travers la broche de données.

Le programme lit ensuite ces informations et affiche :

* la température ;
* l'humidité.

---

## Ce que nous allons réaliser

Nous allons :

1. Brancher le DHT11 sur le Raspberry Pi.
2. Lancer le programme de test.
3. Lire la température mesurée.
4. Lire l'humidité mesurée.

Si les valeurs apparaissent correctement, le montage est réussi.

---

## Vérification du montage

Avant de lancer le test :

* Le + est relié au 3.3V.
* Le - est relié au GND.
* La broche DATA est reliée au GPIO indiqué sur le schéma.
* Les câbles sont correctement branchés.

---

## Limites du DHT11

Le DHT11 est simple à utiliser mais n'est pas très précis.

Ses principales caractéristiques sont :

* Température : de 0 à 50 °C.
* Humidité : de 20 à 80 %.
* Précision limitée.

Pour des mesures plus précises, on utilise souvent le DHT22.

---

## À retenir

* Le DHT11 mesure la température et l'humidité de l'air.
* Il communique avec le Raspberry Pi grâce à une broche de données.
* Les résultats sont affichés sous forme de degrés Celsius et de pourcentage.
* C'est un excellent capteur pour débuter l'électronique et la domotique.

## 🔌 Plan de câblage

```text
DHT11 / DHT22

3.3V    ───────── VCC
GPIO17  ───────── DATA
GND     ───────── GND

3.3V ───[10 kΩ]── DATA
```