# DHT22

## Qu'est-ce qu'un DHT22 ?

Le DHT22 est un capteur capable de mesurer :

* La température de l'air
* L'humidité de l'air

Son fonctionnement est très proche de celui du DHT11, mais il est plus précis et peut mesurer une plage de valeurs plus large.

Le DHT22 est souvent utilisé dans les projets nécessitant des mesures plus fiables.

---

## À quoi sert un DHT22 ?

Le DHT22 peut être utilisé pour :

* Mesurer la température d'une pièce.
* Surveiller une serre.
* Contrôler un système de ventilation.
* Mesurer les conditions météorologiques.
* Automatiser un système d'arrosage.

Il est particulièrement adapté lorsque l'on souhaite obtenir des mesures plus précises que celles fournies par le DHT11.

---

## Que mesure-t-il ?

### La température

La température est exprimée en degrés Celsius (°C).

Exemples :

* 0 °C : eau qui gèle.
* 20 °C : température agréable dans une maison.
* 35 °C : forte chaleur.

Le DHT22 peut mesurer des températures comprises entre -40 °C et +80 °C.

---

### L'humidité

L'humidité représente la quantité d'eau présente dans l'air.

Elle est exprimée en pourcentage (%).

Exemples :

* 20 % : air sec.
* 50 % : humidité confortable.
* 80 % : air très humide.

Le DHT22 peut mesurer une humidité comprise entre 0 % et 100 %.

---

## Les broches du DHT22

Selon les modèles, le DHT22 peut être vendu seul ou monté sur un module.

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

## Comment fonctionne le DHT22 ?

Le capteur effectue régulièrement des mesures de température et d'humidité.

Ces informations sont ensuite envoyées au Raspberry Pi par la broche de données.

Le programme peut alors afficher les résultats ou les utiliser pour prendre des décisions.

---

## Ce que nous allons réaliser

Nous allons :

1. Brancher le DHT22 sur le Raspberry Pi.
2. Lancer le programme de test.
3. Lire la température mesurée.
4. Lire l'humidité mesurée.

Si des valeurs cohérentes apparaissent à l'écran, le montage est réussi.

---

## Vérification du montage

Avant de lancer le test :

* Le + est relié au 3.3V.
* Le - est relié au GND.
* La broche DATA est reliée au GPIO indiqué sur le schéma.
* Les câbles sont correctement connectés.

---

## DHT11 ou DHT22 ?

Les deux capteurs mesurent la température et l'humidité.

Le DHT22 est cependant plus performant :

| Caractéristique       | DHT11     | DHT22       |
| --------------------- | --------- | ----------- |
| Température           | 0 à 50 °C | -40 à 80 °C |
| Humidité              | 20 à 80 % | 0 à 100 %   |
| Précision température | ±2 °C     | ±0,5 °C     |
| Précision humidité    | ±5 %      | ±2 %        |

Le DHT22 est donc plus adapté lorsque l'on souhaite obtenir des mesures précises.

---

## À retenir

* Le DHT22 mesure la température et l'humidité de l'air.
* Il fonctionne presque comme un DHT11.
* Il offre une meilleure précision.
* Il couvre une plage de mesure plus importante.
* Il est souvent utilisé dans les projets nécessitant des mesures fiables.

Le DHT22 est considéré comme l'évolution du DHT11 et constitue un excellent capteur pour les projets de surveillance environnementale.

## 🔌 Plan de câblage

```text
DHT11 / DHT22

3.3V    ───────── VCC
GPIO17  ───────── DATA
GND     ───────── GND

3.3V ───[10 kΩ]── DATA
```