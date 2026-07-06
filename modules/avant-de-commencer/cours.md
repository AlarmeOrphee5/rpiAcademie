# 📖 Avant de commencer

## Bienvenue dans RpiAcadémie

Bienvenue dans **RpiAcadémie** !

Cette application a pour objectif de vous apprendre à utiliser les composants électroniques les plus courants avec un **Raspberry Pi**.

Chaque module contient :

- 📚 Un cours simple et progressif.
- 🔌 Un schéma de câblage.
- 🧪 Un test automatique permettant de vérifier votre montage.

Avant de réaliser votre premier montage, il est important de comprendre quelques notions essentielles.

---

# Le Raspberry Pi

Le Raspberry Pi est un **nano-ordinateur**.

Contrairement à un microcontrôleur comme un Arduino, il exécute un véritable système d'exploitation (Linux). Il est donc capable de faire fonctionner plusieurs applications en même temps et de programmer dans différents langages comme **Python**, **Node.js**, **C++**, **Java**, etc.

Son principal intérêt pour ce cours est la présence de ses **GPIO**, qui lui permettent de communiquer avec des composants électroniques.

---

# Les GPIO

GPIO signifie **General Purpose Input Output** (Entrée/Sortie à usage général).

Ce sont les broches que nous utiliserons dans tous les montages.

Un GPIO peut être configuré de deux façons :

- **Entrée** : le Raspberry Pi reçoit une information (bouton, capteur, télécommande infrarouge...).
- **Sortie** : le Raspberry Pi commande un composant (LED, relais, buzzer...).

Certaines broches disposent également de fonctions spéciales :

- PWM (commande de servomoteurs, variation de luminosité...)
- I²C
- SPI
- UART

Ces protocoles seront étudiés dans les modules correspondants.

> ⚠️ Tous les GPIO du Raspberry Pi fonctionnent en **3,3 V**.

---

# Les alimentations

Le connecteur GPIO comporte plusieurs tensions.

## 🔹 3,3 V

C'est la tension utilisée par les GPIO ainsi que par de nombreux capteurs.

> ⚠️ Ne jamais appliquer directement du **5 V** sur un GPIO : cela peut endommager définitivement le Raspberry Pi.

---

## 🔹 5 V

Cette tension est principalement utilisée pour alimenter certains composants :

- Relais
- Servomoteurs
- Écrans LCD
- Quelques modules électroniques

Dans la majorité des cas, le 5 V sert uniquement à alimenter le composant, tandis que la communication avec le Raspberry Pi reste en 3,3 V.

---

## 🔹 GND (Ground)

Le **GND**, ou masse, est la référence électrique commune.

Tous les composants d'un montage doivent partager le même GND.

Sans cette connexion, le circuit ne peut généralement pas fonctionner correctement.

---

# La breadboard

La breadboard (plaque d'essai) permet de réaliser des montages **sans soudure**.

Elle est composée de pistes électriques internes qui relient plusieurs trous entre eux.

Les rails situés sur les côtés servent généralement à distribuer :

- le 3,3 V
- le 5 V
- le GND

Les rangées centrales permettent de connecter facilement les composants et les fils.

---

# Les fils Dupont

Les fils Dupont servent à relier les composants au Raspberry Pi.

Il existe trois types :

- Mâle → Mâle
- Mâle → Femelle
- Femelle → Femelle

Le choix dépend du connecteur présent sur chaque composant.

---

# Lire un schéma de câblage

Chaque module de RpiAcadémie est accompagné d'un schéma.

Avant d'allumer le Raspberry Pi, prenez toujours quelques secondes pour vérifier :

- ✅ Le numéro du GPIO utilisé.
- ✅ La présence du GND.
- ✅ L'alimentation (3,3 V ou 5 V).
- ✅ Le sens des composants lorsqu'il est important.

La majorité des problèmes provient simplement d'une erreur de câblage.

---

# Les tests automatiques

Chaque module possède un bouton **🧪 Tester** ou **▶ Démarrer**.

Les tests permettent de vérifier automatiquement que votre montage fonctionne correctement.

Si un test échoue :

1. Vérifiez le câblage.
2. Vérifiez que le bon GPIO est utilisé.
3. Vérifiez les connexions d'alimentation.
4. Relancez le test.

Prenez le temps de comprendre l'erreur avant de modifier votre montage.

---

# Bonnes pratiques

✔ Toujours couper l'alimentation avant de modifier un montage.

✔ Vérifier deux fois le câblage avant de lancer un test.

✔ Ne jamais relier directement un GPIO au 5 V.

✔ Manipuler les composants avec précaution.

✔ Éviter les faux contacts en utilisant des connexions propres.

✔ Commencer par les modules de difficulté **⭐ 1** avant de passer aux suivants.

---

# Pour aller plus loin

Tout au long de cette formation, vous découvrirez progressivement :

- les capteurs ;
- les actionneurs ;
- les protocoles de communication (I²C, SPI, infrarouge...) ;
- la programmation des GPIO avec Node.js.

Chaque module est indépendant : vous pouvez les réaliser dans l'ordre qui vous convient, même s'il est conseillé de suivre la progression proposée.

---

# Prêt à commencer ?

Vous disposez maintenant des bases nécessaires pour réaliser vos premiers montages.

Prenez votre temps, expérimentez et n'hésitez pas à refaire les tests plusieurs fois.

L'objectif de **RpiAcadémie** n'est pas seulement de réussir les montages, mais surtout de comprendre leur fonctionnement.

Bonne découverte de l'électronique avec votre Raspberry Pi ! 🚀