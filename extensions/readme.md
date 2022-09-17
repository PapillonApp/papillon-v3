# Extensions sur Papillon
Pronote+ 3.7 arrive avec une nouvelle fonctionnalité : **les extensions**.
***Voici comment créer les votres 😍 :***

## Pré-requis

 - [x] **Un repo GitHub ou un serveur web pour hébérger l'extension**
 - [x] Des bases en JavaScript et en HTML / CSS *(si votre extension à une interface)*

## Création du manifest
Le fichier principal pour une extension Papillon est le fichier `papillonManifest.json`. En voici un exemple :
```json
{
	"name": "Hello World",
	"author": "ecnivtwelve",
	"authorDisplayName": "Vincent Linise",
	"description": "Pour faire un Hello World",
	"icon": "front_hand",
	"javascript": [
		"helloworld.js"
	],
	"css": [],
	"tabs": [
		{
		"name": "Hello World",
		"icon": "front_hand",
		"path": "ecnivtwelve.hellworld",
		"html": "helloworld.html"
		}
	]
}
```
Les premieres colonnes sont simples à comprendre, donc je me n'y attarde pas.

Les parties `"javascript"` et `"css"` contiennent le chemin des fichiers script et CSS que vous souhaitez **ajouter** à l'interface de Pronote+. Les chemins sont **relatifs** (partent du même dossier que le manifest).

La partie `tabs` liste tous les onglets supplémentaires du menu relatifs à votre extension. Les icônes viennent des [Material Symbols](https://fonts.google.com/icons) . `path` doit être un nom **unique** à votre extension.
Le chemin `"html"` est lui aussi relatif.

## Développement
Vos fichiers JS sont chargés dans des `<script>` à la racine de l'interface. Ceux-ci ont accès à toutes les données et variables de Pronote+. En voici qui pourront être utiles.
### Variables (liste non exhaustive)
|nom de la var.| utilité | exemple de contenu |
|--|--|--|
| `userEverything` | Donne toutes les informations sur l'utilisateur | `{name: 'LINISE Vincent', avatar: 'https://abdef.index-education.net/...'}` |
| `myName` | Nom complet et formaté de l'utilisateur | `Vincent LINISE` |
| `avatar` | URL (absolue ou base64) de l'avatar de l'utilisateur | `data:image/png;base64,iVBORw0KGgohEUgAAAMg...` |
| `rn` | Date actuelle de Pronote+ | `Mon Sep 19 2022 16:29:04 GMT+0200 (heure d’été d’Europe centrale)` |
| `allMarks` | Liste de toutes les notes **(Fonctionne uniquement après l'ouverture de la tab des notes)** | `[..., ..., ..., ...,]` |
| `version` et `release` | Version actuelle de Pronote+ | `"3.6 stable"`, `"3.6"` |
| `installedExtensions` | Liste des extensions installées | `["...", "...", "...", "...",]` |

Il y a aussi des fonctions qui pourront être utiles.

### Fonctions (liste non exhaustive)
|nom de la fonct.| utilité | usage |
|--|--|--|
| `rnNext()` et `rnPrev()` | Permet de se déplacer dans le calendrier d'**1** jour. |  |
| `getRn(add, type)` | Donne la date actuelle sous une string. (add indique le nombre de jours d'écart dans la string et type le format) | `getRn(1, false)` |
| `view(href, title, prog)` | Permet d'ouvrir une tab. | `view("edt", "Emploi du temps", true)` |
| `openMenu()` et `closeMenu()` | Ouvre et ferme le menu. |  |
| `allRefresh()` | Rafraîchit la tab en cours sans rafraichir toute la page. |  |
| `changeName()` et `changePic()` | Ouvre le dialogue pour changer de nom ou d'avatar. |  |
| `setMenuTabContent(text)` | Ajoute un sous-titre dans la barre du haut. | `setMenuTabContent('${length} cours pour aujourd'hui')` |

Concernant le CSS et le HTML des composants disponibles, il y en a vraiment beaucoup : je vous invite a lire le code des autres tabs. Voici des composants très utilisés pour vous aider quand même.
### Composants (liste non exhaustive)
#### \<cours\>
C'est le composant le plus utilisé, il affiche quelque chose dans une carte.
Le classe `file` lui ajoute une icône et d'autres changements, elle est très utilisée.
`--off: 0ms` permet de régler l'ordre d'affichage dans une liste. Si vous ne savez pas quoi faire, laissez là à 0ms.
**Si --off n'est pas présent, la div disparaîtra aussi.**
```html
<div class="cours file" style="--off: 0ms">
	<span class="material-symbols-outlined">
		error
	</span>
	<div class="cours_topData">
		<h3>Aucune extension installée</h3>
		<p>Vous n'avez pas encore installé d'extensions.</p>
	</div>
</div>
```
![image](https://user-images.githubusercontent.com/32978709/190863594-694ef615-5550-4ff0-8a32-2272629b0941.png)

Les \<cours\> se placent dans des div avec la classe `.liste` pour les arranger correctement.
```html
<div id="maDiv" class="liste">
	<div class="cours">[...]</div>
</div>
```

## Installation & test
Après que votre extension soit terminée ou prête à tester, placez la dans un serveur web ou dans un repo [GitHub Pages](https://pages.github.com/). Collez ensuite son URL dans l'app ***(profil > extensions > extension personnalisée)***
L'installation se fait directement, vous êtes prêts !

*L'extension se recharge à chaque fois que l'app se recharge et vous pouvez utiliser une URL locale de type VSCode Live Server : bien utile pour le développement !*
