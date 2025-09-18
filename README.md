This is a React Native Project that was meant to help people make teams from the Pokemon they have caught in Pokemon Soulocke runs, based on the Mr. Fruit(Youtuber) ruleset. This started out as just something to run on my own computer but has recently evolved into a website. Current version supports the Sun/Moon Pokedex.

# Website: [SoulockeForge](https://soulockeforge.netlify.app/)

# Known Issues:
1.  This was originally desined to be perfectly sized to my screen so it's not fully compatible to all users and their screen sizes, especially mobile.
2.  Extra Form Names stretch further than intended.
3.  Some sprites tend to dissappear.
4.  Untested swapping Mono flying type in Flyer Edits menu.
5.  Need to make Stat section box sizes static instead of dynamically sizing to amount in the container.

# Possible Updates:
1. More tweaking for the website to work on more monitor sizes and possibly even mobile.
2. Adding in a game selection choice to choose between different pokedex's.
3. Easier typing adjustments for pokemon like Arceus or Silvally.
4. Add/Remove pairs to Soulocke version (Added)
5. Ability to evolve a pokemon from the team generation page.
6. Ability to click a sprite to bring up a pokedex style page.

# How to use:
![Choose between Nuzlocke and Soulocke version](/assets/readMePictures/versionChoice.PNG)
This will be the default page you are greeted with. The Nuzlocke version was mainly used as a testing ground and setting the framework for the Soulocke version. It's missing a few features that the Soulocke side has as it's not the primary concern, but essentially choose which version you want to use.
![Trainer 1 Choices](/assets/readMePictures/default.PNG)
This is what the next page will look like if you choose Nuzlocke or Soulocke. If you use the Nuzlocke version just choose the Pokemon you want to use and click confirm. If you are in the Soulocke version it will say Trainer 1 in the top left. So whoever is designated as Trainer 1 will choose all of the Pokemon they have and then click confirm. Unclicking a picture will deselect a choice.
![Trainer 2 Choices](/assets/readMePictures/trainer2Selection.PNG)
This is the page you will go to for Trainer 2. Looks almost exactly the same as before except the top left will say Trainer 2 and on the top right it shows a picture of the Trainer 1's pokemon their next pick will match to. You can track the choice you are on in the confirm button by noticing the #/# inside the button. Since trainer 1 and trainer 2 pokemon are all pairs it won't let Trainer 2 choose more than Trainer 1.
![Search](/assets/readMePictures/search.PNG)
If you are having problems finding a certain Pokemon you can use the search bar at the top. It searches for all varitions of what you search for so if you can only remember part of the name you can still find it. For example if you can only remember the "Chu" in "Pikachu" you can search for "Chu" and still find it.
![Soulocke Team View](/assets/readMePictures/soulockeBaseView.png)
This is the page that will display all of the teams available after selecting confirm on Trainer 2. You can rotate between the teams using the previous and next buttons at the top, and refine the results by using the options bar. The options there are again based off of the Mr. Fruit ruleset and should be self explanitory outside of Focus. Focus is an option to choose a pair and that pair will be in every variation of teams that are presented. Also if you notice some typings in the Weaknesses section may have a glow to them. This is meant as a warning that this type doesn't have a match in the resistances section, or put simply, no pokemon on that team resist that type.
![Flyer Edits](/assets/readMePictures/flyerEdits.png)
This is the Flyer Edits menu that allows the user to swap the Primary and Secondary typing of a Pokemon. The red box indicates the pokemon being modified in the pair.
