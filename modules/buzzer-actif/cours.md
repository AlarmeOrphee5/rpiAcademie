# Buzzer

## Qu'est-ce qu'un buzzer ?

Un buzzer est un composant électronique capable de produire un son.

Il est souvent utilisé pour :

* émettre une alarme ;
* signaler un événement ;
* confirmer une action ;
* attirer l'attention de l'utilisateur.

On retrouve des buzzers dans de nombreux appareils :

* réveils ;
* micro-ondes ;
* systèmes d'alarme ;
* jouets électroniques ;
* ordinateurs.

---

## À quoi sert un buzzer ?

Le buzzer permet au Raspberry Pi de communiquer par le son.

Par exemple :

* signaler qu'un programme a démarré ;
* avertir lorsqu'une température est trop élevée ;
* confirmer l'appui sur un bouton ;
* jouer une petite mélodie.

---

## Les deux types de buzzers

Il existe deux grandes familles de buzzers.

### Buzzer actif

Le buzzer actif possède un circuit électronique intégré.

Il suffit de lui fournir de l'électricité pour qu'il émette un son.

Le Raspberry Pi peut simplement :

* l'allumer ;
* l'éteindre.

C'est le type le plus simple à utiliser.

### Buzzer passif

Le buzzer passif ne produit pas de son tout seul.

Le Raspberry Pi doit lui envoyer un signal électrique qui change rapidement.

La fréquence de ce signal détermine la note produite.

Grâce à cela, il est possible de jouer des mélodies.

---

## Les broches du buzzer

Un buzzer possède généralement deux connexions :

### Broche positive (+)

Elle est reliée à une sortie GPIO du Raspberry Pi.

### Broche négative (-)

Elle est reliée au GND (la masse).

---

## Ce que nous allons réaliser

Dans ce module, nous allons :

* brancher un buzzer ;
* produire un signal sonore ;
* vérifier que le Raspberry Pi peut commander une sortie.

Si le buzzer émet un son lorsque le programme est lancé, le montage est réussi.

---

## Vérification du montage

Avant de lancer le test :

* le buzzer est correctement branché ;
* la borne positive est reliée au GPIO ;
* la borne négative est reliée au GND ;
* les câbles sont correctement connectés.

---

## À retenir

* Un buzzer permet de produire un son.
* Il existe des buzzers actifs et passifs.
* Le buzzer actif est le plus simple à utiliser.
* Le buzzer passif permet de jouer différentes notes.
* Le Raspberry Pi peut contrôler un buzzer grâce à ses broches GPIO.

Lorsque le buzzer émet un son, cela signifie que le Raspberry Pi contrôle correctement une sortie GPIO.

## 🔌 Plan de câblage

```text
Buzzer actif

GPIO17 ───────── SIG (+)
                 [BUZZER]
GND     ───────── GND (-)
```