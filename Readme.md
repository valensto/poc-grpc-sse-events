# POC gRPC & SSE

Ce projet est un POC sur l'utilisation de gRPC et SSE (Server-Sent Event). Il se compose d'une API
utilisant une Gateway comme point d'entrée et d'une application React qui synchronise les événements via SSE.

## Installation

Pour installer ce projet, vous devez d'abord cloner le repository et avoir Docker ainsi que npm installés sur votre
machine. Ensuite, ouvrez un terminal à la racine du projet et exécutez la commande suivante :

```bash
make install
```

Cela va installer les dépendances, construire les images Docker nécessaires et lancer les containers Docker. Une fois
que tout est prêt, vous pouvez accéder à l'application sur http://localhost:3000.

## Utilisation

L'idée de base est de permettre l'envoi de données POST à l'API via l'
URL http://localhost:4000/sensors/{id}/measurement. Ces données sont envoyées via la Gateway (en utilisant HTTP) au
service Sensor (en utilisant gRPC), qui à son tour envoie une alerte au service Alert (via gRPC).

Si un client web est connecté via l'application React, il peut recevoir en temps réel les événements SSE de la Gateway.
Pour tester cela, vous pouvez ouvrir plusieurs navigateurs avec l'application React et envoyer une alerte à partir
de http://localhost:4000/sensors/{id}/measurement, vous verrez que toutes les instances de l'application React
connectées recevront la même alerte en temps réel.

Vous pouvez également utiliser le script bash fourni pour envoyer des mesures à la Gateway via curl. Le script envoie
des mesures toutes les 2 secondes avec une valeur pour la key "temperature" aléatoire entre -30 et 40.

```bash
make measurement
```

## Conclusion

Ce projet est un POC pour montrer comment gRPC et SSE peuvent être utilisés pour synchroniser des événements
en temps réel entre un backend et une application frontend. Il est facile à installer et à utiliser, et peut servir de
base pour des projets plus complexes.