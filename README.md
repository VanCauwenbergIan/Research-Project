# Research-Project
## VR integratie in een webshop met behulp van Three.js
In dit project spits ik me toe op de volgende vraag:

**Hoe kun je VR integreren in een interactieve 3D-webshop van computeronderdelen met behulp van Three.js?**

Hoewel VR al meer toepassingen kent dan enkele jaren terug, wordt het nog vaak al dan niet terecht gezien als een gimmick. Vaak was deze technologie ontoegankelijk en duur, maar ook hier komt verandering in. Sterkere mobile devices, standalone headsets zoals de Quest, vooruitgang voor APIs zoals Three.js en webGL, … Ze zorgen allemaal voor een lagere toegangsdrempel en betere XR ervaringen, ook in de browser. Deze zijn echter vaak nog beperkt tot games en entertainment, maar veel bedrijven onderzoeken ook toepassingen op het vlak van e-commerce.

## Getting started
**De gebruikers- en installatiehandleiding kun je beide terugvinden in de docs folder.**

## Gebruikte technologieën 
Ik heb er bewust voor gekozen om **geen JS framework** te gebruiken voor de frontend. Vaak hebben deze nog een beperkte integratie met Three.js, waardoor ze in dit geval weinig tot geen meerwaarde bieden (of zelfs problemen). Hier is tot nu toe één uitzondering op:  React Three Fiber. Indien je voorkeur uitgaat naar React lijkt me dit geen slechte keuze. 

Wel raad ik aan om vanaf het begin aan al te denken aan een vaste structuur en je er aan te houden. Ik heb mijn scene nooit ondergebracht in een aparte class (zoals ik dat wel deed voor andere objecten zoals de loaders en controls) en dat maakte het later moeilijk om de code verder op te splitsen. Het gevolg? Een ellendig lange main.js file of alles reformaten. Dat is dan weer het voordeel van een framework, die dit een stuk uit handen neemt.

Voor de backend heb ik gebruik gemaakt van **node.js, specifiek nest.js, en mongoDB**.

## Hoe werkt het?
In de docs folder bevindt zich een kleine demo.

## Mogelijke uitbreidingen
- Experimenteren met de mogelijkheden van de webXR API, hier had ik jammer genoeg geen tijd meer voor.
- Verder uitwerking UI: bvb. als je over een component hovert krijg je meer informatie te zien.
- Bestaande code refactoren naar een betere projectstructuur. Ook zou je de vergelijking kunnen maken met R3F en wat een betere development ervaring geeft, hoe vlot de integratie is met andere frameworks, …
